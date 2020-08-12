const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
require('dotenv').config('../.env');
global.SCHEDULE = '0 26 9 * * *'; //mặc định chạy vào ngày 15 hàng tháng

const dbConfig = {
    HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: "27017",
    DB_STORE: "D:/backup",
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD
}

const job = new CronJob(SCHEDULE, function() {
    console.log("backup data")
    exec(`mongodump --host="${dbConfig.HOST}" --port="${dbConfig.DB_PORT}" --out="${dbConfig.DB_STORE}" --db="${dbConfig.DB_NAME}" --username="thai" --password="123456"`, 
    function (error, stdout, stderr) {
        console.log("Error backup data:", error)
    });
}, null, true, 'Asia/Ho_Chi_Minh');

if(process.env.DB_BACKUP === 'true'){
    job.start();
}