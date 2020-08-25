const RecommendProcureService = require('./purchase-request.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendProcures = async (req, res) => {
    try {
        var listRecommendProcures = await RecommendProcureService.searchRecommendProcures(req.query, req.user.company._id);
        await LogInfo(req.user.email, 'GET_RECOMMENDPROCURE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_recommend_procure_success"],
            content: listRecommendProcures
        });
    } catch (error) {
        console.log(error);
        await LogError(req.user.email, 'GET_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_recommend_procure_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createRecommendProcure = async (req, res) => {
    try {
        if (req.body.recommendNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["type_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            var newRecommendProcure = await RecommendProcureService.createRecommendProcure(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["create_recommend_procure_success"],
                content: newRecommendProcure
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({
            success: false,
            messages: "create_recommend_procure_faile",
            content: {
                inputData: req.body
            }
        });
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
            messages: ["delete_recommend_procure_success"],
            content: recommendprocureDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["delete_recommend_procure_success"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updateRecommendProcure = async (req, res) => {
    try {
        if (req.body.recommendNumber.trim() === "") {
            await LogError(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["type_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            var recommendprocureUpdate = await RecommendProcureService.updateRecommendProcure(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_recommend_procure_success"],
                content: recommendprocureUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_RECOMMENDPROCURE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_recommend_procure_faile'],
            content: {
                error: error
            }
        });
    }
}