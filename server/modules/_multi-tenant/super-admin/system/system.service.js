const fs = require('fs');
const {backup} = require(`${SERVER_HELPERS_DIR}/backupHelper`);
const child_process = require('child_process');
const exec = child_process.exec;

exports.getBackups = async(portal) => {
    if (!fs.existsSync(`${SERVER_BACKUP_DIR}/${portal}`)) {
        fs.mkdirSync(`${SERVER_BACKUP_DIR}/${portal}`, {
            recursive: true
        });
    };
    const list = await fs.readdirSync(`${SERVER_BACKUP_DIR}/${portal}`);
    const backupedList = list.map( dir => {
        const folderInfo = fs.statSync(`${`${SERVER_BACKUP_DIR}/${portal}`}/${dir}`);
        const subPath = `${`${SERVER_BACKUP_DIR}/${portal}`}/${dir}/README.txt`;
        const description = fs.readFileSync(subPath, {encoding:'utf8', flag:'r'});
        
        return {
            version: dir,
            path: `${`${SERVER_BACKUP_DIR}/${portal}`}/${dir}`,
            description,
            createdAt: folderInfo.ctime
        }
    });

    return backupedList;
}

exports.createBackup = async(portal) => {
    return backup({
        host: process.env.DB_HOST,
        dbName: portal,
        dbPort: process.env.DB_PORT || '27017',
        store: SERVER_BACKUP_DIR
    });
}

exports.deleteBackup = async(portal, version) => {
    const path = `${SERVER_BACKUP_DIR}/${portal}/${version}`;
    if (fs.existsSync(path)) {
        exec("rm -rf " + path, function (err) { });
        return path;
    };

    return undefined;
};

exports.restore = async(portal, version) => {
    return await backup(version, {
        host: process.env.DB_HOST,
        dbName: portal,
        dbPort: process.env.DB_PORT || '27017',
        store: SERVER_BACKUP_DIR
    });
}