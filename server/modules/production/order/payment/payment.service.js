const {
    Payment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);
const { Logform } = require("winston");



exports.createPayment = async (userId, data, portal) => {
    let newPayment = await Payment(connect(DB_CONNECTION, portal)).create({
        type: data.type,
        paymentType: data.paymentType,
        customer: data.customer,
        curator: userId,
        bankAccountReceived: data.bankAccountReceived,
        bankAccountPaid: data.bankAccountPaid,
        salesOrders: data.salesOrders ? data.salesOrders.map((item) => {
            return {
                salesOrder: item.salesOrder,
                money: item.money
            }
        }) : undefined,
        purchaseOrders: data.purchaseOrders ? data.purchaseOrders.map((item) => {
            return {
                purchaseOrder: item.purchaseOrder,
                money: item.money
            }
        }) : undefined,
        paymentAt: new Date()
    })

    let payment = await Payment(connect(DB_CONNECTION, portal)).findById({ _id: newPayment._id }) .populate([
        {
            path: "customer", select: "code name"
        }, 
        {
            path: "curator", select: "code name"
        } ])
    return {payment};
}

exports.getAllPayments = async (query, portal) => {
    let { page, limit } = query;
    let option = {};

    if (query.type) {
        option.type = query.type
    }

    if (query.customer) {
        option.customer = query.customer
    }

    if ( !page || !limit ){
        let allPayments = await Payment(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
                {
                    path: "customer", select: "code name"
                },
                {
                    path: "curator", select: "code name"
                }, {
                    path: "salesOrders.salesOrder", select: "code paymentAmount"
                }])
        return { allPayments }
    } else {
        let allPayments = await Payment(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [ {
                path: "customer", select: "code name"
            }, 
            {
                path: "curator", select: "code name"
            }, {
                path: "salesOrders.salesOrder", select: "code paymentAmount"
            }]
        })
        return { allPayments }
    }
}

//Lấy chi tiết các thanh toán
exports.getPaymentDetail = async(PaymentId, portal) => {
    let paymentDetail = await Payment(connect(DB_CONNECTION, portal)).findById(paymentId) .populate([
        {
            path: "customer", select: "code name"
        },
        {
            path: "curator", select: "code name"
        }, {
            path: "salesOrders.salesOrder", select: "code paymentAmount"
        }])

    return {payment: paymentDetail}
}

//Tính số tiền đã thanh toán cho 1 đơn hàng 
exports.getPaidForSalesOrder = async (orderId, portal) => {
    let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ salesOrders: { $elemMatch: { salesOrder: orderId } } });
    let paid = 0;

    for (let index = 0; index < paymentsForOrder.length; index++){
        let { salesOrders } = paymentsForOrder[index];

        let paymentForSalesOrder = salesOrders.find((element) => element.salesOrder.toString() === orderId.toString())

        if (paymentForSalesOrder) {
            paid += paymentForSalesOrder.money;
        }
    }
    return paid;
}

//Lấy các thanh toán cho đơn hàng
exports.getPaymentForOrder = async (orderId, orderType, portal) => {
    //Tìm các payment của Sales Order
    let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ salesOrders: { $elemMatch: { salesOrder: orderId } } });

    //Tìm số tiền thanh toán trong Payment
    for (let index = 0; index < paymentsForOrder.length; index++){
        let { salesOrders } = paymentsForOrder[index];
        console.log(salesOrders);

        //Lấy chi tiết số tiền cho đơn hàng trong 1 phiếu thu tiền
        let paymentForSalesOrder = salesOrders.find((element) => element.salesOrder.toString() === orderId.toString())

        if (paymentForSalesOrder) {
            paymentsForOrder[index].salesOrders = paymentForSalesOrder;
        }
    }

    return {payments: paymentsForOrder}
}