const mongoose = require('mongoose');

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

versionName = () => {
    const time = new Date(),
        month = time.getMonth() + 1,
        date = time.getDate(),
        year = time.getFullYear(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();


        return  `${year}.${month}.${date}.${hour}.${minute}.${second}`;
}

/**
 * Restore data
 * @options option to restore { host, port, db, version }
 */
exports.restore = async (options) => {
    const commandRestoreDB = (options) => {
        if(options.db === undefined){
            return `mongorestore --drop --host="${option.host}" --port="${option.port}" ${SERVER_BACKUP_DIR}/system/${options.version}/database`;
        } else {
            return `mongorestore --drop --host="${option.host}" --port="${option.port}" -d ${option.db} ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/database`;
        }
    }

    const commandRestoreFile = (options) => {
        return {
            delete: `${SERVER_DIR}/upload/private/${options.db}`,
            new: `${SERVER_BACKUP_DIR}/${option.db}/${options.version}/upload`
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
            exec(`cp -r ${command2.new} ${SERVER_DIR}`, function (err) { });
        }
    }
}

/**
 * Backup data
 * @options option to restore { host, port, db, version }
 */
exports.backup = async (options) => {
    const dbBackupPath = (options) => {
        const version = this.versionName();
        const path = `${SERVER_BACKUP_DIR}/${options.db}/${version}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {
                recursive: true
            });
        };
    
        return path;
    }

    const backupPath = dbBackupPath(options);
    const version = this.versionName();
    const description = `Backup database ${options.db}`;

    const commandBackupDB = (options) => {
        if(options.db) {
            return `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}/database" --db="${option.dbName}"`;
        }
    }

    const command = `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}/database" --db="${option.dbName}"`;
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    fs.appendFile(serverBackupStorePath+'/README.txt', descriptionBackupDB, err => { 
        if(err) throw err;
    });

    // 2. Backup file dữ liệu trong thư mục upload
    console.log("PATH:", serverBackupStorePath)
    const commandBackupDataUpload  = `cp -r "${SERVER_DIR}/upload/private/${option.dbName}" "${serverBackupStorePath}/upload"`
    await exec(commandBackupDataUpload, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${option.dbName}/${versionTime}`);

    return {
        version: versionTime,
        description: descriptionBackupDB,
        path: serverBackupStorePath,
        createdAt: folderInfo.ctime
    }
}