const AssetService = require('./asset.service');
const {LogInfo, LogError} = require('../../../logs');
const {
    Asset,
} = require('../../../models').schema;

/**
 * Lấy danh sách tài sản
 */
exports.searchAssetProfiles = async (req, res) => {
    console.log(req, 'req')
    try {
        let data;
        if(req.query.page === undefined && req.query.limit === undefined ){
            data = await AssetService.getAssets(req.user.company._id, false);
        } else {
            let params = {
                code: req.query.code,
                assetName: req.query.assetName,
                status: req.query.status,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            
            data = await AssetService.searchAssetProfiles(params, req.user.company._id);
            
        }
        await LogInfo(req.user.email, 'GET_ASSETS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_list_asset_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_ASSETS', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_list_asset_false"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm mới thông tin tài sản
 */
exports.createAsset = async (req, res) => {
    console.log('req', req);
    try {
        let avatar = "";
        if (req.files.fileAvatar !== undefined) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let file = req.files.file;
        let fileInfo = { file, avatar };

        // Kiểm tra dữ liệu truyền vào
        // if (req.body.code === undefined || req.body.code.trim()===""){
        //     await LogError(req.user.email, 'CREATE_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["code_required"], content:{ inputData: req.body } });
        // } else if(req.body.assetName === undefined || req.body.assetName.trim()==="" ){
        //     await LogError(req.user.email, 'CREATE_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["asset_name_company_required"], content:{ inputData: req.body } });
        // } else if(req.body.serial === undefined || req.body.serial.trim()==="" ){
        //     await LogError(req.user.email, 'CREATE_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["serial_required"], content:{ inputData: req.body } });
        // } else if(req.body.purchaseDate === undefined || req.body.purchaseDate.trim()==="" ){
        //     await LogError(req.user.email, 'CREATE_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["purchase_date_required"], content:{ inputData: req.body } });
        // } else if(req.body.warrantyExpirationDate === undefined || req.body.warrantyExpirationDate.trim()===""){
        //     await LogError(req.user.email, 'CREATE_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["warranty_expirationDate_required"], content:{ inputData: req.body } });
        // } else {
            var data = await AssetService.createAsset(req.body, req.user.company._id, fileInfo);
                    await LogInfo(req.user.email, 'CREATE_ASSET', req.user.company);
                    res.status(200).json({success: true, messages: ["create_asset_success"], content: data });
        // }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_ASSET', req.user.company);
        res.status(400).json({success: false, messages: ["create_asset_faile"], content: { error: error}});
    }
}


/**
 * Cập nhật thông tin tài sản
 */
exports.updateAssetInformation = async (req, res) => {
    try {
        let avatar = "";
        if (req.files.fileAvatar !== undefined) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let file = req.files.file;
        let fileInfo = { file, avatar };
        // Kiểm tra dữ liệu truyền vào
        // if (req.body.code === undefined || req.body.code.trim()===""){
        //     await LogError(req.user.email, 'EDIT_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["edit_code_required"], content:{ inputData: req.body } });
        // } else if(req.body.assetName === undefined || req.body.assetName.trim()==="" ){
        //     await LogError(req.user.email, 'EDIT_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["edit_asset_name_company_required"], content:{ inputData: req.body } });
        // } else if(req.body.serial === undefined || req.body.serial.trim()==="" ){
        //     await LogError(req.user.email, 'EDIT_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["edit_serial_required"], content:{ inputData: req.body } });
        // } else if(req.body.purchaseDate === undefined || req.body.purchaseDate.trim()==="" ){
        //     await LogError(req.user.email, 'EDIT_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["edit_purchase_date_required"], content:{ inputData: req.body } });
        // } else if(req.body.warrantyExpirationDate === undefined || req.body.warrantyExpirationDate.trim()===""){
        //     await LogError(req.user.email, 'EDIT_ASSET', req.user.company);
        //     res.status(400).json({ success: false, messages: ["edit_warranty_expirationDate_required"], content:{ inputData: req.body } });
        // } else {
            let oldAsset = await AssetService.getAssetInforById(req.params.id);
            var data = await AssetService.updateAssetInformation(req.params.id, req.body, fileInfo, req.user.company._id);
            await LogInfo(req.user.email, 'EDIT_ASSET', req.user.company);
            res.status(200).json({success: true, messages: ["edit_asset_success"], content: data });
        // }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ASSET', req.user.company);
        res.status(400).json({success: false, messages: ["edit_asset_false"], content: { error: error}});
    }
}

/**
 * Xoá thông tin tài sản
 */
exports.deleteAsset = async (req, res) => {
    try {
        var data = await AssetService.deleteAsset(req.params.id);
        res.status(200).json({success: true, messages: ["delete_asset_success"], content: data });
    } catch (error) {
        res.status(400).json({success: false, messages: ["delete_asset_false"], content: { error: error}});
    }
}