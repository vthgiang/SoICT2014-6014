const AUTO_SENDEMAIL_TASK = require('./modules' +
    '/scheduler/scheduler.service').sendEmailTaskAutomatic;
AUTO_SENDEMAIL_TASK.start();

const AUTO_CREATE_NOTIFICATION_BIRTHDAY = require('./modules' +
    '/scheduler/scheduler.service').createNotificationForEmployeesHaveBrithdayCurrent;
AUTO_CREATE_NOTIFICATION_BIRTHDAY.start();

const AUTO_CREATE_NOTIFICATION_END_CONTRACT = require('./modules' +
    '/scheduler/scheduler.service').createNotificationEndOfContract;
AUTO_CREATE_NOTIFICATION_END_CONTRACT.start();

const AUTO_UPDATE_STATUS_PACKAGE_PERSONAL = require('./modules' +
    '/scheduler/scheduler.service').updateStatusPackagePersonStatus;
AUTO_UPDATE_STATUS_PACKAGE_PERSONAL.start();

const PORTAL = process.env.DB_NAME;

module.exports = {
    AUTO_SENDEMAIL_TASK,
    AUTO_CREATE_NOTIFICATION_BIRTHDAY,
    AUTO_CREATE_NOTIFICATION_END_CONTRACT,
    AUTO_UPDATE_STATUS_PACKAGE_PERSONAL,
    PORTAL,
}


