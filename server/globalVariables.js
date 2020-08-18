global.SERVER_DIR = __dirname;
global.SERVER_BACKUP_DIR = __dirname + "/../backup";

global.SERVER_MODELS_DIR = SERVER_DIR + "/models";
global.SERVER_MODULES_DIR = SERVER_DIR + "/modules";
global.SERVER_HELPERS_DIR = SERVER_DIR + "/helpers";
global.SERVER_MIDDLEWARE_DIR = SERVER_DIR + "/middleware";

// Init backup automatic
global.SERVER_BAKUP_TIME = '0 0 2 1 * *';
global.SERVER_BACKUP_LIMIT = -1;
global.AUTO_BACKUP_DATABASE = require("./helpers/backupHelper").backupAutomatic;
AUTO_BACKUP_DATABASE.start();

// Set time backup automatic from MongoDB
const {time} = require('cron');
const {Configuration} = require(SERVER_MODELS_DIR).schema;
Configuration.findOne({database: process.env.DB_NAME}).then(res => {
    if(res !== null) {
        const configSecond = res.backup.time.second;
        const configMinute = res.backup.time.minute;
        const configHour = res.backup.time.hour;
        const configDate = res.backup.time.date;
        const configMonth = res.backup.time.month;
        const configDay = res.backup.time.day;
        const serverBackupTime = `${configSecond} ${configMinute} ${configHour} ${configDate} ${configMonth} ${configDay}`

        SERVER_BAKUP_TIME = serverBackupTime;
        SERVER_BACKUP_LIMIT = res.backup.limit;
        AUTO_BACKUP_DATABASE.setTime(time(SERVER_BAKUP_TIME));
        AUTO_BACKUP_DATABASE.start();
    }
}).catch(err => console.log("message: ", err));
