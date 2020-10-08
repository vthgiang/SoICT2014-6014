const SystemService = require('./system.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getBackups = async(req, res) => {
    try {
        const backupedList = await SystemService.getBackups(req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_backup_list_success'],
            content: backupedList
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['get_backup_list_faile'],
            content: error
        })
    }
};

exports.createBackup = async(req, res) => {
    try {
        const backupInfo = await SystemService.createBackup(req.portal);
        res.status(200).json({
            success: true,
            messages: ['creat_backup_success'],
            content: backupInfo
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['create_backup_faile'],
            content: error
        })
    }
};

exports.deleteBackup = async(req, res) => {
    try {
        const path = await SystemService.deleteBackup(req.params.version, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_backup_success'],
            content: path
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['delete_backup_faile'],
            content: error
        })
    }
};

exports.restore = async(req, res) => {
    try {
        const restoreInfo = await SystemService.restore(req.portal, req.params.version);
        res.status(200).json({
            success: true,
            messages: ['restore_data_success'],
            content: restoreInfo
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['restore_data_faile'],
            content: error
        })
    }
};