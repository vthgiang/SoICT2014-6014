const AssetTypeService = require('./asset-type.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 * Lấy danh sách loại tài sản
 */
exports.searchAssetTypes = async (req, res) => {
    // console.log('req.body',req.body);
    try {
        var listAssetTypes = await AssetTypeService.searchAssetTypes(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_ASSETTYPE', req.user.company);
        res.status(200).json({ success: true, messages: ["get_asset_type_success"], content: listAssetTypes });
    } catch (error) {
        await LogError(req.user.email, 'GET_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, messages: ["get_asset_type_faile"], content: {error:error}});
    }
}

// Kiểm tra sự tồn tại của mã loại tài sản 
exports.checkTypeNumber = async (req, res) => {
    try {
        var checkTypeNumber = await AssetTypeService.checkAssetTypeExisted(req.params.typeNumber, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: checkTypeNumber
        });
    } catch (error) {
        res.status(400).json({
            messages: error,
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
            res.status(400).json({ success: false, messages: ["type_number_required"], content:{ inputData: req.body } });
        } else if(req.body.typeName.trim()===""){
            await LogError(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_name_required"], content:{ inputData: req.body } });
        } else {
            var newAssetType = await AssetTypeService.createAssetType(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["create_asset_type_success"],
                content: newAssetType
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, messages: "create_asset_type_faile", content: { inputData: req.body } });
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
            messages: ["delete_asset_type_success"],
            content: assettypeDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, messages: ["delete_asset_type_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin loại tài sản
 */
exports.updateAssetType = async (req, res) => {
    try {
        if(req.body.typeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_number_required"], content:{ inputData: req.body } });
        } else if(req.body.typeName.trim()===""){
            await LogError(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_name_required"], content: { inputData: req.body } });
        } else {
            var assettypeUpdate = await AssetTypeService.updateAssetType(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_asset_type_success"],
                content: assettypeUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ASSETTYPE', req.user.company);
        res.status(400).json({ success: false, messages: ['edit_asset_type_faile'], content: { error: error } });
    }
}


/**
 * Các controller cho phần quản lý danh mục tài liệu văn bản
 */
exports.getAssetTypes = async (req, res) => {
    try {
        const types = await AssetTypeService.getAssetTypes(req.user.company._id);
        
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
    // try {
        const type = await AssetTypeService.createAssetTypes(req.user.company._id, req.body);
        
        await LogInfo(req.user.email, 'CREATE_ASSET_TYPE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_asset_type_success'],
            content: type
        });
    // } catch (error) {
        
    //     await LogError(req.user.email, 'CREATE_ASSET_TYPE', req.user.company);
    //     res.status(400).json({
    //         success: false,
    //         messages: Array.isArray(error) ? error : ['create_asset_type_faile'],
    //         content: error
    //     });
    // }
};

exports.showAssetType = (req, res) => {
    console.log("FSDKFJSDLKFJDS")
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
