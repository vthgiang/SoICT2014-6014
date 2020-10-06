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
        if(options.db)
            return {
                delete: `${SERVER_DIR}/upload/private/${options.db}`,
                new: `${SERVER_BACKUP_DIR}/${options.db}/${options.version}/upload`
            }
        else 
            return {
                delete: `${SERVER_DIR}/upload}`,
                new: `${SERVER_BACKUP_DIR}/all/${options.version}/upload` 
            }
    }
    
    // 1. Restore database
    const command = commandRestoreDB(options);
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    })

    // 2.Restore file data ( image, video, file, doc, excel, v.v. )
    const command2 = commandRestoreFile(options);
    if (fs.existsSync(command2.delete)) {
        exec(`rm -rf ${command2.delete}`, function (err) { });
        if(fs.existsSync(command2.new)){
            if(options.db) 
                exec(`cp -r ${command2.new} ${SERVER_DIR}/upload/private`, function (err) { });
            else    
                exec(`cp -r ${command2.new} ${SERVER_DIR}`, function (err) { });
        }
    }
}

/**
 * Backup data
 * @options option to restore { host, port, db, version }
 */
exports.backup = async (options) => {
    const version = versionName();
    const dbBackupPath = (options) => {
        const path = `${SERVER_BACKUP_DIR}/${options.db}/${version}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {
                recursive: true
            });
        };
    
        return path;
    }

    const backupPath = dbBackupPath(options);
    const description = `Backup database ${options.db ? options.db : 'all'}`;
    const commandBackupDB = (options) => {
        if(options.db) {
            fs.appendFile(backupPath+'/README.txt', description, err => { 
                if(err) throw err;
            });
            return `mongodump --host="${options.host}" --port="${options.port}" --out="${backupPath}/database" --db="${options.db}"`;
        }else{
            fs.appendFile(`${SERVER_BACKUP_DIR}/all/${version}`+'/README.txt', description, err => { 
                if(err) throw err;
            });
            return `mongodump --host="${options.host}" --port="${options.port}" --out="${SERVER_BACKUP_DIR}/all/${version}"`;
        }
    }
    const command = commandBackupDB(options);
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });

    const getCommandBackupFile = (options) => {
        if(options.db) {
            return `cp -r "${SERVER_DIR}/upload/private/${options.db}" "${backupPath}/upload/private" && cp -r "${SERVER_DIR}/upload/avatars/${options.db}" "${backupPath}/upload/avatars"`;
        }else{
            return `cp -r "${SERVER_DIR}/upload" "${SERVER_BACKUP_DIR}/all/${version}/upload"`;
        }
    }

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupFile  = getCommandBackupFile(options);
    await exec(commandBackupFile, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
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