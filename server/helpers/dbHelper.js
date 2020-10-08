const mongoose = require('mongoose');
const exec = require('child_process').exec;
const fs = require('fs');

exports.initConnect = (dbName) => {
    return mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${dbName}`,
        process.env.DB_AUTHENTICATION === "true" ? 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    );
}

exports.connect = (db, portal) => {
    if(db.name !== portal){
        return db.useDb(portal, { useCache: true });
    }else{
        return db;
    }
}

exports.initModels = (db, models) => {
    /**
     * db: 1 kết nối đến cơ sở dữ liệu nào đó 
     * models: các models được khai báo trong thư mục models
     */
    for (const [key, model] of Object.entries(models)) {
        if(!db.models[key]) model(db)
    }
}

const versionName = () => {
    const time = new Date(),
        month = time.getMonth() + 1,
        date = time.getDate(),
        year = time.getFullYear(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();

    return  `${year}${month}${date}${hour}${minute}${second}`;
}

const checkDirectory = (path, description=undefined) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    };
    fs.appendFile(path+'/README.txt', description ? description :'init directory', err => { 
        if(err) throw err;
    });

    return true;
}

/**
 * Restore data
 * @options option to restore { host, port, db, version }
 */
exports.restore = async (options) => {
    const commandRestoreDB = (options) => {
        if(!options.db){
            return `mongorestore --drop --host="${options.host}" --port="${options.port}" ${SERVER_BACKUP_DIR}/all/${options.version}/database`;
        } else {
            return `mongorestore --drop --host="${options.host}" --port="${options.port}" -d ${options.db} ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/database/${options.db}`;
        }
    }

    const commandRestoreFile = (options) => {
        if(options.db){
            return {
                delete: `rm -rf ${SERVER_DIR}/upload/private/${options.db}/* && rm -rf ${SERVER_DIR}/upload/avatars/${options.db}/*`,
                new: `cp -r ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/private/* ${SERVER_DIR}/upload/private/${options.db} && cp -r ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/avatars/* ${SERVER_DIR}/upload/avatars/${options.db}`
            }
        }
        else 
            return {
                delete: `rm -rf ${SERVER_DIR}/upload`,
                new: `cp -r ${SERVER_BACKUP_DIR}/all/${options.version}/upload ${SERVER_DIR}` 
            }
    }
    
    // 1. Restore database
    const command = commandRestoreDB(options);
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    })

    // 2.Restore file data ( image, video, file, doc, excel, v.v. )
    const command2 = commandRestoreFile(options);
    exec(command2.delete, function (err) { 
        exec(command2.new, function (err) { });
    });
}

/**
 * Backup data
 * @options option to restore { host, port, db, version }
 */
exports.backup = async (options) => {
    const version = versionName();
    const dbBackupPath = (options) => {
        const path = `${SERVER_BACKUP_DIR}/${options.db}/${version}`;
        checkDirectory(path);
    
        return path;
    }

    const backupPath = options.db ? dbBackupPath(options) : null;
    const description = `Backup database ${options.db ? options.db : 'all'}`;
    const commandBackupDB = (options) => {
        if(options.db) {
            fs.appendFile(backupPath+'/README.txt', description, err => { 
                if(err) throw err;
            });
            return `mongodump --host="${options.host}" --port="${options.port}" --out="${backupPath}/database" --db="${options.db}"`;
        }else{
            checkDirectory(`${SERVER_BACKUP_DIR}/all/${version}`, description);

            return `mongodump --host="${options.host}" --port="${options.port}" --out="${SERVER_BACKUP_DIR}/all/${version}/database"`;
        }
    }
    const command = commandBackupDB(options);
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });

    const getCommandBackupFile = (options) => {
        if(options.db) {
            checkDirectory(`${SERVER_DIR}/upload/private/${options.db}`);
            checkDirectory(`${backupPath}/private`);
            checkDirectory(`${SERVER_DIR}/upload/avatars/${options.db}`);
            checkDirectory(`${backupPath}/avatars`);

            return `cp -r ${SERVER_DIR}/upload/private/${options.db}/* ${backupPath}/private && cp -r ${SERVER_DIR}/upload/avatars/${options.db}/* ${backupPath}/avatars`;
        }else{
            checkDirectory(`${SERVER_DIR}/upload`);
            checkDirectory(`${SERVER_BACKUP_DIR}/all/${version}/upload`);

            return `cp -r ${SERVER_DIR}/upload/* ${SERVER_BACKUP_DIR}/all/${version}/upload`;
        }
    }

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupFile  = getCommandBackupFile(options);
    await exec(commandBackupFile, (error, stdout, stderr) => {
        if(error !== null) console.log("co loi roif", error);
    });
    const folderInfo = options.db ?
    fs.statSync(backupPath) :
    fs.statSync(`${SERVER_BACKUP_DIR}/all/${version}`);

    return {
        version,
        description: description,
        path: options.db ? backupPath : `${SERVER_BACKUP_DIR}/all/${version}`,
        createdAt: folderInfo.ctime
    }
}