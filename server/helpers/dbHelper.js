const exec = require('child_process').exec;
const fs = require('fs');
const {checkOS} = require("./osHelper");

const versionName = () => {
    const time = new Date(),
        month = time.getMonth() + 1,
        date = time.getDate(),
        year = time.getFullYear(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();

    return `${year}.${month}.${date}.${hour}.${minute}.${second}`;
}

/**
 * Tạo thư mục nếu thư mục chưa tồn tại
 * @param {*} path
 * @returns
 */
const checkDirectory = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    };

    return true;
}

/**
 * Hàm kiểm tra và chuyển kết nối cơ sở dữ liệu
 * @param {*} db kết nối đang được sử dụng đến cơ sở dữ liệu
 * @param {*} portal db muốn chuyển
 */
exports.connect = (db, portal) => {
    if (db.name !== portal) {
        return db.useDb(portal, { useCache: true });
    } else {
        return db;
    }
}

/**
 * Hàm khởi tạo models nếu chưa tồn tại
 * @param {*} db kết nối đến cơ sở dữ liệu nào đó
 * @param {*} models các models được khai báo trong thư mục models
 */
exports.initModels = (db, models) => {
    for (const [key, model] of Object.entries(models)) {
        if (!db.models[key]) model(db)
    }
}

/**
 * Khôi phục dữ liệu
 * @param {*} options Tùy chọn khôi phục dữ liệu { host, port, db, version }
 */
exports.restore = async (options) => {
    const commandRestoreDB = (options) => {
        if (!options.db) { // Restore DB cho cho toàn hệ thống
            return process.env.DB_AUTHENTICATION !== 'true' ?
                `mongorestore --drop --host="${options.host}" --port="${options.port}" ${SERVER_BACKUP_DIR}/all/${options.version}/data/database` :
                `mongorestore --username ${process.env.DB_USERNAME} --password ${process.env.DB_PASSWORD} --authenticationDatabase admin --drop --host="${options.host}" --port="${options.port}" ${SERVER_BACKUP_DIR}/all/${options.version}/data/database`;
        } else { // Restore DB cho 1 portal (1 doanh nghiệp)
            return process.env.DB_AUTHENTICATION !== 'true' ?
                `mongorestore  --drop --host="${options.host}" --port="${options.port}" -d ${options.db} ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/data/database/${options.db}` :
                `mongorestore --username ${process.env.DB_USERNAME} --password ${process.env.DB_PASSWORD} --authenticationDatabase admin --drop --host="${options.host}" --port="${options.port}" -d ${options.db} ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/data/database/${options.db}`;
        }
    }

    const commandRestoreFile = (options) => {
        if (options.db) { // Restore file cho 1 portal (1 doanh nghiệp)
            checkDirectory(`${SERVER_DIR}/upload/private/${options.db}`);
            checkDirectory(`${SERVER_DIR}/upload/avatars/${options.db}`);

            if (checkOS() === 1) {
                return {
                    delete: `rmdir /s /q ${SERVER_DIR}\\upload\\private\\${options.db}\\* && rmdir /s /q ${SERVER_DIR}\\upload\\avatars\\${options.db}\\*`,
                    new: `xcopy  ${SERVER_BACKUP_DIR}\\${options.db}\\${options.version}\\data\\private\\*  ${SERVER_DIR}\\upload\\private\\${options.db} /E/H/C/I && xcopy  ${SERVER_BACKUP_DIR}\\${options.db}\\${options.version}\\data\\avatars\\*  ${SERVER_DIR}\\upload\\avatars\\${options.db} /E/H/C/I`
                }
            } else if (checkOS() === 2) {
                return {
                    delete: `rm -rf ${SERVER_DIR}/upload/private/${options.db}/* && rm -rf ${SERVER_DIR}/upload/avatars/${options.db}/*`,
                    new: `cp -r ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/data/private/* ${SERVER_DIR}/upload/private/${options.db} && cp -r ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/data/avatars/* ${SERVER_DIR}/upload/avatars/${options.db}`
                }
            }
        }
        else { // Restore file cho toàn hệ thống
            checkDirectory(`${SERVER_DIR}`);
            if (checkOS() === 1) {
                return {
                    delete: `rmdir /s /q ${SERVER_DIR}\\upload`,
                    new: `xcopy ${SERVER_BACKUP_DIR}\\all\\${options.version}\\data\\upload ${SERVER_DIR}\\upload /E/H/C/I`
                }
            } else if (checkOS() === 2) {
                return {
                    delete: `rm -rf ${SERVER_DIR}/upload`,
                    new: `cp -r ${SERVER_BACKUP_DIR}/all/${options.version}/data/upload ${SERVER_DIR}`
                }
            }
        }
    }

    // 1. Khôi phục database
    const command = commandRestoreDB(options);
    await exec(command, (error, stdout, stderr) => {
        if (error !== null) console.log(error);
    })

    // 2. Khôi phục các file ( image, video, file, doc, excel, v.v. )
    const command2 = commandRestoreFile(options);
    exec(command2.delete, function (err) {
        if (checkOS() === 1) {
            fs.mkdirSync(`${SERVER_DIR}/upload`, {
                recursive: true
            });
        }
        exec(command2.new, function (err) { });
    });
}

/**
 * Sao lưu dữ liệu
 * @param options các option cho việc sao lưu { host, port, db, version }
 */
exports.backup = async (options) => {
    let limit = options.db ? BACKUP[options.db].limit : BACKUP['all'].limit;
    const version = versionName();
    const dbBackupPath = (options) => {
        const path = `${SERVER_BACKUP_DIR}/${options.db ? options.db : 'all'}/${version}`;
        checkDirectory(path);

        return path;
    }

    const backupPath = dbBackupPath(options);
    const description = `Backup database ${options.db ? options.db : 'all'}`;
    fs.appendFile(backupPath + '/README.txt', description, err => {
        if (err) throw err;
    });

    const commandBackupDB = (options) => {
        if (options.db) { // Backup DB cho 1 portal (1 doanh nghiệp)

            return process.env.DB_AUTHENTICATION !== 'true' ?
                `mongodump --host="${options.host}" --port="${options.port}" --out="${backupPath}/data/database" --db="${options.db}"` :
                `mongodump --username ${process.env.DB_USERNAME} --password ${process.env.DB_PASSWORD} --authenticationDatabase admin --host="${options.host}" --port="${options.port}" --out="${backupPath}/data/database" --db="${options.db}"`;
        } else { // Backup DB cho toàn hệ thống

            return process.env.DB_AUTHENTICATION !== 'true' ?
                `mongodump --host="${options.host}" --port="${options.port}" --out="${SERVER_BACKUP_DIR}/all/${version}/data/database"` :
                `mongodump --username ${process.env.DB_USERNAME} --password ${process.env.DB_PASSWORD} --authenticationDatabase admin --host="${options.host}" --port="${options.port}" --out="${SERVER_BACKUP_DIR}/all/${version}/data/database"`;
        }
    }
    const command = commandBackupDB(options);

    // 1. Backup database
    console.log('command: ', command);

    await exec(command, (error, stdout, stderr) => {
        if (error !== null) console.log(error);
    });

    const getCommandBackupFile = (options) => {
        if (options.db) { // Backup file cho 1 portal (1 doanh nghiệp)
            checkDirectory(`${SERVER_DIR}/upload/private/${options.db}`);
            checkDirectory(`${backupPath}/data/private`);
            checkDirectory(`${SERVER_DIR}/upload/avatars/${options.db}`);
            checkDirectory(`${backupPath}/data/avatars`);

            if (checkOS() === 1) {
                return `xcopy  ${SERVER_DIR}\\upload\\private\\${options.db}\\*  ${backupPath}\\data\\private /E/H/C/I && xcopy  ${SERVER_DIR}\\upload\\avatars\\${options.db}\\*  ${backupPath}\\data\\avatars /E/H/C/I`;
            } else if (checkOS() === 2) {
                return `cp -r ${SERVER_DIR}/upload/private/${options.db}/* ${backupPath}/data/private && cp -r ${SERVER_DIR}/upload/avatars/${options.db}/* ${backupPath}/data/avatars`;
            }
        } else { // Backup file cho toàn hệ thống
            checkDirectory(`${SERVER_DIR}/upload`);
            checkDirectory(`${SERVER_BACKUP_DIR}/all/${version}/data/upload`);

            if (checkOS() === 1) {
                return `xcopy  ${SERVER_DIR}\\upload\\*  ${SERVER_BACKUP_DIR}\\all\\${version}\\data\\upload /E/H/C/I`;
            } else if (checkOS() === 2) {
                return `cp -r ${SERVER_DIR}/upload/* ${SERVER_BACKUP_DIR}/all/${version}/data/upload`;
            }
        }
    }

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupFile = getCommandBackupFile(options);

    console.log('backup', commandBackupFile);
    await exec(commandBackupFile, (error, stdout, stderr) => {
        if (error) console.log(error);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
    const folderInfo = options.db ?
        fs.statSync(backupPath) :
        fs.statSync(`${SERVER_BACKUP_DIR}/all/${version}`);

    // 3. Kiểm tra giới hạn số lượng backup
    if (limit) {
        const list = options.db ? fs.readdirSync(`${SERVER_BACKUP_DIR}/${options.db}`) : fs.readdirSync(`${SERVER_BACKUP_DIR}/all`);
        const newList = list.map(folder => {
            const folderInfo = options.db ?
                fs.statSync(`${SERVER_BACKUP_DIR}/${options.db}/${folder}`) :
                fs.statSync(`${SERVER_BACKUP_DIR}/all/${folder}`);
            return {
                version: folder,
                createdAt: folderInfo.ctime
            }
        });
        newList.sort(function (a, b) {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            return 0;
        });
        if (limit > 0 && newList.length > limit) {
            for (let i = 0; i < newList.length; i++) {
                if (i > limit - 1) { //phiên bản cũ vượt quá số lượng backup lưu trữ (limit)
                    // xóa version backup cũ
                    if (checkOS() === 1) {
                        if (options.db) exec(`rmdir /s /q ${SERVER_BACKUP_DIR}\\${options.db}\\${newList[i].version}`, function (err) { });
                        else exec(`rmdir /s /q ${SERVER_BACKUP_DIR}\\all\\${newList[i].version}`, function (err) { });
                    } else if (checkOS() === 2) {
                        if (options.db) exec(`rm -rf ${SERVER_BACKUP_DIR}/${options.db}/${newList[i].version}`, function (err) { });
                        else exec(`rm -rf ${SERVER_BACKUP_DIR}/all/${newList[i].version}`, function (err) { });
                    }
                }
            }
        }
    }

    return {
        version,
        description: description,
        path: options.db ? backupPath : `${SERVER_BACKUP_DIR}/all/${version}`,
        createdAt: folderInfo.ctime
    }
}