const {
    Payment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);



exports.createPayment = async (userId, data, portal) => {
    let newPayment = await Payment(connect(DB_CONNECTION, portal)).create({
        type: data.type,
        paymentType: data.paymentType,
        customer: data.customer,
        curator: userId,
        bankAccountIn: data.bankAccountIn,
        bankAccountOut: data.bankAccountOut,
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

    if ( !page || !limit ){
        let allPayments = await Payment(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
                {
                    path: "customer", select: "code name"
                },
                {
                    path: "curator", select: "code name"
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
    
    if (paymentDetail.salesOrders.length) {
        let salesOrdersMap = await paymentDetail.salesOrders.map((paymentForSalesOrder) => {
            let paid = getPaidForSalesOrder(paymentForSalesOrder.salesOrder, portal);
            paymentForSalesOrder.paid = paid; //Số tiền đã thanh toán
            return paymentForSalesOrder;
        })

        paymentDetail.salesOrders = salesOrdersMap;
    }

    return {payment: paymentDetail}
}

//Tính số tiền đã thanh toán cho 1 đơn hàng
const getPaidForSalesOrder = async (orderId, portal) => {
    let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ salesOrders: { $elemMatch: { salesOrder: orderId } } });
    let paid = 0;

    for (let index = 0; i < paymentsForOrder.length; index++){
        let { salesOrders } = paymentsForOrder[index];
        let paymentForSalesOrder = salesOrders.find((element) => element.salesOrder === orderId)
        if (paymentForSalesOrder) {
            paid += paymentForSalesOrder.money;
        }
    }
    return paid;
}

//Tính số tiền đã thanh toán cho 1 đơn hàng được export 
exports.getPaidForSalesOrder = async (orderId, portal) => {
    let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ salesOrders: { $elemMatch: { salesOrder: orderId } } });
    let paid = 0;

    for (let index = 0; i < paymentsForOrder.length; index++){
        let { salesOrders } = paymentsForOrder[index];
        let paymentForSalesOrder = salesOrders.find((element) => element.salesOrder === orderId)
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
    for (let index = 0; i < paymentsForOrder.length; index++){
        let { salesOrders } = paymentsForOrder[index];

        //Lấy chi tiết số tiền cho đơn hàng trong 1 phiếu thu tiền
        let paymentForSalesOrder = salesOrders.find((element) => element.salesOrder === orderId)

        if (paymentForSalesOrder) {
            paymentsForOrder[index].salesOrders = paymentForSalesOrder;
        }
    }

    return {payments: paymentsForOrder}
}