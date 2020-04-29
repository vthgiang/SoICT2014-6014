const RecommendProcureService = require('./recommend-procurement.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendProcures = async (req, res) => {
    // console.log('req.body',req.body);
    try {
        var listRecommendProcure = await RecommendProcureService.searchRecommendProcures(req.user.company._id);
        await LogInfo(req.user.email, 'GET_RECOMMENDPROCURE', req.user.company);
        res.status(200).json({ success: true, message: ["get_recommend_procure_success"], content: listRecommendProcure });
    } catch (error) {
        await LogError(req.user.email, 'GET_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({ success: false, message: ["get_recommend_procure_faile"], content: {error:error}});
    }
}

// Kiểm tra sự tồn tại của mã phiếu
exports.checkRecommendNumber = async (req, res) => {
    try {
        var checkRecommendNumber = await RecommendProcureService.checkRecommendProcureExisted(req.params.recommendNumber, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkRecommendNumber
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}

/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createRecommendProcure = async (req, res) => {
    try {
        if(req.body.recommendNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
            res.status(400).json({ success: false, message: ["type_number_required"], content:{ inputData: req.body } });
        // } else if(req.body.typeName.trim()===""){
        //     await LogError(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
        //     res.status(400).json({ success: false, message: ["type_name_required"], content:{ inputData: req.body } });
        } else {
            var newRecommendProcure = await RecommendProcureService.createRecommendProcure(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
            res.status(200).json({
                success: true,
                message: ["create_recommend_procure_success"],
                content: newRecommendProcure
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({ success: false, message: "create_recommend_procure_faile", content: { inputData: req.body } });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.deleteRecommendProcure = async (req, res) => {
    try {
        var recommendprocureDelete = await RecommendProcureService.deleteRecommendProcure(req.params.id);
        await LogInfo(req.user.email, 'DELETE_RECOMMENDPROCURE', req.user.company);
        res.status(200).json({
            success: true,
            message: ["delete_recommend_procure_success"],
            content: recommendprocureDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({ success: false, message: ["delete_recommend_procure_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updateRecommendProcure = async (req, res) => {
    try {
        if(req.body.recommendNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
            res.status(400).json({ success: false, message: ["type_number_required"], content:{ inputData: req.body } });
        // } else if(req.body.typeName.trim()===""){
        //     await LogError(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
        //     res.status(400).json({ success: false, message: ["type_name_required"], content: { inputData: req.body } });
        } else {
            var recommendprocureUpdate = await RecommendProcureService.updateRecommendProcure(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
            res.status(200).json({
                success: true,
                message: ["edit_recommend_procure_success"],
                content: recommendprocureUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({ success: false, message: ['edit_recommend_procure_faile'], content: { error: error } });
    }
}
