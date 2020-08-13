const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
require('dotenv').config('../.env');
const BACKUP_TIME = '55 50 14 * * *'; // chạy tự động: ngày 15 lúc 2 giờ sáng (hàng tháng)
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
    const path = `${SERVER_BACKUP_DIR}/database/${time}`;
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
exports.restore = async (option) => {

    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" --username="${option.username}" --password="${option.password}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${option.dbName}` :
        `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${option.dbName}`;
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    })
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
    // await exec();

    return {
        version: versionTime,
        description: descriptionBackupDB,
        path: serverBackupStorePath+'/'+process.env.DB_NAME
    }
}


/**
 * Backup dữ liệu tự động
 */
exports.backupAutomatic = new CronJob(BACKUP_TIME, async function(){

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
    // await exec();

}, null, false, 'Asia/Ho_Chi_Minh');
