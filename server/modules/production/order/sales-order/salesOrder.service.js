const {
    SalesOrder, Quote, OrganizationalUnit, ManufacturingWorks, BusinessDepartment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const PaymentService = require('../payment/payment.service');
const CustomerService = require('../../../crm/customer/customer.service');
const BusinessDepartmentServices = require('../business-department/buninessDepartment.service');
const { query } = require('express');

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
            }
        }) : undefined,
        organizationalUnit: data.organizationalUnit,
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
    }, {
        path: 'goods.good', select: 'code name baseUnit'
    }, {
        path: 'goods.manufacturingWorks', select: 'code name address description'
    }, {
        path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
    }]);;
    return { salesOrder }
}

exports.getAllSalesOrders = async (userId, query, portal) => {
    //Lấy cấp dưới người ngày quản lý (bao gồm cả người này và các nhân viên phòng ban con)
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);

    let option = {};
    let { page, limit, code, status, customer } = query;

    if (users.length) {
        option = {
            $or: [{ creator: users },
            { approvers: { $elemMatch: { approver: userId } } }],
        };
    }
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
            }, {
                path: 'goods.good', select: 'code name baseUnit'
            }, {
                path: 'goods.manufacturingWorks', select: 'code name address description'
            }, {
                path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
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
            }, {
                path: 'goods.good', select: 'code name baseUnit'
            }, {
                path: 'goods.manufacturingWorks', select: 'code name address description'
            }, {
                path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
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
    if (salesOrder && salesOrder.status === 8) {
        let customerPoint = await CustomerService.getCustomerPoint(portal, companyId, salesOrder.customer);
        if (customerPoint && salesOrder.coin) {
            await CustomerService.editCustomerPoint(portal, companyId, customerPoint._id, { point: salesOrder.coin + customerPoint.point }, userId)
        }
    }

    let salesOrderUpdated = await SalesOrder(connect(DB_CONNECTION, portal)).findById(id)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name taxNumber'
        }, {
            path: 'goods.good', select: 'code name baseUnit'
        }, {
            path: 'goods.manufacturingWorks', select: 'code name address description'
        }, {
            path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
        }]);

    return { salesOrder: salesOrderUpdated }
}

function checkStatusApprove(approvers) {
    let count = 0; //Đếm xem số người phê duyệt có trạng thái bằng 2
    for (let index = 0; index < approvers.length; index++) {
        if (parseInt(approvers[index].status) === 2) {
            count++;
        } else if (parseInt(approvers[index].status) === 3) {
            return 8;//Trả về trạng thái đơn là đã hủy
        }
    }

    if (count === approvers.length) {
        return 2; //Trả về trạng thái đơn là đã phê duyệt
    }

    return -1; //Chưa cần thay đổi trạng thái
}

exports.approveSalesOrder = async (salesOrderId, data, portal) => {
    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findById(salesOrderId).populate([{
        path: 'creator', select: 'name'
    }, {
        path: 'customer', select: 'name taxNumber'
    }, {
        path: 'goods.good', select: 'code name baseUnit'
    }, {
        path: 'goods.manufacturingWorks', select: 'code name address description'
    }, {
        path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
    }])

    if (!salesOrder) {
        throw Error("Sales Order is not existing")
    }

    let indexApprover = salesOrder.approvers.findIndex((element) => element.approver.toString() === data.approver.toString())

    if (indexApprover !== -1) {
        salesOrder.approvers[indexApprover] = {
            approver: data.approver,
            approveAt: new Date(),
            status: data.status,
            note: data.note
        }

        let statusChange = checkStatusApprove(salesOrder.approvers);
        if (statusChange !== -1) {
            salesOrder.status = statusChange;
        }

        salesOrder.save();
    } else {
        throw Error("Can't find approver in sales order!")
    }

    return { salesOrder }
}

//Kiểm tra yêu cầu sản xuất đã lên kế hoạch hết hay chưa
function checkAndChangeSalesOrderStatus(goods) {
    for (let index = 0; index < goods.length; index++) {
        if (goods[index].manufacturingWorks && !goods[index].manufacturingPlan) {
            //Yêu cầu nhà máy sản xuất mà chưa lên kế hoạch
            return 3;
        }
    }
    //Tất cả yêu cầu sản xuất đều đã lên kế hoạch
    return 4;
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
    salesOrder.status = checkAndChangeSalesOrderStatus(goodsOfSalesOrder)

    await salesOrder.save();

    return { salesOrder }
}

exports.removeManufacturingPlanForGood = async (salesOrderId, manufacturingWorksId, portal) => {
    //data: [{goodId, manufacturingPlanId}] 
    let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findById(salesOrderId);
    if (!salesOrder) {
        throw Error("Sales Order is not existing")
    }

    let goodsOfSalesOrder = salesOrder.goods.map((good) => {
        if (good.manufacturingWorks.equals(manufacturingWorksId)) {
            good.manufacturingPlan = null
        }
        return good;
    })

    salesOrder.goods = goodsOfSalesOrder;
    salesOrder.status = checkAndChangeSalesOrderStatus(goodsOfSalesOrder)

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
            }, {
                path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
            }]
        }, {
            path: 'customer', select: 'name taxNumber'
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
        }, {
            path: 'goods.manufacturingPlan', select: 'code status startDate endDate'
        }, {
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

    return { salesOrder }

}

//PHẦN SERVICE PHỤC VỤ THỐNG KÊ
exports.countSalesOrder = async (userId, query, portal) => {
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
    let { startDate, endDate } = query;
    let option = {};
    if (users.length) {
        option = {
            $or: [{ creator: users },
            { approvers: { $elemMatch: { approver: userId } } }],
        };
    }
    if (startDate && endDate) {
        option = {
            ...option,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }
    }

    let allSalesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find(option);
    let totalMoneyWithStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //Lấy tổng tiền theo trạng thái
    let totalNumberWithStauts = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //Lấy số lượng đơn theo trạng thái
    let totalMoney = 0;

    for (let index = 0; index < allSalesOrders.length; index++) {
        totalMoneyWithStatus[allSalesOrders[index].status] += allSalesOrders[index].paymentAmount;
        totalNumberWithStauts[allSalesOrders[index].status] += 1;
        if (allSalesOrders[index].status === 7) {
            totalMoney += allSalesOrders[index].paymentAmount
        }
    }

    return { salesOrdersCounter: { count: allSalesOrders.length, totalMoneyWithStatus, totalNumberWithStauts, totalMoney } }
}

//Lấy danh sách các sản phẩm bán chạy
exports.getTopGoodsSold = async (userId, query, portal) => {
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
    let { startDate, endDate, status } = query;
    let option = {};
    if (users.length) {
        option = {
            $or: [{ creator: users },
            { approvers: { $elemMatch: { approver: userId } } }],
        };
    }
    if (startDate && endDate) {
        option = {
            ...option,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }
    }

    if (status) {
        option.status = status;
    }

    let salesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find(option).populate([{
        path: 'goods.good', select: 'code name baseUnit'
    }]);

    //Dữ liệu dạng {good: id, code, name, baseUnit, quantity}
    let listGoods = [];

    for (let index = 0; index < salesOrders.length; index++) {
        let { goods } = salesOrders[index];
        for (let indexGood = 0; indexGood < goods.length; indexGood++) {
            let indexInListGoods = listGoods.findIndex(element => element.good.equals(goods[indexGood].good._id));
            if (indexInListGoods !== -1) {
                let quantity = listGoods[indexInListGoods].quantity + goods[indexGood].quantity;
                listGoods[indexInListGoods] = {
                    good: goods[indexGood].good._id,
                    code: goods[indexGood].good.code,
                    name: goods[indexGood].good.name,
                    baseUnit: goods[indexGood].good.baseUnit,
                    quantity
                }
            } else {
                listGoods.push({
                    good: goods[indexGood].good._id,
                    code: goods[indexGood].good.code,
                    name: goods[indexGood].good.name,
                    baseUnit: goods[indexGood].good.baseUnit,
                    quantity: goods[indexGood].quantity
                })
            }
        }
    }

    let topGoodsSold = listGoods.sort((a, b) => {
        return b.quantity - a.quantity
    })

    return { topGoodsSold }
}

//Lấy doanh số tất cả các phòng kinh doanh
exports.getSalesForDepartments = async (query, portal) => {
    let { startDate, endDate, status } = query;
    let option = {};

    if (startDate && endDate) {
        option = {
            ...option,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }
    }

    if (status) {
        option.status = status;
    }

    //Lấy các đơn vị bán hàng
    let salesDepartments = await BusinessDepartment(connect(DB_CONNECTION, portal)).find({ role: 1 }).populate([{
        path: 'organizationalUnit', select: "name"
    }]);

    //Lấy tất cả đơn bán hàng trong giai đoạn này
    let allSalesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find(option);

    let salesForDepartments = [];

    for (let index = 0; index < salesDepartments.length; index++) {
        //Lấy danh sách tất cả mọi người trong từng phòng ban
        let salesOrDepartment = {
            organizationalUnit: salesDepartments[index].organizationalUnit,
            users: [] // Dữ liệu dạng { user, sales} gồm dữ liệu người dùng và doanh số bán hàng của người đó
        }

        //Lấy danh sách người dùng trong phòng ban
        let listUsers = await BusinessDepartmentServices.getAllUsersInDepartments(salesDepartments[index].organizationalUnit._id, portal)

        for (let indexUser = 0; indexUser < listUsers.length; indexUser++) {
            let userData = { //Thông tin doanh số của 1 người
                user: listUsers[indexUser],
                sales: 0
            }
            let salesOrderOfUser = allSalesOrders.filter(element => element.creator.equals(listUsers[indexUser]._id));
            for (let indexSalesOrder = 0; indexSalesOrder < salesOrderOfUser.length; indexSalesOrder++) {
                userData.sales += salesOrderOfUser[indexSalesOrder].paymentAmount
            }

            //Thêm thông tin bán hàng của người đó vào thông tin bán hàng của phòng ban
            salesOrDepartment.users.push(userData)
        }

        //Thêm thông tin bán hàng của phòng ban vào thông tin bán hàng của danh sách tất cả các phòng ban
        salesForDepartments.push(salesOrDepartment)
    }

    return { salesForDepartments }
}

// Kiểm tra value có trong array hay ko 
function checkValueInArrayNumber(array, value) {
    let result = false;
    for (let i = 0; i < array.length; i++) {
        if (value.equals(array[i])) {
            result = true
        }
    }
    return result
}

exports.getNumberWorksSalesOrder = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    let listWorksId = await getListWorksIdsByCurrentRole(currentRole, portal);
    if (manufacturingWorks) {
        listWorksId = manufacturingWorks;
    }
    let options = {};

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }
    options = {
        ...options,
        $or: [{
            status: 3
        }, {
            status: 4
        }]
    }

    const listSalesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find(options);

    //  Số đơn sản xuất cần lên KH
    let salesOrder1 = 0;
    for (let i = 0; i < listSalesOrders.length; i++) {
        for (let j = 0; j < listSalesOrders[i].goods.length; j++) {
            if (checkValueInArrayNumber(listWorksId, listSalesOrders[i].goods[j].manufacturingWorks)) {
                salesOrder1 += 1;
                break;
            }
        }
    }

    // Số đơn sản xuất đã lên xong kế hoạch
    let salesOrder2 = 0;
    if (listWorksId.length > 1) { //Quyền này là quyền tất cả
        for (let i = 0; i < listSalesOrders.length; i++) {
            let check = true;
            for (let j = 0; j < listSalesOrders[i].goods.length; j++) {
                if (checkValueInArrayNumber(listWorksId, listSalesOrders[i].goods[j].manufacturingWorks) && !listSalesOrders[i].goods[j].manufacturingPlan) {
                    check = false
                }
            }
            if (check) {
                salesOrder2 += 1;
            }
        }
    } else {
        for (let i = 0; i < listSalesOrders.length; i++) {
            for (let j = 0; j < listSalesOrders[i].goods.length; j++) {
                if (checkValueInArrayNumber(listWorksId, listSalesOrders[i].goods[j].manufacturingWorks) && listSalesOrders[i].goods[j].manufacturingPlan) {
                    salesOrder2 += 1;
                    break;
                }
            }
        }
    }

    // Số đơn sản xuất chưa lên xong kế hoạch
    let salesOrder3 = 0;
    for (let i = 0; i < listSalesOrders.length; i++) {
        for (let j = 0; j < listSalesOrders[i].goods.length; j++) {
            if (checkValueInArrayNumber(listWorksId, listSalesOrders[i].goods[j].manufacturingWorks) && !listSalesOrders[i].goods[j].manufacturingPlan) {
                salesOrder3 += 1;
                break;
            }
        }
    }

    return { salesOrder1, salesOrder2, salesOrder3 }

}


function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}







