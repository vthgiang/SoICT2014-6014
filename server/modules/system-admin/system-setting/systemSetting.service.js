const {backupDatabase, restoreDatabase} = require('../../../helpers/backupDatabase');
const {time} = require('cron');

exports.backup = async (data, params) => {
    const {auto} = params;
    const {period} = data;
    switch(auto) {

        case 'on':
            switch(period) {
                case 'weekly':
                    AUTO_BACKUP_DATABASE.setTime(time(`${data.second} ${data.minute} ${data.hour} * * ${data.date}`));
                    break;
                case 'monthly':
                    AUTO_BACKUP_DATABASE.setTime(time(`${data.second} ${data.minute} ${data.hour} ${data.day} * *`));
                    break;
                case 'yearly':
                    AUTO_BACKUP_DATABASE.setTime(time(`${data.second} ${data.minute} ${data.hour} ${data.day} ${data.month} *`));
                    break;
                default:
                    break;
            }
            AUTO_BACKUP_DATABASE.start();
            break;
            
        case 'off':
            await AUTO_BACKUP_DATABASE.stop();
            break;

        default:
            console.log("Sao lưu dữ liệu trực tiếp")
            await backupDatabase({
                host: process.env.DB_HOST,
                dbName: process.env.DB_NAME,
                dbPort: "27017",
                store: SERVER_BACKUP_PATH,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD
            });
            break;
    }
};

exports.restore = async (data, params) => {
    await restoreDatabase({
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbPort: "27017",
        store: SERVER_BACKUP_PATH,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    });
}