const AssetTypeService = require('./asset-type.service');
const {LogInfo, LogError} = require('../../../logs');



/**
 * Các controller cho phần quản lý danh mục tài liệu văn bản
 */
exports.getAssetTypes = async (req, res) => {
    try {
        const types = await AssetTypeService.getAssetTypes(req.query, req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_ASSET_TYPES', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_asset_type_success'],
            content: types
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_ASSET_TYPES', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_asset_type_faile'],
            content: error
        });
    }
};

exports.createAssetTypes = async (req, res) => {
    try {
        const type = await AssetTypeService.createAssetTypes(req.user.company._id, req.body);
        
        await LogInfo(req.user.email, 'CREATE_ASSET_TYPE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_asset_type_success'],
            content: type
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_ASSET_TYPE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_asset_type_faile'],
            content: error
        });
    }
};


exports.editAssetType = async (req, res) => {
    console.log(req.params.id, req.body);
    try {
        const type = await AssetTypeService.editAssetType(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_ASSET_TYPE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_asset_type_success'],
            content: type
        });
    } catch (error) {
        console.log("error: ",error)
        await LogError(req.user.email, 'EDIT_ASSET_TYPE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_asset_type_faile'],
            content: error
        });
    }
};

exports.deleteAssetTypes = async(req, res) => {
    try {
        const type = await AssetTypeService.deleteAssetTypes(req.params.id);
        
        await LogInfo(req.user.email, 'DELETE_ASSET_TYPE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_asset_type_success'],
            content: type
        });
    } catch (error) {
        console.log('ERERRPR"', error)
        await LogError(req.user.email, 'DELETE_ASSET_TYPE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_asset_type_faile'],
            content: error
        });
    }
};

exports.deleteManyAssetType = async(req, res) => {
    try {
        const type = await AssetTypeService.deleteManyAssetType(req.body.array, req.user.company._id);
        
        await LogInfo(req.user.email, 'DELETE_MANY_ASSET_TYPE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_asset_type_success'],
            content: type
        });
    } catch (error) {
        console.log('ERERRPR"', error)
        await LogError(req.user.email, 'DELETE_MANY_ASSET_TYPE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_asset_type_faile'],
            content: error
        });
    }
};
