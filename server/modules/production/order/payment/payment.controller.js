const PaymentService = require('./payment.service');
const Log = require(`../../../../logs`);

exports.createPayment = async (req, res) => {
    try {
        let data = req.body;
        let payment = await PaymentService.createPayment(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_PAYMENT", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: payment
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_PAYMENT", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getAllPayments = async (req, res) => {
    try {
        let query = req.query;
        let allPayments = await PaymentService.getAllPayments( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_PAYMENTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allPayments
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_PAYMENTS", req.portal);
        console.log( error.message);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getPaymentDetail = async (req, res) => {
    try {
        let id = req.params.id;
        let payment = await PaymentService.getPaymentDetail(id, req.portal);

        await Log.info(req.user.email, "GET_PAYMENT_DETAIL", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_payment_detail_successfully"],
            content: payment
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_PAYMENT_DETAIL", req.portal);
        console.log( error.message);
        res.status(400).json({
            success: false,
            messages: ["get_payment_detail_failed"],
            content: error.message
        });
    }
}

exports.getPaymentForOrder = async (req, res) => {
    try {
        let orderId = req.query.orderId;
        let orderType = req.query.orderType;
        let payments = await PaymentService.getPaymentForOrder(orderId, orderType, req.portal);
        await Log.info(req.user.email, "GET_PAYMENT_FOR_ORDER", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_payment_for_order_successfully"],
            content: payments
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_PAYMENT_FOR_ORDER", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_payment_for_order_failed"],
            content: error.message
        });
    }
}

