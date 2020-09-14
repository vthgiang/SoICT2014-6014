const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
const fs = require('fs');
const TaskManagementService = require('../task/task-management/task.service');

exports.backupAutomatic = new CronJob(SERVER_BACKUP_TIME, async function(){
    const option = {
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbPort: process.env.DB_PORT || '27017',
        store: SERVER_BACKUP_DIR,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    };
    
    getTimeMDY = () => {
        const time = new Date(),
        month = time.getMonth() + 1,
        date = time.getDate(),
        year = time.getFullYear(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();
    
        return `${date}-${month}-${year}_${hour}h${minute}m${second}s`;
    }
    
    createServerBackupDatabasePath = () => {
        const time = getTimeMDY();
        const path = `${SERVER_BACKUP_DIR}/${time}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {
                recursive: true
            });
        };
    
        return path;
    }

    const serverBackupStorePath = createServerBackupDatabasePath();
    const versionTime = getTimeMDY();
    const descriptionBackupDB = `Backup database ${option.dbName} at ${versionTime}`;
    const command = process.env.DB_AUTHENTICATION === 'true' ?
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}" --username="${option.username}" --password="${option.password}"` :
        `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}" --db="${option.dbName}"`;
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    fs.appendFile(serverBackupStorePath+'/README.txt', descriptionBackupDB, err => { 
        if(err) throw err;
    });

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupDataUpload  = `cp -r "${SERVER_DIR}/upload" "${serverBackupStorePath}"`
    await exec(commandBackupDataUpload, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });

    // 3. Kiểm tra giới hạn số phiên bản backup - xóa những phiên bản thừa
    const list = await fs.readdirSync(SERVER_BACKUP_DIR);
    const newList = list.map( folder => {
        const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${folder}`);
        return {
            version: folder,
            createdAt: folderInfo.ctime
        }
    });
    newList.sort(function(a, b){
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if(dateA > dateB) return -1;
        if(dateA < dateB) return 1;
        return 0;
    });
    if(SERVER_BACKUP_LIMIT > 0 && newList.length > SERVER_BACKUP_LIMIT)
    for (let i = 0; i < newList.length; i++) {
        if(i > SERVER_BACKUP_LIMIT - 1){ //phiên bản cũ vượt quá số lượng backup lưu trữ (SERVER_BACKUP_LIMIT)
            exec(`rm -rf ${SERVER_BACKUP_DIR}/${newList[i].version}`, function (err) { }); // xóa version backup cũ
        }
    }

}, null, false, 'Asia/Ho_Chi_Minh');

exports.sendEmailTaskAutomatic = new CronJob('0 0 8 * * 0', TaskManagementService.sendEmailCheckTaskLastMonth(), null, false, 'Asia/Ho_Chi_Minh');