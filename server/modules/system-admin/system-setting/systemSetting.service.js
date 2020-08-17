const {backup, restore} = require('../../../helpers/backupHelper');
const {time} = require('cron');
const fs = require('fs');
const exec = require('child_process').exec;

exports.backup = async (data, params) => {
    const {auto, schedule} = params;
    console.log("params", auto, schedule)
    switch(auto) {
        case 'on':
            switch(schedule) {
                case 'weekly':
                    console.log("SETUP BACKUP AUTOMATIC WEEKLY");
                    await AUTO_BACKUP_DATABASE.setTime(time(`${data.second} ${data.minute} ${data.hour} * * ${data.day}`));
                    break;
                case 'monthly':
                    console.log("SETUP BACKUP AUTOMATIC MONTHLY");
                    await AUTO_BACKUP_DATABASE.setTime(time(`${data.second} ${data.minute} ${data.hour} ${data.date} * *`));
                    break;
                case 'yearly':
                    console.log("SETUP BACKUP AUTOMATIC YEARLY");
                    await AUTO_BACKUP_DATABASE.setTime(time(`${data.second} ${data.minute} ${data.hour} ${data.date} ${data.month} *`));
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
    console.log("path:", path)

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
    console.log("listbackup:", list)
    const backupedList = list.map( dir => {
        const subPath = `${SERVER_BACKUP_DIR}/${dir}/README.txt`;
        const description = fs.readFileSync(subPath, {encoding:'utf8', flag:'r'});
        
        return {
            version: dir,
            path: `${SERVER_BACKUP_DIR}/${dir}`,
            description
        }
    })

    return backupedList;
}