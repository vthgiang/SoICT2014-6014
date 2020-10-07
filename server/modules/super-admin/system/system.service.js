const fs = require('fs');
const {backup, restore} = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const child_process = require('child_process');
const exec = child_process.exec;

exports.getBackups = async(portal) => {
    if (!fs.existsSync(`${SERVER_BACKUP_DIR}/${portal}`)) {
        fs.mkdirSync(`${SERVER_BACKUP_DIR}/${portal}`, {
            recursive: true
        });
    };
    const list = await fs.readdirSync(`${SERVER_BACKUP_DIR}/${portal}`);
    const backupedList = list.map( version => {
        const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${portal}/${version}`);
        const description = fs.readFileSync(`${SERVER_BACKUP_DIR}/${portal}/${version}/README.txt`, {encoding:'utf8', flag:'r'});
        
        return {
            version,
            path: `${SERVER_BACKUP_DIR}/${portal}/${version}`,
            description,
            createdAt: folderInfo.ctime
        }
    });

    return backupedList;
}

exports.createBackup = async(portal) => {
    return backup({
        host: process.env.DB_HOST,
        db: portal,
        port: process.env.DB_PORT || '27017'
    });
}

exports.deleteBackup = async(version, portal=undefined) => {
    const path = portal ? `${SERVER_BACKUP_DIR}/${portal}/${version}` : `${SERVER_BACKUP_DIR}/all/${version}`;;
    if (fs.existsSync(path)) {
        exec("rm -rf " + path, function (err) { });
        return version;
    };

    return false;
};

exports.restore = async(portal, version) => {
    console.log("restore: ", portal, version)
    return await restore({
        host: process.env.DB_HOST,
        db: portal,
        port: process.env.DB_PORT || '27017',
        version
    });
}