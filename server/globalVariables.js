global.SERVER_DIR = __dirname;
global.SERVER_BACKUP_DIR = __dirname + "/../backup";

// Init backup automatic
global.SERVER_BAKUP_TIME = '0 14 23 16 * *';
global.SERVER_BACKUP_LIMIT = 10;
global.AUTO_BACKUP_DATABASE = require("./helpers/backupHelper").backupAutomatic;
AUTO_BACKUP_DATABASE.start();

// Set time backup automatic from MongoDB
const {time} = require('cron');
const {Configuration} = require('./models').schema;
Configuration.find().then(res => {
    if(res.length > 0) {
        SERVER_BAKUP_TIME = res[0].backup.time;
        SERVER_BACKUP_LIMIT = res[0].backup.limit;
        AUTO_BACKUP_DATABASE.setTime(time(SERVER_BAKUP_TIME));
        AUTO_BACKUP_DATABASE.start();
    }
}).catch(err => console.log("message: ", err));
