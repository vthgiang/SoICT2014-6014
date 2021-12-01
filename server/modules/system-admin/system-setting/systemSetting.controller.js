const SystemSettingServices = require('./systemSetting.service');
const Logger = require(`../../../logs`);
const fs = require('fs');
const archiver = require('archiver');

exports.getBackups = async (req, res) => {
    try {
        const content = await SystemSettingServices.getBackups();

        Logger.info(req.user.email, 'get_backups_success');
        res.status(200).json({
            success: true,
            messages: ['get_backups_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_backups_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_backups_failure'],
            content: error
        });
    }
}

exports.getConfigBackup = async (req, res) => {
    try {
        const content = await SystemSettingServices.getConfigBackup();

        Logger.info(req.user.email, 'get_config_backup_success');
        res.status(200).json({
            success: true,
            messages: ['get_config_backup_success'],
            content
        });
    } catch (error) {
        console.log(error)

        Logger.error(req.user.email, 'get_config_backup_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_config_backup_failure'],
            content: error
        });
    }
}

exports.configBackup = async (req, res) => {
    try {
        await SystemSettingServices.configBackup(req.query, req.body);

        Logger.info(req.user.email, 'config_backup_success');
        res.status(200).json({
            success: true,
            messages: ['config_backup_success']
        });
    } catch (error) {

        Logger.error(req.user.email, 'config_backup_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['config_backup_failure'],
            content: error
        });
    }
};

exports.createBackup = async (req, res) => {
    try {
        const content = await SystemSettingServices.createBackup(req.body, req.query);

        Logger.info(req.user.email, 'backup_success');
        res.status(200).json({
            success: true,
            messages: ['backup_success'],
            content
        });
    } catch (error) {
        console.log("Co", error)

        Logger.error(req.user.email, 'backup_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['backup_failure'],
            content: error
        });
    }
};

exports.deleteBackup = async (req, res) => {
    try {
        const content = await SystemSettingServices.deleteBackup(req.params.version);

        Logger.info(req.user.email, 'delete_backup_success');
        res.status(200).json({
            success: true,
            messages: ['delete_backup_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'delete_backup_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_backup_failure'],
            content: error
        });
    }
};

exports.restore = async (req, res) => {
    try {
        await SystemSettingServices.restore(req.params.version);

        Logger.info(req.user.email, 'restore_success');
        res.status(200).json({
            success: true,
            messages: ['restore_success']
        });
    } catch (error) {

        Logger.error(req.user.email, 'restore_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['restore_failure'],
            content: error
        });
    }
};

exports.downloadBackup = async(req, res) => {
    try {
        let {path} = req.query;
        if (fs.existsSync(path+'/data.zip')) {
            res.download(path+'/data.zip');
        } else {
            const output = fs.createWriteStream(path + "/data.zip");
            const archive = archiver('zip');
        
            archive.pipe(output);
            archive.directory(path+'/data', false);
            archive.on('error', (err) => {
                throw(err);
            });
            archive.on('end', function() {
                setTimeout(()=>{
                    res.download(path+'/data.zip');
                }, 3000)
            })
            archive.finalize('close');
        }
        Logger.info(req.user.email, 'download_backup_success', req.portal);
    } catch (error) {

        Logger.error(req.user.email, 'download_backup_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_backup_failure'],
            content: error
        })
    }
}

exports.editBackupInfo = async(req, res) => {
    try {
        let {version} = req.params;
        let data = await SystemSettingServices.editBackupInfo(version, req.body);

        Logger.info(req.user.email, 'edit_backup_info_success');
        res.status(200).json({
            success: true,
            messages: ['edit_backup_info_success'],
            content: data
        })
    } catch (error) {

        Logger.error(req.user.email, 'edit_backup_info_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_backup_info_failure'],
            content: error
        })
    }
}
