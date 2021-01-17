const PurchaseOrderService = require('./purchaseOrder.service');
const Log = require(`../../../../logs`);

exports.createPurchaseOrder = async (req, res) => {
    try {
        let data = req.body;
        let purchaseOrder = await PurchaseOrderService.createPurchaseOrder(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_PURCHASE_ORDER", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: purchaseOrder
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_PURCHASE_ORDER", req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editPurchaseOrder = async (req, res) => {
    try {
        let id = req.params.id;
        data = req.body;
        let purchaseOrder = await PurchaseOrderService.editPurchaseOrder(req.user._id, id, data, req.portal);

        await Log.info(req.user.email, "EDIT_PURCHASE_ORDER", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: purchaseOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_PURCHASE_ORDER", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllPurchaseOrders = async ( req, res ) => {
    try {
        let query = req.query;
        let allPurchaseOrders = await PurchaseOrderService.getAllPurchaseOrders( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_PURCHASE_ORDERS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allPurchaseOrders
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_PURCHASE_ORDERS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

//Lấy các đơn hàng chưa thanh toán hết của theo nhà cùng cấp
exports.getPurchaseOrdersForPayment = async (req, res) => {
    try {

        let supplierId = req.query.supplierId;

        let purchaseOrders = await PurchaseOrderService.getPurchaseOrdersForPayment(supplierId, req.portal)

        await Log.info(req.user.email, "GET_PURCHASE_ORDERS_FOR_PAYMENT", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_purchase_orders_for_payment_successfully"],
            content: purchaseOrders
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_PURCHASE_ORDERS_FOR_PAYMENT", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_purchase_orders_for_payment_failed"],
            content: error.message
        });
    }
}

exports.approvePurchaseOrder = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let purchaseOrder = await PurchaseOrderService.approvePurchaseOrder( id, data, req.portal);

        await Log.info(req.user.email, "APPROVE_PURCHASE_ORDER", req.portal);

        res.status(200).json({
            success: true,
            messages: ["approve_successfully"],
            content: purchaseOrder
        })
        
    } catch (error) {
        await Log.error(req.user.email, "APPROVE_PURCHASE_ORDER", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["approve_failed"],
            content: error.message
        });
    }
}