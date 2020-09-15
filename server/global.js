const mongoose = require('mongoose');
const {initModels} = require('./helpers/dbHelper');

global.SERVER_DIR = __dirname;
global.SERVER_BACKUP_DIR = __dirname + "/../backup";

global.SERVER_MODELS_DIR = SERVER_DIR + "/models";
global.SERVER_MODULES_DIR = SERVER_DIR + "/modules";
global.SERVER_HELPERS_DIR = SERVER_DIR + "/helpers";
global.SERVER_MIDDLEWARE_DIR = SERVER_DIR + "/middleware";
global.SERVER_SEED_DIR = SERVER_DIR + "/seed";
global.SERVER_LOGS_DIR = SERVER_DIR + "/logs";

global.DB_CONNECTION = mongoose.createConnection(
    process.env.DATABASE || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`,
    process.env.DB_AUTHENTICATION === "true" ? 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
    } : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }
);
initModels(DB_CONNECTION, require('./models/_multi-tenant'));

// Init backup automatic
global.SERVER_BACKUP_TIME = '0 0 2 1 * *';
global.SERVER_BACKUP_LIMIT = 10;
global.AUTO_BACKUP_DATABASE = require(SERVER_MODULES_DIR+'/scheduler/scheduler.service').backupAutomatic;
AUTO_BACKUP_DATABASE.start();

// Set time backup automatic from MongoDB
// const {time} = require('cron');
// const {Configuration} = require(SERVER_MODELS_DIR).schema;
// Configuration.findOne({database: process.env.DB_NAME}).then(res => {
//     if(res !== null) {
//         const configSecond = res.backup.time.second;
//         const configMinute = res.backup.time.minute;
//         const configHour = res.backup.time.hour;
//         const configDate = res.backup.time.date;
//         const configMonth = res.backup.time.month;
//         const configDay = res.backup.time.day;
//         const serverBackupTime = `${configSecond} ${configMinute} ${configHour} ${configDate} ${configMonth} ${configDay}`

//         SERVER_BACKUP_TIME = serverBackupTime;
//         SERVER_BACKUP_LIMIT = res.backup.limit;
//         AUTO_BACKUP_DATABASE.setTime(time(SERVER_BACKUP_TIME));
//         AUTO_BACKUP_DATABASE.start();
//     }
// }).catch(err => console.log("message: ", err));

global.AUTO_SENDEMAIL_TASK = require(SERVER_MODULES_DIR+'/scheduler/scheduler.service').sendEmailTaskAutomatic ;
AUTO_SENDEMAIL_TASK.start();

global.PORTAL = process.env.DB_NAME; // tên db cần kết nối