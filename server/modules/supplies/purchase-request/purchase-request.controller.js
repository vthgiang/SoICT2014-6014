const PurchaseRequestService = require('./purchase-request.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);
const { sendEmail } = require(`../../../helpers/emailHelper`);
/**
 * Lấy danh sách phiếu đề nghị mua sắm vật tư
 */
exports.searchPurchaseRequests = async (req, res) => {
    try {
        var listPurchaseRequests = await PurchaseRequestService.searchPurchaseRequests(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, 'GET_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_purchase_request_success"],
            content: listPurchaseRequests
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_purchase_request_failure"],
            content: {
                error: error
            }
        });
    }
}


exports.searchUserApprover = async (req, res) => {
    try {
        var listPurchaseRequests = await PurchaseRequestService.searchUserApprover(req.portal, req.user.company._id);
        await Logger.info(req.user.email, 'GET_USER_APPROVER_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_user_approver_request_success"],
            content: listPurchaseRequests
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_USER_APPROVER_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_user_approver_request_success"],
            content: {
                error: error
            }
        });
    }
}
/**
 * Tạo mới thông tin phiếu đề nghị mua sắm vật tư
 */
exports.createPurchaseRequest = async (req, res) => {
    try {
        var newPurchaseRequest = await PurchaseRequestService.createPurchaseRequest(req.portal, req.user.company._id, req.body, req.files);

        if (newPurchaseRequest.email) {
            var email = newPurchaseRequest.email;
            var html = newPurchaseRequest.html;
            var noti = {
                organizationalUnits: [],
                title: "Đăng ký mua sắm vật tư" + " " + newPurchaseRequest.suppliesName,
                level: "general",
                content: html,
                sender: newPurchaseRequest.user.name,
                users: newPurchaseRequest.manager,
                associatedDataObject: {
                    dataType: 2,
                    description: `<p><strong>${newPurchaseRequest.user.name}</strong> xin đăng mua sắm vật tư:  <strong>${newPurchaseRequest.suppliesName}</strong>.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
            await sendEmail(email, "Bạn có thông báo mới", '', html);
        }

        await Logger.info(req.user.email, 'CREATE_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_purchase_request_success"],
            content: newPurchaseRequest.createPurchaseRequest
        });

    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: "create_purchase_request_failure",
            content: {
                inputData: req.body
            }
        });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm vật tư
 */
exports.deletePurchaseRequest = async (req, res) => {
    try {
        var purchaseRequestDelete = await PurchaseRequestService.deletePurchaseRequest(req.portal, req.params.id);
        await Logger.info(req.user.email, 'DELETE_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_purchase_request_success"],
            content: purchaseRequestDelete
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
 * Cập nhật thông tin phiếu đề nghị mua sắm vật tư
 */
exports.updatePurchaseRequest = async (req, res) => {
    try {
        var purchaseRequestUpdate = await PurchaseRequestService.updatePurchaseRequest(req.portal, req.params.id, req.body, req.files, req.user._id);
        if (purchaseRequestUpdate.email) {
            var email = purchaseRequestUpdate.email;
            var html = purchaseRequestUpdate.html;
            var noti = {
                organizationalUnits: [],
                title: "Sửa đăng ký mua sắm vật tư" + " " + purchaseRequestUpdate.suppliesName,
                level: "general",
                content: html,
                sender: purchaseRequestUpdate.user.name,
                users: purchaseRequestUpdate.manager,
                associatedDataObject: {
                    dataType: 2,
                    description: `<p><strong>${purchaseRequestUpdate.user.name}</strong> sửa đăng ký mua sắm vật tư:  <strong>${purchaseRequestUpdate.suppliesName}</strong>.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
            await sendEmail(email, "Bạn có thông báo mới", '', html);
        }

        await Logger.info(req.user.email, 'EDIT_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_purchase_request_success"],
            content: purchaseRequestUpdate.purchaseRequest
        });

    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_purchase_request_failure'],
            content: {
                error: error
            }
        });
    }
}