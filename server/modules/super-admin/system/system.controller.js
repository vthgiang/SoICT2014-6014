const SystemService = require('./system.service');
const Logger = require('../../../logs');
const fs = require('fs');
const archiver = require('archiver');

exports.getBackups = async(req, res) => {
    try {
        const backupedList = await SystemService.getBackups(req.portal);

        Logger.info(req.user.email, 'get_backup_list_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_backup_list_success'],
            content: backupedList
        })
    } catch (error) {
        
        Logger.error(req.user.email, 'get_backup_list_faile', req.portal);
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['get_backup_list_faile'],
            content: error
        })
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

        Logger.error(req.user.email, 'download_backup_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_backup_faile'],
            content: error
        })
    }
}

exports.editBackupInfo = async(req, res) => {
    try {
        let {version} = req.params;
        let data = await SystemService.editBackupInfo(version, req.body, req.portal);

        Logger.info(req.user.email, 'edit_backup_info_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_backup_info_success'],
            content: data
        })
    } catch (error) {

        Logger.error(req.user.email, 'edit_backup_info_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_backup_info_faile'],
            content: error
        })
    }
}

exports.getConfigBackup = async(req, res) => {
    try {
        const config = await SystemService.getConfigBackup(req.portal);

        Logger.info(req.user.email, 'get_config_backup_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_config_backup_success'],
            content: config
        })
    } catch (error) {
      
        Logger.error(req.user.email, 'get_config_backup_faile', req.portal);
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['get_config_backup_faile'],
            content: error
        })
    }
};

exports.createBackup = async(req, res) => {
    try {
        const backupInfo = await SystemService.createBackup(req.portal);

        Logger.info(req.user.email, 'create_backup_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_backup_success'],
            content: backupInfo
        })
    } catch (error) {

        Logger.error(req.user.email, 'create_backup_faile', req.portal);
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['create_backup_faile'],
            content: error
        })
    }
};

exports.configBackup = async (req, res) => {
    try {
        const backupInfo = await SystemService.configBackup(req.portal, req.query, req.body);

        Logger.info(req.user.email, 'config_backup_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['config_backup_success'],
            content: backupInfo
        })
    } catch (error) {

        Logger.error(req.user.email, 'config_backup_faile', req.portal);
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['config_backup_faile'],
            content: error
        })
    }
}

exports.deleteBackup = async(req, res) => {
    try {
        const path = await SystemService.deleteBackup(req.params.version, req.portal);

        Logger.info(req.user.email, 'delete_backup_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_backup_success'],
            content: path
        })
    } catch (error) {
        
        Logger.error(req.user.email, 'delete_backup_faile', req.portal);
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

        Logger.info(req.user.email, 'restore_data_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['restore_data_success'],
            content: restoreInfo
        })
    } catch (error) {
        
        Logger.error(req.user.email, 'restore_data_faile', req.portal);
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['restore_data_faile'],
            content: error
        })
    }
};