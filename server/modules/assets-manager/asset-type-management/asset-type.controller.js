const AssetTypeService = require('./asset-type.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 * Lấy danh sách loại tài sản
 */
exports.searchAssetTypes = async (req, res) => {
    // console.log('req.body',req.body);
    try {
        var listAssetType = await AssetTypeService.searchAssetTypes(req.user.company._id);
        await LogInfo(req.user.email, 'GET_ASSETTYPE', req.user.company);
        res.status(200).json({ success: true, message: ["get_asset_type_success"], content: listAssetType });
    } catch (error) {
        await LogError(req.user.email, 'GET_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, message: ["get_asset_type_faile"], content: {error:error}});
    }
}

// Kiểm tra sự tồn tại của mã loại tài sản 
exports.checkTypeNumber = async (req, res) => {
    try {
        var checkTypeNumber = await AssetTypeService.checkAssetTypeExisted(req.params.typeNumber, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkTypeNumber
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}

/**
 * Tạo mới thông tin loại tài sản
 */
exports.createAssetType = async (req, res) => {
    try {
        if(req.body.typeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, message: ["type_number_required"], content:{ inputData: req.body } });
        } else if(req.body.typeName.trim()===""){
            await LogError(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, message: ["type_name_required"], content:{ inputData: req.body } });
        } else {
            var newAssetType = await AssetTypeService.createAssetType(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
            res.status(200).json({
                success: true,
                message: ["create_asset_type_success"],
                content: newAssetType
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, message: "create_asset_type_faile", content: { inputData: req.body } });
    }
}

/**
 * Xoá thông tin loại tài sản
 */
exports.deleteAssetType = async (req, res) => {
    try {
        var assettypeDelete = await AssetTypeService.deleteAssetType(req.params.id);
        await LogInfo(req.user.email, 'DELETE_ASSETTYPE', req.user.company);
        res.status(200).json({
            success: true,
            message: ["delete_asset_type_success"],
            content: assettypeDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, message: ["delete_asset_type_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin loại tài sản
 */
exports.updateAssetType = async (req, res) => {
    try {
        if(req.body.typeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, message: ["type_number_required"], content:{ inputData: req.body } });
        } else if(req.body.typeName.trim()===""){
            await LogError(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, message: ["type_name_required"], content: { inputData: req.body } });
        } else {
            var assettypeUpdate = await AssetTypeService.updateAssetType(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
            res.status(200).json({
                success: true,
                message: ["edit_asset_type_success"],
                content: assettypeUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, message: ['edit_asset_type_faile'], content: { error: error } });
    }
}
