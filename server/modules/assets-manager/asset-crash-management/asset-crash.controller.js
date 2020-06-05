const AssetCrashService = require('./asset-crash.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */
exports.searchAssetCrashs = async (req, res) => {
    // console.log('req.body',req.body);
    try {
        var listAssetCrash = await AssetCrashService.searchAssetCrashs(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_ASSETCRASH', req.user.company);
        res.status(200).json({success: true, messages: ["get_asset_crash_success"], content: listAssetCrash});
    } catch (error) {
        await LogError(req.user.email, 'GET_ASSETCRASH', req.user.company);
        res.status(400).json({success: false, messages: ["get_asset_crash_faile"], content: {error: error}});
    }
}

// // Kiểm tra sự tồn tại của mã phiếu
// exports.checkDistributeNumber = async (req, res) => {
//     try {
//         var checkDistributeNumber = await ASSETCRASHService.checkASSETCRASHExisted(req.params.distributeNumber, req.user.company._id);
//         res.status(200).json({
//             messages: "success",
//             content: checkDistributeNumber
//         });
//     } catch (error) {
//         res.status(400).json({
//             messages: error,
//         });
//     }
// }

/**
 * Tạo mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createAssetCrash = async (req, res) => {
    try {
        await AssetCrashService.createAssetCrash(req.body, req.user.company._id).save((err, data) => {
            if (err) {
                res.status(400).json({
                    messages: ["create_asset_crash_faile"],
                    content: err
                });
            } else {
                res.status(200).json({
                    messages: ["create_asset_crash_success"],
                    content: data
                });
            }

        });
    } catch (error) {
        res.status(400).json({
            messages: error
        });
    }

}

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.deleteAssetCrash = async (req, res) => {
    try {
        var assetcrashDelete = await AssetCrashService.deleteAssetCrash(req.params.id);
        await LogInfo(req.user.email, 'DELETE_ASSETCRASH', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["delete_asset_crash_success"],
            content: assetcrashDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_ASSETCRASH', req.user.company);
        res.status(400).json({success: false, messages: ["delete_asset_crash_success"], content: {error: error}});
    }
}

/**
 * Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.updateAssetCrash = async (req, res) => {
    try {
        var assetcrashUpdate = await AssetCrashService.updateAssetCrash(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_ASSETCRASH', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["edit_asset_crash_success"],
            content: assetcrashUpdate
        });
        
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ASSETCRASH', req.user.company);
        res.status(400).json({success: false, messages: ['edit_asset_crash_faile'], content: {error: error}});
    }
}
