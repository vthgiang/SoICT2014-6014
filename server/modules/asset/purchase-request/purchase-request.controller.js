const RecommendProcureService = require('./purchase-request.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);
const { sendEmail } = require(`../../../helpers/emailHelper`);
/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchPurchaseRequests = async (req, res) => {
    try {
        var listRecommendProcures = await RecommendProcureService.searchPurchaseRequests(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, 'GET_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_purchase_request_success"],
            content: listRecommendProcures
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'GET_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_purchase_request_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createPurchaseRequest = async (req, res) => {
    try {
        var newRecommendProcure = await RecommendProcureService.createPurchaseRequest(req.portal, req.user.company._id, req.body, req.files);

        if (newRecommendProcure.email) {
            var email = newRecommendProcure.email;
            var html = newRecommendProcure.html;
            var noti = {
                organizationalUnits: [],
                title: "Đăng ký mua sắm thiết bị" + " " + newRecommendProcure.equipmentName,
                level: "general",
                content: html,
                sender: newRecommendProcure.user.name,
                users: newRecommendProcure.manager,
                associatedDataObject: {
                    dataType: 2,
                    description: `<p><strong>${newRecommendProcure.user.name}</strong> xin đăng mua sắm thiết bị:  <strong>${newRecommendProcure.equipmentName}</strong>.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
            await sendEmail(email, "Bạn có thông báo mới", '', html);
        }

        await Logger.info(req.user.email, 'CREATE_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_purchase_request_success"],
            content: newRecommendProcure.createRecommendProcure
        });

    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: "create_purchase_request_faile",
            content: {
                inputData: req.body
            }
        });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.deletePurchaseRequest = async (req, res) => {
    try {
        var recommendprocureDelete = await RecommendProcureService.deletePurchaseRequest(req.portal, req.params.id);
        await Logger.info(req.user.email, 'DELETE_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_purchase_request_success"],
            content: recommendprocureDelete
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_purchase_request_success"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updatePurchaseRequest = async (req, res) => {
    try {
        var recommendprocureUpdate = await RecommendProcureService.updatePurchaseRequest(req.portal, req.params.id, req.body, req.files, req.user._id);
        if (recommendprocureUpdate.email) {
            var email = recommendprocureUpdate.email;
            var html = recommendprocureUpdate.html;
            var noti = {
                organizationalUnits: [],
                title: "Sửa đăng ký mua sắm thiết bị" + " " + recommendprocureUpdate.equipmentName,
                level: "general",
                content: html,
                sender: recommendprocureUpdate.user.name,
                users: recommendprocureUpdate.manager,
                associatedDataObject: {
                    dataType: 2,
                    description: `<p><strong>${recommendprocureUpdate.user.name}</strong> sửa đăng ký mua sắm thiết bị:  <strong>${recommendprocureUpdate.equipmentName}</strong>.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
            await sendEmail(email, "Bạn có thông báo mới", '', html);
        }

        await Logger.info(req.user.email, 'EDIT_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_purchase_request_success"],
            content: recommendprocureUpdate.recommendProcure
        });

    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_purchase_request_faile'],
            content: {
                error: error
            }
        });
    }
}