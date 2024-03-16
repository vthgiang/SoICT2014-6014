const RecommendDistributeService = require('../services').USE_REQUEST;
const Logger = require('../../../logs');
const { read } = require('fs');
const NotificationServices = require('../../notification/notification.service');
const { sendEmail } = require('../../../helpers/emailHelper');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchUseRequests = async (req, res) => {
    if (req.query.getUseRequestByAssetId) {
        getUseRequestByAsset(req, res);
    } else {
        try {
            let listRecommendDistributes = await RecommendDistributeService.searchUseRequests(req.portal, req.user.company._id, req.query);
            await Logger.info(req.user.email, 'GET_USE_REQUEST', req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_use_request_success'],
                content: listRecommendDistributes
            });
        } catch (error) {
            await Logger.error(req.user.email, 'GET_USE_REQUEST', req.portal);
            res.status(400).json({
                success: false,
                messages: ['get_use_request_failure'],
                content: {
                    error: error
                }
            });
        }
    }
}

let getUseRequestByAsset = async (req, res) => {
    try {
        let listRecommendDistributes = await RecommendDistributeService.getUseRequestByAsset(req.portal, req.query);
        await Logger.info(req.user.email, 'GET_USE_REQUEST_BY_ASSET', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_use_request_by_asset_success'],
            content: listRecommendDistributes
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_USE_REQUEST_BY_ASSET', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_use_request_by_asset_faile'],
            content: {
                error: error
            }
        });
    }
}

/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createUseRequest = async (req, res) => {
    try {
        let newRecommendDistribute = await RecommendDistributeService.createUseRequest(req.portal, req.user.company._id, req.body);

        if (newRecommendDistribute.email) {
            let email = newRecommendDistribute.email;
            let html = newRecommendDistribute.html;
            let noti = {
                organizationalUnits: [],
                title: 'Đăng ký sử dụng tài sản' + ' ' + newRecommendDistribute.assetName,
                level: 'general',
                content: html,
                sender: newRecommendDistribute.user.name,
                users: newRecommendDistribute.manager,
                associatedDataObject: {
                    dataType: 2,
                    description: `<p><strong>${newRecommendDistribute.user.name}</strong> xin đăng kí sử dụng tài sản:  <strong>${newRecommendDistribute.assetName}</strong>.</p>`
                }
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
            //await sendEmail(email, "Bạn có thông báo mới", '', html);
        }

        await Logger.info(req.user.email, 'CREATE_USE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_use_request_success'],
            content: newRecommendDistribute.createRecommendDistribute
        });

    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_USE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_use_request_failure'],
            content: {
                inputData: req.body
            }
        });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.deleteUseRequest = async (req, res) => {
    try {
        let recommenddistributeDelete = await RecommendDistributeService.deleteUseRequest(req.portal, req.params.id);
        await Logger.info(req.user.email, 'DELETE_USE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_use_request_success'],
            content: recommenddistributeDelete
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_USE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_use_request_success'],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updateUseRequest = async (req, res) => {
    try {
        let recommenddistributeUpdate = await RecommendDistributeService.updateUseRequest(req.portal, req.params.id, req.body);
        if (recommenddistributeUpdate.email) {
            let email = recommenddistributeUpdate.email;
            let html = recommenddistributeUpdate.html;
            let noti = {
                organizationalUnits: [],
                title: 'Sửa đăng ký sử dụng thiết bị' + ' ' + recommenddistributeUpdate.equipmentName,
                level: 'general',
                content: html,
                sender: recommenddistributeUpdate.user.name,
                users: recommenddistributeUpdate.manager,
                associatedDataObject: {
                    dataType: 2,
                    description: `<p><strong>${recommenddistributeUpdate.user.name}</strong> sửa đăng ký sử dụng thiết bị:  <strong>${recommenddistributeUpdate.equipmentName}</strong>.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
            await sendEmail(email, 'Bạn có thông báo mới', '', html);
        }
        await Logger.info(req.user.email, 'EDIT_USE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_use_request_success'],
            content: recommenddistributeUpdate
        });

    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_USE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_use_request_failure'],
            content: {
                error: error
            }
        });
    }
}
