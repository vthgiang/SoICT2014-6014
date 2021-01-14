const {
    PurchaseOrder, PurchasingRequest
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const PaymentService = require('../payment/payment.service');

exports.createPurchaseOrder = async (userId, data, portal) => {
    let newPurchaseOrder = await PurchaseOrder(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        creator: userId,
        materials: data.materials ? data.materials.map((material) => {
            return {
                material: material.material,
                quantity: material.quantity,
                price: material.price
            }
        }) : undefined,
        intendReceiveTime: data.intendReceiveTime,
        stock: data.stock,
        approvers: data.approvers ? data.approvers.map((approver) => {
            return {
                approver: approver.approver,
                status: approver.status
            }
        }) : undefined,
        supplier: data.supplier,
        discount: data.discount,
        desciption: data.desciption,
        purchasingRequest: data.purchasingRequest,
        paymentAmount: data.paymentAmount
    })

    //Cập nhật trạng thái cho đơn đề nghị
    if (data.purchasingRequest) {
        let purchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal)).findById({ _id: data.purchasingRequest })
        purchasingRequest.status = 2;
        await purchasingRequest.save()
    }

    let purchaseOrder = await PurchaseOrder(connect(DB_CONNECTION, portal)).findById({ _id: newPurchaseOrder._id }) .populate([
        {
            path: "creator", select: "code name"
        }, 
        {
            path: "materials.material", select: "code name baseUnit"
        },{
            path: "stock", select: "code name address"
        }, {
            path: "approvers.approver", select: "code name"
        },{
            path: "supplier", select: "code name"
        },{
            path: "purchasingRequest", select: "code"
        } ])
    return {purchaseOrder};
}

exports.getAllPurchaseOrders = async (query, portal) => {
    let { page, limit } = query;
    let option = {};

    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }

    if (query.status) {
        option.status = query.status
    }

    if (query.supplier) {
        option.supplier = query.supplier
    }

    if ( !page || !limit ){
        let allPurchaseOrders = await PurchaseOrder(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
                {
                    path: "creator", select: "code name"
                }, 
                {
                    path: "materials.material", select: "code name baseUnit"
                },{
                    path: "stock", select: "code name address"
                }, {
                    path: "approvers.approver", select: "code name"
                },{
                    path: "supplier", select: "code name"
                },{
                    path: "purchasingRequest", select: "code"
                }])
        return { allPurchaseOrders }
    } else {
        let allPurchaseOrders = await PurchaseOrder(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [ {
                path: "creator", select: "code name"
            }, 
            {
                path: "materials.material", select: "code name baseUnit"
            },{
                path: "stock", select: "code name address"
            }, {
                path: "approvers.approver", select: "code name"
            },{
                path: "supplier", select: "code name"
            },{
                path: "purchasingRequest", select: "code"
            }]
        })
        return { allPurchaseOrders }
    }
}

exports.editPurchaseOrder = async (userId, id, data, portal) => {
    let oldPurchaseOrder = await PurchaseOrder(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPurchaseOrder) {
        throw Error("Purchase Order is not existing")
    }
    
    oldPurchaseOrder.status = data.status;
    oldPurchaseOrder.creator = userId;
    oldPurchaseOrder.materials = data.materials ? data.materials.map((material) => {
        return {
            material: material.material,
            quantity: material.quantity,
            price: material.price
        }
    }) : undefined,
    oldPurchaseOrder.intendReceiveTime = data.intendReceiveTime,
    oldPurchaseOrder.stock = data.stock;
    oldPurchaseOrder.approvers = data.approvers ? data.approvers.map((approver) => {
        return {
            approver: approver.approver,
            status: approver.status
        }
    }) : undefined,
    oldPurchaseOrder.supplier = data.supplier;
    oldPurchaseOrder.discount = data.discount;
    oldPurchaseOrder.desciption = data.desciption;
    oldPurchaseOrder.paymentAmount = data.paymentAmount

    await oldPurchaseOrder.save();

    let purchaseOrderUpdate =  await PurchaseOrder(connect(DB_CONNECTION, portal)).findById(id) .populate([
        {
            path: "creator", select: "code name"
        }, 
        {
            path: "materials.material", select: "code name baseUnit"
        },{
            path: "stock", select: "code name address"
        }, {
            path: "approvers.approver", select: "code name"
        },{
            path: "supplier", select: "code name"
        },{
            path: "purchasingRequest", select: "code"
        }]);

    return {purchaseOrder: purchaseOrderUpdate};
}

//Lấy các đơn hàng chưa thanh toán cho 1 nhà cung cấp
exports.getPurchaseOrdersForPayment = async (supplierId, portal) => {
    //Lấy tất cả các đơn hàng theo nhà cung cấp
    let purchaseOrdersForPayment = await PurchaseOrder(connect(DB_CONNECTION, portal)).find({ supplier: supplierId });
    let purchaseOrders = [];
    if (purchaseOrdersForPayment.length) {
        for (let index = 0; index < purchaseOrdersForPayment.length; index++){
            let paid = await PaymentService.getPaidForPurchaseOrder(purchaseOrdersForPayment[index]._id, portal);

            if (paid < purchaseOrdersForPayment[index].paymentAmount) {
                //Chỉ trả về các đơn hàng chưa thanh toán
                purchaseOrders.push({
                    _id: purchaseOrdersForPayment[index]._id,
                    code: purchaseOrdersForPayment[index].code,
                    paymentAmount: purchaseOrdersForPayment[index].paymentAmount,
                    supplier: purchaseOrdersForPayment[index].supplier,
                    paid: paid,
                })
            }
        }
    }

    return {purchaseOrders}
}

