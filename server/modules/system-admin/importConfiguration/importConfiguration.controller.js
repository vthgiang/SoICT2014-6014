const ImportConfiguraionService = require('./importConfiguration.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy thông tin cấu hình file import
 */
exports.getImportConfiguraion =  async(req, res)=>{
    try {
        let data = await ImportConfiguraionService.getImportConfiguraion(req.params.type, req.user.company._id);
        await LogInfo(req.user.email, 'GET_IMPORT_CONFIGURATION', req.user.company);
        res.status(200).json({ success: true, messages:["get_import_configuration_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'GET_IMPORT_CONFIGURATION', req.user.company);
        res.status(400).json({success: false, messages:["get_import_configuration_faile"], content: {error: error}});
    }
};

/**
 * Tạo thông tin cấu hình file import
 */
exports.createImportConfiguraion = async(req, res)=>{
    try {
        let data = await ImportConfiguraionService.createImportConfiguraion(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_IMPORT_CONFIGURATION', req.user.company);
        res.status(200).json({ success: true, messages:["create_import_configuration_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'CRETATE_IMPORT_CONFIGURATION', req.user.company);
        res.status(400).json({success: false, messages:["create_import_configuration_faile"], content: {error: error}});
    }
};

/**
 * chỉnh sửa thông tin cấu hình file import
 */
exports.editImportConfiguraion =  async(req, res)=>{
    try {
        let data = await ImportConfiguraionService.editImportConfiguraion(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_IMPORT_CONFIGURATION', req.user.company);
        res.status(200).json({ success: true, messages:["edit_import_configuration_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'EDIT_IMPORT_CONFIGURATION', req.user.company);
        res.status(400).json({success: false, messages:["edit_import_configuration_faile"], content: {error: error}});
    }
};