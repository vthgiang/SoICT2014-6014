const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
require('dotenv').config('../.env');
const BACKUP_TIME = '0 0 2 15 * *'; // chạy tự động: ngày 15 lúc 2 giờ sáng (hàng tháng)

const option = {
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: "27017",
    store: SERVER_BACKUP_PATH,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
};

exports.backupDatabase = (option) => {
    console.log("Backup database.\n");
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${option.store}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${option.store}" --db="${option.dbName}"`;
    exec(command, function (error, stdout, stderr) {
        if(error !== null){
            console.log("Backup database error\n", error, stdout, stderr);
        }
    })
}

exports.backupScheduler = new CronJob(BACKUP_TIME, function() {
        console.log("Start backup database.\n")
        const command = process.env.DB_AUTHENTICATION === 'true' ?
            `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${option.store}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
            `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${option.store}" --db="${option.dbName}"`;
        exec(command, function (error, stdout, stderr) {
            if(error !== null){
                console.log("Backup database error\n", error, stdout, stderr);
            }
        })
    }, function() {
    console.log("Stop backup datasbase.\n")
}, false, 'Asia/Ho_Chi_Minh');
