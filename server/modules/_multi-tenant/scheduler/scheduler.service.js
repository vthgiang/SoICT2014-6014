const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
const fs = require('fs');

const EmployeeController = require(`${SERVER_MODULES_DIR}/_multi-tenant/human-resource/profile/profile.controller`);


exports.createNotificationForEmployeesHaveBrithdayCurrent = new CronJob('0 39 16 * * *', async function () {
    await EmployeeController.createNotificationForEmployeesHaveBrithdayCurrent();
}, null, false, 'Asia/Ho_Chi_Minh');

exports.createNotificationEndOfContract = new CronJob('0 39 16 * * *', async function () {
    EmployeeController.createNotificationEndOfContract();
}, null, false, 'Asia/Ho_Chi_Minh');
  