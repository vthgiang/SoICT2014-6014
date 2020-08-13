const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
require('dotenv').config('../.env');
const BACKUP_TIME = '0 0 2 15 * *'; // chạy tự động: ngày 15 lúc 2 giờ sáng (hàng tháng)
const fs = require('fs');

const option = {
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT || '27017',
    store: SERVER_BACKUP_DIR,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
};

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

exports.restoreDB = (option) => {
    console.log("RESTORE DATABASE");
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" --username="${option.username}" --password="${option.password}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${option.dbName}` :
        `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${option.dbName}`;
    exec(command, function (error, stdout, stderr) {
        if(error !== null){
            console.log("RESTORE DATABASE ERROR", error, stdout, stderr);
        }else{
            console.log("RESTORE DATABASE SUCCESSFULLY");
        }
    })
}

backupDB = (option) => {
    console.log("BACKUP DATABASE");
    const serverBackupStorePath = createServerBackupDatabasePath();
    fs.appendFile(serverBackupStorePath+'/README.txt', `Backup database ${option.dbName} at ${getTimeMDY()}`, function (err) {
        if (err) throw err;
        console.log('Created description backup database: ', serverBackupStorePath+'/README.txt');
    });
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}"`;
    exec(command, function (error, stdout, stderr) {
        if(error !== null){
            console.log("BACKUP DATABASE ERROR", error, stdout, stderr);
        }else{
            console.log("BACKUP DATABASE SUCCESSFULLY");
        }
    })
}

exports.backupScheduler = new CronJob(BACKUP_TIME, function(){
    console.log("START BACKUP DATABASE AUTOMATIC");
    const serverBackupStorePath = createServerBackupDatabasePath();
    fs.appendFile(serverBackupStorePath+'/README.txt', `Backup database ${option.dbName} at ${getTimeMDY()}`, function (err) {
        if (err) throw err;
        console.log('Created description backup database: ', serverBackupStorePath+'/README.txt');
    });
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}"`;
    exec(command, function (error, stdout, stderr) {
        if(error !== null){
            console.log("BACKUP DATABASE AUTOMATIC ERROR: ", error, stdout, stderr);
        }else{
            console.log("BACKUP DATABASE SUCCESSFULLY");
        }
    })
}, function() {
    console.log("STOP BACKUP DATABASE AUTOMATIC")
}, false, 'Asia/Ho_Chi_Minh');
