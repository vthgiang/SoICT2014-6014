const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
const job = new CronJob('30 32 17 * * *', function() {
    console.log("backup data")
    exec('mongodump --host="localhost" --port="27017" --out="D:/backup" --db="qlcv"', 
    function (error, stdout, stderr) {
        console.log("Error backup data:", error)
    });
}, null, true, 'Asia/Ho_Chi_Minh');
job.start();