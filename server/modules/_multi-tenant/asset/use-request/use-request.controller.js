const RecommendDistributeService = require('./use-request.service');
const Logger = require(`${SERVER_LOGS_DIR}/_multi-tenant`);
const { read } = require('fs');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendDistributes = async (req, res) => {
    try {
        var listRecommendDistributes = await RecommendDistributeService.searchRecommendDistributes(req.portal, req.query);
        await Logger.info(req.user.email, 'GET_RECOMMENDDISTRIBUTE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_recommend_distribute_success"],
            content: listRecommendDistributes
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_RECOMMENDDISTRIBUTE', req.portal);
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
        var newRecommendDistribute = await RecommendDistributeService.createRecommendDistribute(req.portal, req.body);
        await Logger.info(req.user.email, 'CREATE_RECOMMENDDISTRIBUTE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_recommend_distribute_success"],
            content: newRecommendDistribute
        });

    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_RECOMMENDDISTRIBUTE', req.portal);
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
        await Logger.info(req.user.email, 'DELETE_RECOMMENDDISTRIBUTE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_recommend_distribute_success"],
            content: recommenddistributeDelete
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_RECOMMENDDISTRIBUTE', req.portal);
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
        var recommenddistributeUpdate = await RecommendDistributeService.updateRecommendDistribute(req.params.id, req.body);
        await Logger.info(req.user.email, 'EDIT_RECOMMENDDISTRIBUTE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_recommend_distribute_success"],
            content: recommenddistributeUpdate
        });

    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_RECOMMENDDISTRIBUTE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_recommend_distribute_faile'],
            content: {
                error: error
            }
        });
    }
}