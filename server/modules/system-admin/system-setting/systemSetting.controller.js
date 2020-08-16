const SystemSettingServices = require('./systemSetting.service');

exports.backup = async(req, res) => {
    try {
        const content = await SystemSettingServices.backup(req.body, req.query);
        
        // LogInfo(req.user.email, 'BACKUP_SCHEDULE');
        res.status(200).json({
            success: true,
            messages: ['backup_success'],
            content
        });
    } catch (error) {
        console.log("backup error:", error)
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
        
        // LogInfo(req.user.email, 'BACKUP_SCHEDULE');
        res.status(200).json({
            success: true,
            messages: ['delete_backup_success'],
            content
        });
    } catch (error) {
        console.log("backup error:", error)
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
        
        // LogInfo(req.user.email, 'BACKUP_SCHEDULE');
        res.status(200).json({
            success: true,
            messages: ['restore_success']
        });
    } catch (error) {
        // LogError(req.user.email, 'BACKUP');
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
        
        // LogInfo(req.user.email, 'BACKUP_SCHEDULE');
        res.status(200).json({
            success: true,
            messages: ['get_restore_data_success'],
            content: data
        });
    } catch (error) {
        // LogError(req.user.email, 'BACKUP');
        console.log("error", error)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_restore_data_faile'],
            content: error
        });
    }
};
