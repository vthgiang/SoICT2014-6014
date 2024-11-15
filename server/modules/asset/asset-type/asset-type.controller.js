const AssetTypeService = require('./asset-type.service');
const Logger = require(`../../../logs`);

/**
 * Các controller cho phần quản lý danh mục tài liệu văn bản
 */
exports.getAssetTypes = async (req, res) => {
    try {
        const types = await AssetTypeService.getAssetTypes(req.portal, req.user.company._id, req.query);

        await Logger.info(req.user.email, 'GET_ASSET_TYPES', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_asset_type_success'],
            content: types
        });
    } catch (error) {
        console.log('error',error)
        await Logger.error(req.user.email, 'GET_ASSET_TYPES', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_asset_type_faile'],
            content: error
        });
    }
};

exports.createAssetTypes = async (req, res) => {
    try {
        const type = await AssetTypeService.createAssetTypes(req.portal, req.user.company._id, req.body);

        await Logger.info(req.user.email, 'CREATE_ASSET_TYPE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_asset_type_success'],
            content: type
        });
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_ASSET_TYPE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_asset_type_failure'],
            content: error
        });
    }
};

exports.importAssetTypes = async (req, res) => {
    try {
        const data = await AssetTypeService.importAssetTypes(req.portal, req.user.company._id, req.body);
         
        await Logger.info(req.user.email, 'import_asset_type_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_asset_type_success'],
            content: data
        });
    } catch (error) {
        console.log('eoror', error)
        await Logger.error(req.user.email, 'import_asset_type_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_asset_type_failure'],
            content: error
        });
    }
}


exports.editAssetType = async (req, res) => {
    try {
        const type = await AssetTypeService.editAssetType(req.portal, req.params.id, req.body);

        await Logger.info(req.user.email, 'EDIT_ASSET_TYPE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_asset_type_success'],
            content: type
        });
    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_ASSET_TYPE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_asset_type_faile'],
            content: error
        });
    }
};

exports.deleteAssetTypes = async (req, res) => {
    try {
        const type = await AssetTypeService.deleteAssetTypes(req.portal, req.params.id);

        await Logger.info(req.user.email, 'DELETE_ASSET_TYPE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_asset_type_success'],
            content: type
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_ASSET_TYPE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_asset_type_failure'],
            content: error
        });
    }
};

exports.deleteManyAssetType = async (req, res) => {
    try {
        const type = await AssetTypeService.deleteManyAssetType(req.portal, req.user.company._id, req.body.array);

        await Logger.info(req.user.email, 'DELETE_MANY_ASSET_TYPE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_asset_type_success'],
            content: type
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'DELETE_MANY_ASSET_TYPE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_asset_type_failure'],
            content: error
        });
    }
};