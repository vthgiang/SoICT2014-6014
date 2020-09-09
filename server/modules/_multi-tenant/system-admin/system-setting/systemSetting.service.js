const {backup, restore} = require(SERVER_HELPERS_DIR+'/backupHelper');
const {time} = require('cron');
const fs = require('fs');
const exec = require('child_process').exec;
const {Configuration} = require(SERVER_MODELS_DIR).schema;

exports.getBackupSetting = async() => {

}

exports.backup = async (data, params) => {
    const {auto, schedule} = params;
    switch(auto) {
        case 'on':
            switch(schedule) {
                case 'weekly':
                    let timeWeekly = `${data.second} ${data.minute} ${data.hour} * * ${data.day}`;
                    let dbWeekly = await Configuration.findOne({database: process.env.DB_NAME});
                    SERVER_BACKUP_LIMIT = data.limit;
                    if(dbWeekly !== null){
                        dbWeekly.backup.time.second = data.second;
                        dbWeekly.backup.time.minute = data.minute;
                        dbWeekly.backup.time.hour = data.hour;
                        dbWeekly.backup.time.date = '*';
                        dbWeekly.backup.time.month = '*';
                        dbWeekly.backup.time.day = data.day;

                        dbWeekly.backup.limit = data.limit;
                        
                        await dbWeekly.save();
                    }
                    await AUTO_BACKUP_DATABASE.setTime(time(timeWeekly));
                    break;
                case 'monthly':
                    let timeMonthly = `${data.second} ${data.minute} ${data.hour} ${data.date} * *`;
                    let dbMonthly = await Configuration.findOne({database: process.env.DB_NAME});
                    SERVER_BACKUP_LIMIT = data.limit;
                    if(dbMonthly !== null){
                        dbMonthly.backup.time.second = data.second;
                        dbMonthly.backup.time.minute = data.minute;
                        dbMonthly.backup.time.hour = data.hour;
                        dbMonthly.backup.time.date = data.date;
                        dbMonthly.backup.time.month = '*';
                        dbMonthly.backup.time.day = '*';

                        dbMonthly.backup.limit = data.limit;
                        await dbMonthly.save();
                    }
                    await AUTO_BACKUP_DATABASE.setTime(time(timeMonthly));
                    break;
                case 'yearly':
                    let timeYearly = `${data.second} ${data.minute} ${data.hour} ${data.date} ${data.month} *`;
                    let dbYearly = await Configuration.findOne({database: process.env.DB_NAME});
                    SERVER_BACKUP_LIMIT = data.limit;
                    if(dbYearly !== null){
                        dbYearly.backup.time.second = data.data.second;
                        dbYearly.backup.time.minute = data.data.minute;
                        dbYearly.backup.time.hour = data.data.hour;
                        dbYearly.backup.time.date = data.data.date;
                        dbYearly.backup.time.month = data.data.month;
                        dbYearly.backup.time.day = '*';

                        dbYearly.backup.limit = data.limit;
                        await dbYearly.save();
                    }
                    await AUTO_BACKUP_DATABASE.setTime(time(timeYearly));
                    break;
                default:
                    break;
            }
            await AUTO_BACKUP_DATABASE.start();
            break;
            
        case 'off':
            await AUTO_BACKUP_DATABASE.stop();
            break;

        default:
            const backupInfo = await backup({
                host: process.env.DB_HOST,
                dbName: process.env.DB_NAME,
                dbPort: process.env.DB_PORT || '27017',
                store: SERVER_BACKUP_DIR,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD
            });
            return backupInfo;
    }
    return null;
};

exports.deleteBackup = async (version) => {
    const path = `${SERVER_BACKUP_DIR}/${version}`;
    if (fs.existsSync(path)) {
        exec("rm -rf " + path, function (err) { });
        return version;
    }
    return null;
}

exports.restore = async (backupVersion) => {
    await restore(backupVersion, {
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbPort: process.env.DB_PORT || '27017',
        store: SERVER_BACKUP_DIR,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    });
}

exports.getRestoreData = async () => {
    if (!fs.existsSync(SERVER_BACKUP_DIR)) {
        fs.mkdirSync(SERVER_BACKUP_DIR, {
            recursive: true
        });
    };
    const list = await fs.readdirSync(SERVER_BACKUP_DIR);
    const backupedList = list.map( dir => {
        const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${dir}`);
        const subPath = `${SERVER_BACKUP_DIR}/${dir}/README.txt`;
        const description = fs.readFileSync(subPath, {encoding:'utf8', flag:'r'});
        
        return {
            version: dir,
            path: `${SERVER_BACKUP_DIR}/${dir}`,
            description,
            createdAt: folderInfo.ctime
        }
    })

    return backupedList;
}