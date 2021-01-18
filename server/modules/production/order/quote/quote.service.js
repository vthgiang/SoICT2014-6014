const {
    Quote
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const BusinessDepartmentServices = require('../business-department/buninessDepartment.service');

exports.createNewQuote = async (userId, data, portal) => {
    let newQuote = await Quote(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        status: data.status,
        creator: userId,
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
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
        goods: data.goods ? data.goods.map((item) => {
            return {
                good: item.good,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                serviceLevelAgreements: item.serviceLevelAgreements ? item.serviceLevelAgreements.map((sla) => {
                    return {
                        _id: sla._id,
                        title: sla.title,
                        descriptions: sla.descriptions ? sla.descriptions.map(des => des) : undefined
                    };
                }) : undefined,
                taxs: item.taxs ? item.taxs.map((tax)=> {
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
                            }: undefined
                    };
                }) : undefined,
                note: item.note,
                amount: item.amount,
                amountAfterDiscount: item.amountAfterDiscount,
                amountAfterTax: item.amountAfterTax
            }
        }) :  null,
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
        note: data.note
    });

    let quote = await Quote(connect(DB_CONNECTION, portal)).findById({ _id: newQuote._id }).populate([{
        path: 'creator', select: 'name'
    }, {
        path: 'customer', select: 'name taxNumber'
    }]);;
    return { quote }
}

exports.getAllQuotes = async (userId, query, portal) => {
    //Lấy cấp dưới người ngày quản lý (bao gồm cả người này và các nhân viên phòng ban con)
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
    let { page, limit, code, status, customer} = query;
    let option = {};
    if (users.length) {
        option = {
            $or: [{ creator: users},
                { approvers: { $elemMatch: { approver: userId } } } ],
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

    console.log("option",option);

    if (query.queryDate) {
        switch (query.queryDate) {
            case "expire": option.expirationDate = { $lt: new Date(), $exists: true }; break;
            case "effective":
                option.expirationDate = { $gte: new Date(), $exists: true }
                
                break;
            case "all": break;
            default: 
        }
    }

    page = Number(page);
    limit = Number(limit);

    if (!page || !limit) {
        let allQuotes = await Quote(connect(DB_CONNECTION, portal)).find(option)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name taxNumber'
        }, {
            path: 'goods.good', select: 'code name baseUnit'
        }]);
        return { allQuotes }
    } else {
        let allQuotes = await Quote(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [{
                path: 'creator', select: 'name'
            }, {
                path: 'customer', select: 'name taxNumber'
            }]
            })
        return { allQuotes }    
    }
}

exports.editQuote = async (userId, id, data, portal) => {

    if (data.goods) {
        let goods = data.goods.map((item) => {
            return {
                good: item.good,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                serviceLevelAgreements: item.serviceLevelAgreements ? item.serviceLevelAgreements.map((sla) => {
                    return {
                        _id: sla._id,
                        title: sla.title,
                        descriptions: sla.descriptions ? sla.descriptions.map(des => des) : undefined
                    };
                }) : undefined,
                taxs: item.taxs ? item.taxs.map((tax)=> {
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
                            }: undefined
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
    
    await Quote(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
    
    let quoteUpdated = await Quote(connect(DB_CONNECTION, portal)).findById(id)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name taxNumber'
        }]);
        
    return { quote: quoteUpdated }
}

function checkStatusApprove(approvers) {
    let count = 0; //Đếm xem số người phê duyệt có trạng thái bằng 2
    for (let index = 0; index < approvers.length; index++){
        if (parseInt(approvers[index].status) === 2) {
            count++;
        } else if (parseInt(approvers[index].status) === 3) {
            return 4;//Trả về trạng thái đơn là đã hủy
        }
    }

    if (count === approvers.length) {
        return 2; //Trả về trạng thái đơn là đã phê duyệt
    }
    return -1; //Chưa cần thay đổi trạng thái
}

exports.approveQuote = async ( quoteId, data, portal) => {

    let quote = await Quote(connect(DB_CONNECTION, portal)).findById(quoteId).populate([{
        path: 'creator', select: 'name'
    }, {
        path: 'customer', select: 'name taxNumber'
    }])

    if (!quote) {
        throw Error("Quote is not existing")
    }

    let indexApprover = quote.approvers.findIndex((element) => element.approver.toString() === data.approver.toString())

    if (indexApprover !== -1) {
        quote.approvers[indexApprover] = {
            approver: data.approver,
            approveAt: new Date(),
            status: data.status,
            note: data.note
        }

        let statusChange = checkStatusApprove(quote.approvers);
        if (statusChange !== -1) {
            quote.status = statusChange;
        }

        quote.save();
    } else {
        throw Error("Can't find approver in quote!")
    }
    return { quote }
}

exports.deleteQuote = async (id, portal) => {
    let quote = await Quote(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return {quote};
}

//Lấy các báo giá để lập đơn hàng
exports.getQuotesToMakeOrder = async (userId, query, portal) => {
    //Lấy cấp dưới người ngày quản lý (bao gồm cả người này và các nhân viên phòng ban con)
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
    let option = {};
    if (users.length) {
        option = {
            $or: [{ creator: users},
                { approvers: { $elemMatch: { approver: userId } } } ],
        };
    }
    option.status = 2;

    let quotes = await Quote(connect(DB_CONNECTION, portal)).find(option)
    .populate([{
        path: 'goods.good', select: 'code name baseUnit'
    }]);
    return {quotes};
}

exports.getQuoteDetail = async (id, portal) => {
    let quote = await Quote(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name taxNumber'
        }, {
            path: 'goods.good', select: 'code name baseUnit'
        },{
            path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
        },{
            path: 'goods.discounts.discountOnGoods.good', select: 'code name baseUnit'
        }, {
            path: 'discounts.bonusGoods.good', select: 'code name baseUnit'
        },{
            path: 'salesOrder', select: 'code createdAt'
        }])

    if (!quote) {
        throw Error("Quote Order is not existing")
    }

    return { quote }

}

//PHẦN SERVICE PHỤC VỤ THỐNG KÊ
exports.countQuote = async (userId, query, portal) => {
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
    let { startDate, endDate} = query;
    let option = {};
    if (users.length) {
        option = {
            $or: [{ creator: users},
                { approvers: { $elemMatch: { approver: userId } } } ],
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

    let allQuotes = await Quote(connect(DB_CONNECTION, portal)).find(option);
    let totalMoneyWithStatus = [0, 0, 0, 0, 0]; //Lấy tổng tiền theo trạng thái
    let totalNumberWithStauts = [0, 0, 0, 0, 0]; //Lấy số lượng đơn theo trạng thái
    let totalMoney = 0;

    for (let index = 0; index < allQuotes.length; index++) {
        totalMoneyWithStatus[allQuotes[index].status] += allQuotes[index].paymentAmount;
        totalNumberWithStauts[allQuotes[index].status] += 1;
        if (allQuotes[index].status === 7) {
            totalMoney += allQuotes[index].paymentAmount
        }
    }
    
    return { quoteCounter: { count: allQuotes.length, totalMoneyWithStatus, totalNumberWithStauts, totalMoney }}
}

//Lấy danh sách các sản phẩm được quan tâm
exports.getTopGoodsCare = async (userId, query, portal) => {
    let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
    let { startDate, endDate, status} = query;
    let option = {};
    if (users.length) {
        option = {
            $or: [{ creator: users},
                { approvers: { $elemMatch: { approver: userId } } } ],
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

    let quotes = await Quote(connect(DB_CONNECTION, portal)).find(option).populate([{
        path: 'goods.good', select: 'code name baseUnit'
    }]);

    //Dữ liệu dạng {good: id, code, name, baseUnit, quantity}
    let listGoods = [];

    for (let index = 0; index < quotes.length; index++) {
        let { goods } = quotes[index];
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

    let topGoodsCare = listGoods.sort((a, b) => {
        return b.quantity - a.quantity
    })

    return {topGoodsCare}
}