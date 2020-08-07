const RecommendDistributeService = require('./recommend-distribute.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');
const {
    read
} = require('fs');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendDistributes = async (req, res) => {
    try {
        var listRecommendDistributes = await RecommendDistributeService.searchRecommendDistributes(req.query, req.user.company._id);
        await LogInfo(req.user.email, 'GET_RECOMMENDDISTRIBUTE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_recommend_distribute_success"],
            content: listRecommendDistributes
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_RECOMMENDDISTRIBUTE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_recommend_distribute_faile"],
            content: {
                error: error
            }
        });
    }
}


/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createRecommendDistribute = async (req, res) => {
    try {
        if (req.body.recommendNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_RECOMMENDDISTRIBUTE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["type_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            var newRecommendDistribute = await RecommendDistributeService.createRecommendDistribute(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_RECOMMENDDISTRIBUTE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["create_recommend_distribute_success"],
                content: newRecommendDistribute
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_RECOMMENDDISTRIBUTE', req.user.company);
        res.status(400).json({
            success: false,
            messages: "create_recommend_distribute_faile",
            content: {
                inputData: req.body
            }
        });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.deleteRecommendDistribute = async (req, res) => {
    try {
        var recommenddistributeDelete = await RecommendDistributeService.deleteRecommendDistribute(req.params.id);
        await LogInfo(req.user.email, 'DELETE_RECOMMENDDISTRIBUTE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["delete_recommend_distribute_success"],
            content: recommenddistributeDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_RECOMMENDDISTRIBUTE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["delete_recommend_distribute_success"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updateRecommendDistribute = async (req, res) => {
    try {
        if (req.body.recommendNumber.trim() === "") {
            await LogError(req.user.email, 'EDIT_RECOMMENDDISTRIBUTE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["type_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            var recommenddistributeUpdate = await RecommendDistributeService.updateRecommendDistribute(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_RECOMMENDDISTRIBUTE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_recommend_distribute_success"],
                content: recommenddistributeUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_RECOMMENDDISTRIBUTE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_recommend_distribute_faile'],
            content: {
                error: error
            }
        });
    }
}