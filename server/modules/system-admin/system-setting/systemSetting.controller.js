const SystemSettingServices = require('./systemSetting.service');

exports.backup = async(req, res) => {
    try {
        await SystemSettingServices.backup(req.body, req.query);
        
        // LogInfo(req.user.email, 'BACKUP_SCHEDULE');
        res.status(200).json({
            success: true,
            messages: ['backup_success']
        });
    } catch (error) {
        // LogError(req.user.email, 'BACKUP');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['backup_faile'],
            content: error
        });
    }
};

exports.restore = async(req, res) => {
    try {
        await SystemSettingServices.restore(req.body, req.query);
        
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

exports.getBackupedList = async() => {
    try {
        const backupedList = await SystemSettingServices.getBackupedList();
        
        // LogInfo(req.user.email, 'BACKUP_SCHEDULE');
        res.status(200).json({
            success: true,
            messages: ['restore_success'],
            content: backupedList
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
