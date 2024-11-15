const fs = require('fs');
const { backup, restore, connect } = require('../../../helpers/dbHelper');
const child_process = require('child_process');
const exec = child_process.exec;
const { Configuration } = require('../../../models');
const { time } = require('cron');

exports.getBackups = (portal) => {
    if (!fs.existsSync(`${SERVER_BACKUP_DIR}/${portal}`)) {
        fs.mkdirSync(`${SERVER_BACKUP_DIR}/${portal}`, {
            recursive: true
        });
    };
    const list = fs.readdirSync(`${SERVER_BACKUP_DIR}/${portal}`);

    let backupedList = [];
    list.forEach(version => {
        // Nếu là thư mục có file README.txt -> là thư mục backup
        if (fs.existsSync(`${SERVER_BACKUP_DIR}/${portal}/${version}/README.txt`)) {
            const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${portal}/${version}`);
            const description = fs.readFileSync(`${SERVER_BACKUP_DIR}/${portal}/${version}/README.txt`, { encoding: 'utf8', flag: 'r' });

            backupedList.push({
                version,
                path: `${SERVER_BACKUP_DIR}/${portal}/${version}`,
                description,
                createdAt: folderInfo.ctime
            });
        }
    });

    return backupedList;
}

exports.getConfigBackup = async (portal) => {
    return await Configuration(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ name: portal });
}

exports.createBackup = async (portal) => {
    return await backup({
        host: process.env.DB_HOST,
        db: portal,
        port: process.env.DB_PORT || '27017'
    });
}

exports.configBackup = async (portal, query, data) => {
    const { auto, schedule } = query;
    let configDB = await Configuration(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ name: portal });

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

                    BACKUP[portal].limit = data.limit;
                    BACKUP[portal].job.setTime(time(timeWeekly));
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

                    BACKUP[portal].limit = data.limit;
                    BACKUP[portal].job.setTime(time(timeMonthly));
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

                    BACKUP[portal].limit = data.limit;
                    BACKUP[portal].job.setTime(time(timeYearly));
                    break;

                default:
                    break;
            }
            BACKUP[portal].job.start();
            break;

        default:
            configDB.backup.auto = false;
            await configDB.save();
            BACKUP[portal].job.stop();
            break;
    }
}

exports.deleteBackup = async (version, portal = undefined) => {
    const path = portal ? `${SERVER_BACKUP_DIR}/${portal}/${version}` : `${SERVER_BACKUP_DIR}/all/${version}`;;
    if (fs.existsSync(path)) {
        exec("rm -rf " + path, function (err) { });
        return version;
    };

    return false;
};

exports.restore = async (portal, version) => {
    return await restore({
        host: process.env.DB_HOST,
        db: portal,
        port: process.env.DB_PORT || '27017',
        version
    });
}

exports.editBackupInfo = (version, data, portal) => {
    let path = SERVER_BACKUP_DIR + `/${portal}/${version}`;
    if (!fs.existsSync(path)) { throw ['backup_version_deleted'] };
    fs.writeFile(path + '/README.txt', data.description, err => {
        if (err) throw err;
    });

    return {
        version,
        data
    };
}