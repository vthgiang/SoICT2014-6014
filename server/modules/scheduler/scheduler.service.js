const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
const fs = require('fs');

const EmployeeController = require(`../human-resource/profile/profile.controller`);
const TaskManagementService = require('../task/task-management/task.service');
const biddingPackageController = require(`../bidding/bidding-package/biddingPackage.controller`);

exports.createNotificationForEmployeesHaveBrithdayCurrent = new CronJob('0 0 8 * * *', async function () {
    await EmployeeController.createNotificationForEmployeesHaveBrithdayCurrent();
}, null, false, 'Asia/Ho_Chi_Minh');

// exports.createNotificationEndOfContract = new CronJob('0 0 8 * * *', async function () {
//     EmployeeController.createNotificationEndOfContract();
// }, null, false, 'Asia/Ho_Chi_Minh');

exports.sendEmailTaskAutomatic = new CronJob('0 0 8 * * 0', function () {
    TaskManagementService.sendEmailCheckTaskLastMonth()
}, null, false, 'Asia/Ho_Chi_Minh');


exports.updateStatusPackagePersonStatus = new CronJob('0 8 8 * * *', async function () {
    biddingPackageController.autoUpdateEmployeeBiddingStatus();
}, null, false, 'Asia/Ho_Chi_Minh');
