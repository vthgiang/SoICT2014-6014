const { backup, restore, versionName } = require("../../../helpers/dbHelper");
const { connect } = require("../../../helpers/dbHelper");
const { time } = require('cron');
const fs = require('fs');
const exec = require('child_process').exec;
const { Configuration } = require(`../../../models`);

exports.getBackups = () => {
    if (!fs.existsSync(`${SERVER_BACKUP_DIR}/all`)) {
        fs.mkdirSync(`${SERVER_BACKUP_DIR}/all`, {
            recursive: true
        });
    };
    const list = fs.readdirSync(`${SERVER_BACKUP_DIR}/all`);

    const backupedList = [];
    list.forEach(dir => {

        // Nếu là thư mục có file README.txt -> là thư mục backup
        if (fs.existsSync(`${SERVER_BACKUP_DIR}/all/${dir}/README.txt`)) {
            const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/all/${dir}`);
            const description = fs.readFileSync(`${SERVER_BACKUP_DIR}/all/${dir}/README.txt`, { encoding: 'utf8', flag: 'r' });

            backupedList.push({
                version: dir,
                path: `${SERVER_BACKUP_DIR}/all/${dir}`,
                description,
                createdAt: folderInfo.ctime
            });
        }
    });

    return backupedList;
}

exports.configBackup = async (query, data) => {
    const { auto, schedule } = query;
    let configDB = await Configuration(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ name: 'all' });

    switch (auto) {
        case 'on':
            switch (schedule) {
                case 'weekly':
                    let timeWeekly = `${data.second} ${data.minute} ${data.hour} * * ${data.day}`;

                    if (configDB !== null) {
                        configDB.backup.time.second = data.second;
                        configDB.backup.time.minute = data.minute;
                        configDB.backup.time.hour = data.hour;
                        configDB.backup.time.date = '*';
                        configDB.backup.time.month = '*';
                        configDB.backup.time.day = data.day;
                        configDB.backup.auto = true;
                        configDB.backup.type = schedule;
                        configDB.backup.limit = data.limit;
                        await configDB.save();
                    }

                    BACKUP['all'].limit = data.limit;
                    BACKUP['all'].job.setTime(time(timeWeekly));
                    break;

                case 'monthly':
                    let timeMonthly = `${data.second} ${data.minute} ${data.hour} ${data.date} * *`;

                    if (configDB !== null) {
                        configDB.backup.time.second = data.second;
                        configDB.backup.time.minute = data.minute;
                        configDB.backup.time.hour = data.hour;
                        configDB.backup.time.date = data.date;
                        configDB.backup.time.month = '*';
                        configDB.backup.time.day = '*';
                        configDB.backup.auto = true;
                        configDB.backup.type = schedule;
                        configDB.backup.limit = data.limit;
                        await configDB.save();
                    }

                    BACKUP['all'].limit = data.limit;
                    BACKUP['all'].job.setTime(time(timeMonthly));
                    break;

                case 'yearly':
                    let timeYearly = `${data.second} ${data.minute} ${data.hour} ${data.date} ${data.month} *`;

                    if (configDB !== null) {
                        configDB.backup.time.second = data.second;
                        configDB.backup.time.minute = data.minute;
                        configDB.backup.time.hour = data.hour;
                        configDB.backup.time.date = data.date;
                        configDB.backup.time.month = data.month;
                        configDB.backup.time.day = '*';
                        configDB.backup.auto = true;
                        configDB.backup.type = schedule;
                        configDB.backup.limit = data.limit;
                        await configDB.save();
                    }

                    BACKUP['all'].limit = data.limit;
                    BACKUP['all'].job.setTime(time(timeYearly));
                    break;

                default:
                    break;
            }
            BACKUP['all'].job.start();
            break;

        default:
            configDB.backup.auto = false;
            await configDB.save();
            BACKUP['all'].job.stop();
            break;
    }
}

exports.getConfigBackup = async () => {
    console.log("get config backup system admin")
    return await Configuration(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ name: 'all' });
}

exports.createBackup = async () => {
    return await backup({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || '27017'
    });
};

exports.deleteBackup = async (version) => {
    const path = `${SERVER_BACKUP_DIR}/all/${version}`;
    if (fs.existsSync(path)) {
        exec("rm -rf " + path, function (err) { });
        return version;
    }
    return null;
}

exports.restore = async (version) => {
    await restore({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || '27017',
        store: SERVER_BACKUP_DIR,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        version
    });
}

exports.editBackupInfo = (version, data) => {
    let path = `${SERVER_BACKUP_DIR}/all/${version}`;
    if (!fs.existsSync(path)) { throw ['backup_version_deleted'] };
    fs.writeFile(path + '/README.txt', data.description, err => {
        if (err) throw err;
    });

    return {
        version,
        data
    };
}
