const {
    Discount
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);


exports.createNewDiscount = async (userId, data, portal) => {
    // console.log({ userId, data, portal });
    console.log(data);

    let newDiscount = await Discount(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        description: data.description ? data.description : "",
        effectiveDate: data.effectiveDate ? data.effectiveDate : "",
        expirationDate: data.expirationDate ? data.expirationDate : "",
        type: data.type,
        creator: userId,
        formality: data.formality,
        discounts: data.discounts ? data.discounts.map((item) =>{
            return{
                discountedCash: item.discountedCash,
                discountedPercentage: item.discountedPercentage,
                loyaltyCoin: item.loyaltyCoin,
                maximumFreeShippingCost: item.maximumFreeShippingCost,
                maximumDiscountedCash: item.maximumDiscountedCash,
                minimumThresholdToBeApplied: item.minimumThresholdToBeApplied,
                maximumThresholdToBeApplied: item.maximumThresholdToBeApplied,
                customerType: item.customerType,
                bonusGoods: item.bonusGoods ? item.bonusGoods.map((good) => {
                    console.log("bonus",good);
                    return {
                        good: good.good,
                        quantityOfBonusGood: good.quantityOfBonusGood,
                        expirationDateOfGoodBonus: good.expirationDateOfGoodBonus ? good.expirationDateOfGoodBonus : undefined,
                        baseUnit: good.baseUnit ? good.baseUnit : undefined
                    }
                }) :  undefined,
                discountOnGoods: item.discountOnGoods ? item.discountOnGoods.map((good) => {
                    return {
                        good: good.good,
                        expirationDate: good.expirationDate ? good.expirationDate : undefined,
                        discountedPrice: good.discountedPrice ? good.discountedPrice : undefined
                    }
                }) : undefined,
            }
        }) : undefined,
        version: 1,//default create = version 1
        status: true, // default create status = true
        lastVersion: true
    })
    let discount = await Discount(connect(DB_CONNECTION, portal))
    .findById({ _id: newDiscount._id })
    .populate([{
        path: 'creator', select: 'name'
    }, {
        path: 'bonusGoods.good', select: 'name code'
    }, {
        path: 'discountOnGoods.good', select: 'name code'
    }])
    return { discount };
}

exports.getAllDiscounts = async (query, portal) => {
    let { page, limit } = query;
    let option = {}
    console.log(query.queryDate);

    if (query.queryDate) {
        switch (query.queryDate) {
            case "expire": option.expirationDate = { $lt: new Date(), $exists: true }; break;
            case "effective":
                option = {
                    $or: [{ effectiveDate: { $lte: new Date() }, expirationDate: { $gte: new Date() } },
                        { effectiveDate: { $lte: new Date() }, expirationDate: null  },
                        { effectiveDate: null, expirationDate: { $gte: new Date()}  },
                        { effectiveDate: null, expirationDate: null }],
                };
                
                break;
            case "upcoming": option = { $or: [{expirationDate:{ $gte: new Date(), $exists: true } }, {expirationDate: null}] }; break;
            case "all": break;
            default: 
        }
    }

    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if(query.name) {
        option.name = new RegExp(query.name, "i")
    }

    console.log(option);
    option.lastVersion = true;

    if (!page || !limit) {
        let allDiscounts = await Discount(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: 'creator', select: 'name'
            }, {
                path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
            }, {
                path: 'discounts.discountOnGoods.good', select: 'name code'
            }])
            return { allDiscounts }
    } else {
        let allDiscounts = await Discount(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page, 
                limit,
                populate: [{
                    path: 'creator', select: 'name'
                }, {
                    path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
                }, {
                    path: 'discounts.discountOnGoods.good', select: 'name code'
                }]
            })
        
        return { allDiscounts }
    }
}


exports.editDiscount = async (userId, id, data, portal) => {
    let oldDiscount = await Discount(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldDiscount) {
        throw Error("Discount is not existing")
    }

    
    //Tạo ra 1 phiên bản tax mới có code giống phiên bản cũ
    let newVersionDiscount = await Discount(connect(DB_CONNECTION, portal)).create({
        code: oldDiscount.code,
        name: data.name,
        description: data.description ? data.description : "",
        effectiveDate: data.effectiveDate ? data.effectiveDate : "",
        expirationDate: data.expirationDate ? data.expirationDate : "",
        type: data.type,
        creator: userId,
        formality: data.formality,
        discounts: data.discounts ? data.discounts.map((item) =>{
            return{
                discountedCash: item.discountedCash,
                discountedPercentage: item.discountedPercentage,
                loyaltyCoin: item.loyaltyCoin,
                maximumFreeShippingCost: item.maximumFreeShippingCost,
                maximumDiscountedCash: item.maximumDiscountedCash,
                minimumThresholdToBeApplied: item.minimumThresholdToBeApplied,
                maximumThresholdToBeApplied: item.maximumThresholdToBeApplied,
                customerType: item.customerType,
                bonusGoods: item.bonusGoods ? item.bonusGoods.map((good) => {
                    return {
                        good: good.good,
                        quantityOfBonusGood: good.quantityOfBonusGood,
                        expirationDateOfGoodBonus: good.expirationDateOfGoodBonus ? good.expirationDateOfGoodBonus : undefined,
                        baseUnit: good.baseUnit ? good.baseUnit : undefined
                    }
                }) :  undefined,
                discountOnGoods: item.discountOnGoods ? item.discountOnGoods.map((good) => {
                    return {
                        good: good.good,
                        expirationDate: good.expirationDate ? good.expirationDate : undefined,
                        discountedPrice: good.discountedPrice ? good.discountedPrice : undefined
                    }
                }) : undefined,
            }
        }) : undefined,
        version: oldDiscount.version + 1,
        status: true,
        lastVersion: true
    })

    oldDiscount.status = false;
    oldDiscount.lastVersion = false
    await oldDiscount.save();
    
    let discount = await Discount(connect(DB_CONNECTION, portal)).findById({ _id: newVersionDiscount._id });
    
    return { discount }
}

exports.changeDiscountStatus = async (id, portal) => {
    let discount = await Discount(connect(DB_CONNECTION, portal))
    .findById(id)

    if (!discount) {
        throw Error("Discount is not existing")
    }

    discount.status = !discount.status;
    discount.save();

    return { discount }
}

exports.deleteDiscountByCode = async (code, portal) => {
    let discounts = await Discount(connect(DB_CONNECTION, portal))
        .find({ code: code })
    if (!discounts.length) {
            throw Error("Discount is not existing")
    }
    let discountsDeleted = [];
    for (let index = 0; index < discounts.length; index++) {
        let discountDeleted = await Discount(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: discounts[index]._id })
        discountsDeleted.push(discountDeleted);
    }
    return discountsDeleted;
}

exports.getDiscountByGoodsId = async (query, portal) => {
    let { goodId, quantity } = query;
    
    let queryDate = 
    [{ effectiveDate: { $lte: new Date() }, expirationDate: { $gte: new Date() } },
    { effectiveDate: { $lte: new Date() }, expirationDate: null },
    { effectiveDate: null, expirationDate: { $gte: new Date() } },
    { effectiveDate: null, expirationDate: null }];

    let discounts = await Discount(connect(DB_CONNECTION, portal)).find({
        discounts:
            { $elemMatch: { discountOnGoods: { $elemMatch: { good: goodId } } } },
        lastVersion: true,
        status: true,
        type: 1,
        $or: queryDate,
    }).populate([ {
        path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
    }, {
        path: 'discounts.discountOnGoods.good', select: 'name code baseUnit'
    }])
    if (!discounts) {
        throw Error("No discount for good!")
    }

    return { discounts };
}

exports.getDiscountForOrderValue = async (query, portal) => {

    let queryDate =
    [{ effectiveDate: { $lte: new Date() }, expirationDate: { $gte: new Date() } },
    { effectiveDate: { $lte: new Date() }, expirationDate: null },
    { effectiveDate: null, expirationDate: { $gte: new Date() } },
    { effectiveDate: null, expirationDate: null }];

    let discounts = await Discount(connect(DB_CONNECTION, portal)).find({
        lastVersion: true,
        status: true,
        type: 0,
        $or: queryDate,
    }).populate([ {
        path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
    }, {
        path: 'discounts.discountOnGoods.good', select: 'name code baseUnit'
    }])
    if (!discounts) {
        throw Error("No discount for order value!")
    }

    return { discounts };
}




