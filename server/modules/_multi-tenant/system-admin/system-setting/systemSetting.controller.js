const SystemSettingServices = require('./systemSetting.service');
const Logger = require(`${SERVER_LOGS_DIR}/_multi-tenant`);

exports.getBackupSetting = async(req, res) => {
    try {
        const content = await SystemSettingServices.getBackupSetting();
        
        Logger.info(req.user.email, 'get_backup_setting_success');
        res.status(200).json({
            success: true,
            messages: ['get_backup_setting_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_backup_setting_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_backup_setting_faile'],
            content: error
        });
    }
}

exports.backup = async(req, res) => {
    try {
        const content = await SystemSettingServices.backup(req.body, req.query);
        
        Logger.info(req.user.email, 'backup_success');
        res.status(200).json({
            success: true,
            messages: ['backup_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'backup_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['backup_faile'],
            content: error
        });
    }
};

exports.deleteBackup = async(req, res) => {
    try {
        const content = await SystemSettingServices.deleteBackup(req.params.version);
        
        Logger.info(req.user.email, 'delete_backup_success');
        res.status(200).json({
            success: true,
            messages: ['delete_backup_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'delete_backup_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_backup_faile'],
            content: error
        });
    }
};

exports.restore = async(req, res) => {
    try {
        await SystemSettingServices.restore(req.query.backupVersion);
        
        Logger.info(req.user.email, 'restore_success');
        res.status(200).json({
            success: true,
            messages: ['restore_success']
        });
    } catch (error) {

        Logger.eror(req.user.email, 'restore_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['restore_faile'],
            content: error
        });
    }
};

exports.getRestoreData = async(req, res) => {
    try {
        const data = await SystemSettingServices.getRestoreData();
        
        Logger.info(req.user.email, 'get_restore_data_success');
        res.status(200).json({
            success: true,
            messages: ['get_restore_data_success'],
            content: data
        });
    } catch (error) {

        Logger.eror(req.user.email, 'get_restore_data_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_restore_data_faile'],
            content: error
        });
    }
};
