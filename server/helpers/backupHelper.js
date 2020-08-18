const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
require('dotenv').config('../.env');
const fs = require('fs');

const option = {
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT || '27017',
    store: SERVER_BACKUP_DIR,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
};

/**
 * Lấy string đặt tên cho thư mục backup từ date hiện tại
 */
getTimeMDY = () => {
    const time = new Date(),
    month = time.getMonth() + 1,
    date = time.getDate(),
    year = time.getFullYear(),
    hour = time.getHours(),
    minute = time.getMinutes(),
    second = time.getSeconds();

    return `${date}-${month}-${year}_${hour}h${minute}m${second}s`;
}


/**
 * Tạo đường dẫn lưu dữ liệu backup
 */
createServerBackupDatabasePath = () => {
    const time = getTimeMDY();
    const path = `${SERVER_BACKUP_DIR}/${time}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    };

    return path;
}

/**
 * Restore dữ liệu
 */
exports.restore = async (backupVersion, option) => {

    // 1. Restore database
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" --username="${option.username}" --password="${option.password}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${backupVersion}/${option.dbName}` :
        `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${backupVersion}/${option.dbName}`;
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    })

    // 2.Restore file data
    const uploadPathServer = `${SERVER_DIR}/upload`;
    const uploadRestore = `${SERVER_BACKUP_DIR}/${backupVersion}/upload`;
    if (fs.existsSync(uploadPathServer)) {
        exec(`rm -rf ${uploadPathServer}`, function (err) { });
        if(fs.existsSync(uploadRestore)){
            exec(`cp -r ${uploadRestore} ${SERVER_DIR}`, function (err) { });
        }
    }
}

/**
 * Backup dữ liệu
 */
exports.backup = async (option) => {
    const serverBackupStorePath = createServerBackupDatabasePath();
    const versionTime = getTimeMDY();
    const descriptionBackupDB = `Backup database ${option.dbName} at ${versionTime}`;
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}"`;
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    fs.appendFile(serverBackupStorePath+'/README.txt', descriptionBackupDB, err => { 
        if(err) throw err;
    });

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupDataUpload  = `cp -r "${SERVER_DIR}/upload" "${serverBackupStorePath}"`
    await exec(commandBackupDataUpload, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${versionTime}`);

    return {
        version: versionTime,
        description: descriptionBackupDB,
        path: serverBackupStorePath,
        createdAt: folderInfo.ctime
    }
}


/**
 * Backup dữ liệu tự động
 */
exports.backupAutomatic = new CronJob(SERVER_BAKUP_TIME, async function(){
    const serverBackupStorePath = createServerBackupDatabasePath();
    const versionTime = getTimeMDY();
    const descriptionBackupDB = `Backup database ${option.dbName} at ${versionTime}`;
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}"`;
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    fs.appendFile(serverBackupStorePath+'/README.txt', descriptionBackupDB, err => { 
        if(err) throw err;
    });

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupDataUpload  = `cp -r "${SERVER_DIR}/upload" "${serverBackupStorePath}"`
    await exec(commandBackupDataUpload, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });

    // 3. Kiểm tra giới hạn số phiên bản backup - xóa những phiên bản thừa
    const list = await fs.readdirSync(SERVER_BACKUP_DIR);
    const newList = list.map( folder => {
        const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${folder}`);
        return {
            version: folder,
            createdAt: folderInfo.ctime
        }
    });
    newList.sort(function(a, b){
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if(dateA > dateB) return -1;
        if(dateA < dateB) return 1;
        return 0;
    });
    if(SERVER_BACKUP_LIMIT > 0 && newList.length > SERVER_BACKUP_LIMIT)
    for (let i = 0; i < newList.length; i++) {
        if(i > SERVER_BACKUP_LIMIT - 1){ //phiên bản cũ vượt quá số lượng backup lưu trữ (SERVER_BACKUP_LIMIT)
            exec(`rm -rf ${SERVER_BACKUP_DIR}/${newList[i].version}`, function (err) { }); // xóa version backup cũ
        }
    }

}, null, false, 'Asia/Ho_Chi_Minh');
