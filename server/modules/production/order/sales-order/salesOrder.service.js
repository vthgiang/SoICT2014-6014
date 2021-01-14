const {
    SalesOrder, Quote, OrganizationalUnit, ManufacturingWorks
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const PaymentService = require('../payment/payment.service');
const CustomerService = require('../../../crm/customer/customer.service');

exports.createNewSalesOrder = async (userId, companyId, data, portal) => {
    let newSalesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        status: data.status ? data.status : 1, //Nếu k có thì mặc định bằng 1 (chờ phê duyệt)
        creator: userId,
        customer: data.customer,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerRepresent: data.customerRepresent,
        customerEmail: data.customerEmail,
        approvers: data.approvers ? data.approvers.map((approver) => {
            return {
                approver: approver.approver,
                approverRole: approver.approverRole,
            }
        }) : undefined,
        priority: data.priority,
        goods: data.goods ? data.goods.map((item) => {
            return {
                good: item.good,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                manufacturingWorks: item.manufacturingWorks,
                manufacturingPlan: item.manufacturingPlan,
                serviceLevelAgreements: item.serviceLevelAgreements ? item.serviceLevelAgreements.map((sla) => {
                    return {
                        _id: sla._id,
                        title: sla.title,
                        descriptions: sla.descriptions ? sla.descriptions.map(des => des) : undefined
                    };
                }) : undefined,
                taxs: item.taxs ? item.taxs.map((tax) => {
                    return {
                        _id: tax._id,
                        code: tax.code,
                        name: tax.name,
                        description: tax.description,
                        percent: tax.percent
                    };
                }) : undefined,
                discounts: item.discounts ? item.discounts.map((dis) => {
                    return {
                        _id: dis._id,
                        code: dis.code,
                        type: dis.type,
                        formality: dis.formality,
                        name: dis.name,
                        effectiveDate: dis.effectiveDate,
                        expirationDate: dis.expirationDate,
                        discountedCash: dis.discountedCash,
                        discountedPercentage: dis.discountedPercentage,
                        loyaltyCoin: dis.loyaltyCoin,
                        bonusGoods: dis.bonusGoods ? dis.bonusGoods.map(bonus => {
                            return {
                                good: bonus.good,
                                expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus,
                                quantityOfBonusGood: bonus.quantityOfBonusGood
                            }
                        }) : undefined,
                        discountOnGoods: dis.discountOnGoods ?
                            {
                                good: dis.discountOnGoods.good,
                                expirationDate: dis.discountOnGoods.expirationDate,
                                discountedPrice: dis.discountOnGoods.discountedPrice
                            } : undefined
                    };
                }) : undefined,
                note: item.note,
                amount: item.amount,
                amountAfterDiscount: item.amountAfterDiscount,
                amountAfterTax: item.amountAfterTax
            }
        }) : null,
        discounts: data.discounts ? data.discounts.map((dis) => {
            return {
                _id: dis._id,
                code: dis.code,
                type: dis.type,
                formality: dis.formality,
                name: dis.name,
                effectiveDate: dis.effectiveDate,
                expirationDate: dis.expirationDate,
                discountedCash: dis.discountedCash,
                discountedPercentage: dis.discountedPercentage,
                loyaltyCoin: dis.loyaltyCoin,
                maximumFreeShippingCost: dis.maximumFreeShippingCost,
                bonusGoods: dis.bonusGoods ? dis.bonusGoods.map(bonus => {
                    return {
                        good: bonus.good,
                        expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus,
                        quantityOfBonusGood: bonus.quantityOfBonusGood
                    }
                }) : undefined,
            };
        }) : undefined,
        shippingFee: data.shippingFee,
        deliveryTime: data.deliveryTime,
        coin: data.coin,
        allCoin: data.allCoin,
        totalTax: data.totalTax,
        paymentAmount: data.paymentAmount,
        note: data.note,
        bill: data.bill,
        quote: data.quote
    });

    //Tạo đơn từ báo giá thì lưu các trường sau vào báo giá
    if (newSalesOrder.quote) {//Nếu được tạo từ báo giá
        let quote = await Quote(connect(DB_CONNECTION, portal)).findById({ _id: data.quote });
        quote.status = 3; //Đã chốt đơn
        quote.salesOrder = newSalesOrder._id;
        quote.save();
    }

    //Trừ xu khách hàng nếu sử dụng
    if (newSalesOrder.coin) {
        await CustomerService.editCustomerPoint(portal, companyId, newSalesOrder.customer, { point: 0 }, userId)
    }

    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findById({ _id: newSalesOrder._id }).populate([{
        path: 'creator', select: 'name'
    }, {
        path: 'customer', select: 'name taxNumber'
    },{
        path: 'goods.good', select: 'code name baseUnit'
    } ]);;
    return { salesOrder }
}

exports.getAllSalesOrders = async (query, portal) => {
    let { page, limit, code, status, customer } = query;
    let option = {};
    if (code) {
        option.code = new RegExp(code, "i")
    }
    if (status) {
        option.status = status
    }
    if (customer) {
        option.customer = customer
    }

    page = Number(page);
    limit = Number(limit);

    if (!page || !limit) {
        let allSalesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find(option)
            .populate([{
                path: 'creator', select: 'name'
            }, {
                path: 'customer', select: 'name taxNumber'
            },{
                path: 'goods.good', select: 'code name baseUnit'
            }]);
        return { allSalesOrders }
    } else {
        let allSalesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [{
                path: 'creator', select: 'name'
            }, {
                path: 'customer', select: 'name taxNumber'
            },{
                path: 'goods.good', select: 'code name baseUnit'
            }]
        })
        return { allSalesOrders }
    }
}

exports.editSalesOrder = async (userId, companyId, id, data, portal) => {

    if (data.goods) {
        let goods = data.goods.map((item) => {
            return {
                good: item.good,
                returnRule: item.returnRule ? item.returnRule.map((rr) => {
                    return rr;
                }) : undefined,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                manufacturingWorks: item.manufacturingWorks,
                manufacturingPlan: item.manufacturingPlan,
                serviceLevelAgreements: item.serviceLevelAgreements ? item.serviceLevelAgreements.map((sla) => {
                    return {
                        _id: sla._id,
                        title: sla.title,
                        descriptions: sla.descriptions ? sla.descriptions.map(des => des) : undefined
                    };
                }) : undefined,
                taxs: item.taxs ? item.taxs.map((tax) => {
                    return {
                        _id: tax._id,
                        code: tax.code,
                        name: tax.name,
                        description: tax.description,
                        percent: tax.percent
                    };
                }) : undefined,
                discounts: item.discounts ? item.discounts.map((dis) => {
                    return {
                        _id: dis._id,
                        code: dis.code,
                        type: dis.type,
                        formality: dis.formality,
                        name: dis.name,
                        effectiveDate: dis.effectiveDate,
                        expirationDate: dis.expirationDate,
                        discountedCash: dis.discountedCash,
                        discountedPercentage: dis.discountedPercentage,
                        loyaltyCoin: dis.loyaltyCoin,
                        bonusGoods: dis.bonusGoods ? dis.bonusGoods.map(bonus => {
                            return {
                                good: bonus.good,
                                expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus,
                                quantityOfBonusGood: bonus.quantityOfBonusGood
                            }
                        }) : undefined,
                        discountOnGoods: dis.discountOnGoods ?
                            {
                                good: dis.discountOnGoods.good,
                                expirationDate: dis.discountOnGoods.expirationDate,
                                discountedPrice: dis.discountOnGoods.discountedPrice
                            } : undefined
                    };
                }) : undefined,
                note: item.note,
                amount: item.amount,
                amountAfterDiscount: item.amountAfterDiscount,
                amountAfterTax: item.amountAfterTax
            }
        })
        data = { ...data, goods };
    }

    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    //Trả lại số xu đã sử dụng cho khách trong trường hợp hủy đơn
    if (salesOrder && salesOrder.status===8) {
        let customerPoint = await CustomerService.getCustomerPoint(portal, companyId, salesOrder.customer);
        if (customerPoint && salesOrder.coin) {
            await CustomerService.editCustomerPoint(portal, companyId, customerPoint._id, {point:salesOrder.coin + customerPoint.point }, userId)
        }
    }

    let salesOrderUpdated = await SalesOrder(connect(DB_CONNECTION, portal)).findById(id)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name taxNumber'
        },{
            path: 'goods.good', select: 'code name baseUnit'
        }]);

    return { salesOrder: salesOrderUpdated }
}

exports.approveSalesOrder = async (salesOrderId, approver, portal) => {
    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findById(salesOrderId)

    if (!salesOrder) {
        throw Error("Sales Order is not existing")
    }

    salesOrder.approvers.push({
        approver: approver.approver,
        approverRole: approver.approverRole,
        approveAt: new Date(),
        status: approver.status
    });

    salesOrder.save();

    return { salesOrder }
}

/**
 * Lên kế hoạch sản xuất cho từng hàng hóa trong đơn
 * @param {*} salesOrderId id đơn hàng
 * @param {*} data là 1 array: [{goodId: ObjecId, manufacturingPlanId: ObjectId}] 
 */
exports.addManufacturingPlanForGood = async (salesOrderId, manufacturingWorksId, manufacturingPlanId, portal) => {
    //data: [{goodId, manufacturingPlanId}] 
    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findById(salesOrderId);
    if (!salesOrder) {
        throw Error("Sales Order is not existing")
    }

    let goodsOfSalesOrder = salesOrder.goods.map((good) => {
        if (good.manufacturingWorks.equals(manufacturingWorksId)) {
            good.manufacturingPlan = manufacturingPlanId
        }
        return good;
    })

    salesOrder.goods = goodsOfSalesOrder;
    salesOrder.status = 4;

    await salesOrder.save();

    return { salesOrder }
}

/**
 * Lấy các đơn hàng cần lập kế hoạch sản xuất theo nhà máy (chỉ lấy những mặt hàng nhà máy có thể sản xuất)
 * @param {*} manufacturingWorksId id nhà máy
 */
exports.getSalesOrdersByManufacturingWorks = async (currentRole, portal) => {
    // Lấy ra Id các nhà máy mà currentRole là quản đốc
    let listWorksIds = await getListWorksIdsByCurrentRole(currentRole, portal);

    //Lấy những đơn hàng có trạng thái là "yêu cầu sản xuất"
    let salesOrdersWithStatus = await SalesOrder(connect(DB_CONNECTION, portal)).find({ status: 3 })
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'goods.good',
            populate: [{
                path: 'manufacturingMills.manufacturingMill'
            },{
                path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
            }]
        }]);
    //Lọc đơn hàng theo nhà máy
    let salesOrders = [];
    for (let index = 0; index < salesOrdersWithStatus.length; index++) {
        //Lấy các mặt hàng theo nhà máy mà chưa được lập kế hoạch

        let goodsForManufacturingPlan = salesOrdersWithStatus[index].goods.filter((good) => {
            if (checkValueInArray(listWorksIds, good.manufacturingWorks) && !good.manufacturingPlan) {
                return true;
            } else {
                return false;
            }
        });
        //Thêm vào danh sách các đơn hàng cho nhà máy
        if (goodsForManufacturingPlan.length) {
            salesOrdersWithStatus[index].goods = goodsForManufacturingPlan;
            salesOrders.push(salesOrdersWithStatus[index]);
        }
    }
    return { salesOrders }
}
// Kiểm tra value có trong array hay ko 
function checkValueInArray(array, value) {
    let result = false;
    for (let i = 0; i < array.length; i++) {
        if (array[i].equals(value)) {
            result = true
        }
    }
    return result
}


// Lấy ra danh sách id nhà máy mà currentRole quản lý
async function getListWorksIdsByCurrentRole(currentRole, portal) {
    // Xử  lý các quyền trước để tìm ra các kế hoạch trong các nhà máy được phân quyền
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    return listWorksId;

}




//Lấy các đơn hàng chưa thanh toán của khách hàng
exports.getSalesOrdersForPayment = async (customerId, portal) => {
    let salesOrdersForPayment = await SalesOrder(connect(DB_CONNECTION, portal)).find({ customer: customerId });
    let salesOrders = [];
    if (salesOrdersForPayment.length) {
        for (let index = 0; index < salesOrdersForPayment.length; index++) {
            let paid = await PaymentService.getPaidForSalesOrder(salesOrdersForPayment[index]._id, portal);

            if (paid < salesOrdersForPayment[index].paymentAmount) {
                //Chỉ trả về các đơn hàng chưa thanh toán
                salesOrders.push({
                    _id: salesOrdersForPayment[index]._id,
                    code: salesOrdersForPayment[index].code,
                    paymentAmount: salesOrdersForPayment[index].paymentAmount,
                    customer: salesOrdersForPayment[index].customer,
                    paid: paid,
                })
            }
        }
    }

    return { salesOrders }
}

exports.getSalesOrderDetail = async (id, portal) => {
    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name taxNumber'
        }, {
            path: 'goods.good',
            populate: [{
                path: 'manufacturingMills.manufacturingMill'
            }]
        }, {
            path: 'goods.manufacturingWorks', select: 'code name address description'
        },{
            path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
        } , {
            path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
        }, {
            path: 'goods.discounts.discountOnGoods.good', select: 'code name baseUnit'
        }, {
            path: 'discounts.bonusGoods.good', select: 'code name baseUnit'
        }, {
            path: 'quote', select: 'code createdAt'
        }])

    if (!salesOrder) {
        throw Error("Sales Order is not existing")
    }

    return {salesOrder}

}