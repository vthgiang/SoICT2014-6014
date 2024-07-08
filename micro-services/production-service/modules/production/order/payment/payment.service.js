const {
    Payment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);
const { Logform } = require("winston");



exports.createPayment = async (userId, data, portal) => {
    let newPayment = await Payment(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        type: data.type,
        paymentType: data.paymentType,
        customer: data.customer,
        supplier: data.supplier,
        curator: userId,
        bankAccountReceived: data.bankAccountReceived,
        bankAccountPartner: data.bankAccountPartner,
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
        }, {
            path: "supplier", select: "code name"
        },
        {
            path: "curator", select: "code name"
        },{
            path: "salesOrders.salesOrder", select: "code paymentAmount"
        },
        {
            path: "purchaseOrders.purchaseOrder", select: "code paymentAmount"
        },{
            path: "bankAccountReceived", select: "account owner bankName bankAcronym"
        } ])
    return {payment};
}

exports.getAllPayments = async (query, portal) => {
    let { page, limit } = query;
    let option = {};

    if (query.type) {
        option.type = query.type
    }

    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }

    if (query.customer) {
        option.customer = query.customer
    }
    if (query.supplier) {
        option.supplier = query.supplier
    }

    if ( !page || !limit ){
        let allPayments = await Payment(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
                {
                    path: "customer", select: "code name"
                },
                {
                    path: "supplier", select: "code name"
                },
                {
                    path: "curator", select: "code name"
                }, {
                    path: "salesOrders.salesOrder", select: "code paymentAmount"
                },{
                    path: "purchaseOrders.purchaseOrder", select: "code paymentAmount"
                },{
                    path: "bankAccountReceived", select: "account owner bankName bankAcronym"
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
                path: "supplier", select: "code name"
            },    
            {
                path: "curator", select: "code name"
            }, {
                path: "salesOrders.salesOrder", select: "code paymentAmount"
            },{
                path: "purchaseOrders.purchaseOrder", select: "code paymentAmount"
            },{
                path: "bankAccountReceived", select: "account owner bankName bankAcronym"
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
            path: "supplier", select: "code name"
        },
        {
            path: "curator", select: "code name"
        }, {
            path: "salesOrders.salesOrder", select: "code paymentAmount"
        },{
            path: "purchaseOrders.purchaseOrder", select: "code paymentAmount"
        },{
            path: "bankAccountReceived", select: "account owner bankName bankAcronym"
        }])

    return {payment: paymentDetail}
}

//Tính số tiền đã thanh toán cho 1 đơn bán hàng hàng 
exports.getPaidForSalesOrder = async (orderId, portal) => {
    let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ salesOrders: { $elemMatch: { salesOrder: orderId } } });
    let paid = 0;
    for (let index = 0; index < paymentsForOrder.length; index++){
        let { salesOrders } = paymentsForOrder[index];
        let paymentForSalesOrder = salesOrders.filter((element) => element.salesOrder.toString() === orderId.toString())
        if (paymentForSalesOrder) {
            paymentForSalesOrder.forEach(value =>{
                paid += parseInt(value.money);
            })
        }
    }
    return paid;
}

//Tính số tiền đã thanh toán cho 1 đơn mua nguyên vật liệu
exports.getPaidForPurchaseOrder = async (orderId, portal) => {
    //Lấy các payments
    let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ purchaseOrders: { $elemMatch: { purchaseOrder: orderId } } });
    let paid = 0;

    for (let index = 0; index < paymentsForOrder.length; index++){
        let { purchaseOrders } = paymentsForOrder[index];

        //populate đến purchaseOrders.purchaseOrder
        let paymentForPurchaseOrder = purchaseOrders.filter((element) => element.purchaseOrder.toString() === orderId.toString())

        if (paymentForPurchaseOrder) {
            paymentForPurchaseOrder.forEach(value => {
                paid += pasreInt(value.money);
            })
        }
    }
    return paid;
}

//Lấy các thanh toán cho đơn hàng và đơn mua nguyên vật liệu
exports.getPaymentForOrder = async (orderId, orderType, portal) => {
    //Tìm các payment của Sales Order
    //orderType: 1. Sales Order, 2. Purchase Order
    if (parseInt(orderType) === 1) {
        let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ salesOrders: { $elemMatch: { salesOrder: orderId } } }).populate([
            {
                path: "curator", select: "code name"
            },{
                path: "bankAccountReceived", select: "account owner bankName bankAcronym"
            }]);
    
        //Tìm số tiền thanh toán trong Payment
        for (let index = 0; index < paymentsForOrder.length; index++){
            let { salesOrders } = paymentsForOrder[index];
    
            //Lấy chi tiết số tiền cho đơn hàng trong 1 phiếu thu tiền
            let paymentForSalesOrder = salesOrders.find((element) => element.salesOrder.toString() === orderId.toString())
    
            if (paymentForSalesOrder) {
                paymentsForOrder[index].salesOrders = paymentForSalesOrder;
            }
        }
    
        return {payments: paymentsForOrder}
    } else {
        let paymentsForOrder = await Payment(connect(DB_CONNECTION, portal)).find({ purchaseOrders: { $elemMatch: { purchaseOrder: orderId } } }).populate([
            {
                path: "curator", select: "code name"
            },{
                path: "bankAccountReceived", select: "account owner bankName bankAcronym"
            }]);
    
        //Tìm số tiền thanh toán trong Payment
        for (let index = 0; index < paymentsForOrder.length; index++){
            let { purchaseOrders } = paymentsForOrder[index];
    
            //Lấy chi tiết số tiền cho đơn hàng trong 1 phiếu thu tiền
            let paymentForSalesOrder = purchaseOrders.find((element) => element.purchaseOrder.toString() === orderId.toString())
    
            if (paymentForSalesOrder) {
                paymentsForOrder[index].purchaseOrders = paymentForSalesOrder;
            }
        }
    
        return {payments: paymentsForOrder}
    }
}