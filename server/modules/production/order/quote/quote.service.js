const {
    Quote
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.createNewQuote = async (userId, data, portal) => {
    let newQuote = await Quote(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        status: data.status,
        creator: userId,
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
        customer: data.customer,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerRepresent: data.customerRepresent,
        customerTaxNumber: data.customerTaxNumber,
        customerEmail: data.customerEmail,
        goods: data.goods.length ? data.goods.map((item) => {
            return {
                good: item.good,
                returnRule: item.returnRule ? item.returnRule.map((rr) => {
                    return rr;
                }): undefined,
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
                discounts: item.discounts.length ? item.discounts.map((dis) => {
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
        totalTax: data.totalTax,
        paymentAmount: data.paymentAmount,
        note: data.note
    });

    let quote = await Quote(connect(DB_CONNECTION, portal)).findById({ _id: newQuote._id }).populate([{
        path: 'creator', select: 'name'
    }, {
        path: 'customer', select: 'name'
    }, {
        path: 'goods.good', select: 'code name baseUnit'
    }, {
        path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
    }, {
        path: 'goods.discounts.discountOnGoods.good', select: 'code name baseUnit'
    }, {
        path: 'discounts.bonusGoods.good', select: 'code name baseUnit'
    }]);;
    return { quote }
}

exports.getAllQuotes = async (query, portal) => {
    let { page, limit} = query;
    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if (query.status) {
        option.status = query.status
    }

    page = Number(page);
    limit = Number(limit);

    if (!page || !limit) {
        let allQuotes = await Quote(connect(DB_CONNECTION, portal)).find(option)
        .populate([{
            path: 'creator', select: 'name'
        }, {
            path: 'customer', select: 'name'
        }, {
            path: 'goods.good', select: 'code name baseUnit'
        },{
            path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
        },{
            path: 'goods.discounts.discountOnGoods.good', select: 'code name baseUnit'
        }, {
            path: 'discounts.bonusGoods.good', select: 'code name baseUnit'
        }]);
        return { allQuotes }
    } else {
        let allQuotes = await Quote(connect(DB_CONNECTION, portal)).paginate(option, {
                page,
            limit,
            populate: [{
                path: 'creator', select: 'name'
            }, {
                path: 'customer', select: 'name'
            }, {
                path: 'goods.good', select: 'code name baseUnit'
            }, {
                path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
            }, {
                path: 'goods.discounts.discountOnGoods.good', select: 'code name baseUnit'
            }, {
                path: 'discounts.bonusGoods.good', select: 'code name baseUnit'
            }]
            })
        return { allQuotes }    
    }
}