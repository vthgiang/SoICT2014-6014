const {
    Discount
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.createNewDiscount = async (userId, data, portal) => {


    let newDiscount = await Discount(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        description: data.description ? data.description : "",
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
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
                        quantityOfBonusGood: good.quantityOfBonusGood
                    }
                }) :  undefined,
                discountOnGoods: item.discountOnGoods ? item.discountOnGoods.map((good) => {
                    return {
                        good: good.good,
                        expirationDate: good.expirationDate ? good.expirationDate : undefined
                    }
                }) : undefined,
            }
        }) : undefined,
        version: 1,//default create = version 1
        status: true, // default create status = true
    })
    console.log("New",newDiscount);
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

exports.getAllDiscounts = async ( query, portal) => {
    let { page, limit } = query;
    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if(query.name) {
        option.name = new RegExp(query.name, "i")
    }

    //Chỉ lấy những tax đang có hiệu lực
    option.status = true;

    if (!page || !limit) {
        let allDiscounts = await Discount(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: 'creator', select: 'name'
            }, {
                path: 'bonusGoods.good', select: 'name code'
            }, {
                path: 'discountOnGoods.good', select: 'name code'
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
                    path: 'bonusGoods.good', select: 'name code'
                }, {
                    path: 'discountOnGoods.good', select: 'name code'
                }]
            })
        
        return { allDiscounts }
    }
}



