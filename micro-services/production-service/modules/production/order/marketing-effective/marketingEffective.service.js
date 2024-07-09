const {
    MarketingEffective
} = require(`../../../../models`);

const {    connect
} = require(`../../../../helpers/dbHelper`);

// exports.createMarketingCampaign = async ( data, portal) => {
//     // console.log({ userId, data, portal });
//     console.log(data);

//     let newMarketingCampaign = await MarketingCampaign(connect(DB_CONNECTION, portal)).create({
//         // code: data.code,
//         name: data.name,
//         cost: data.cost,
//         channel: data.channel,
//     })
//     console.log('newMarketingCampaign', newMarketingCampaign)
//     return { newMarketingCampaign };
// }

// exports.getAllDiscounts = async (query, portal) => {
//     let { page, limit } = query;
//     let option = {}
//     console.log(query.queryDate);

//     if (query.queryDate) {
//         switch (query.queryDate) {
//             case "expire": option.expirationDate = { $lt: new Date(), $exists: true }; break;
//             case "effective":
//                 option = {
//                     $or: [{ effectiveDate: { $lte: new Date() }, expirationDate: { $gte: new Date() } },
//                         { effectiveDate: { $lte: new Date() }, expirationDate: null  },
//                         { effectiveDate: null, expirationDate: { $gte: new Date()}  },
//                         { effectiveDate: null, expirationDate: null }],
//                 };

//                 break;
//             case "upcoming": option = { $or: [{expirationDate:{ $gte: new Date(), $exists: true } }, {expirationDate: null}] }; break;
//             case "all": break;
//             default:
//         }
//     }

//     if (query.code) {
//         option.code = new RegExp(query.code, "i")
//     }
//     if(query.name) {
//         option.name = new RegExp(query.name, "i")
//     }

//     console.log(option);
//     option.lastVersion = true;

//     if (!page || !limit) {
//         let allDiscounts = await Discount(connect(DB_CONNECTION, portal))
//             .find(option)
//             .populate([{
//                 path: 'creator', select: 'name'
//             }, {
//                 path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
//             }, {
//                 path: 'discounts.discountOnGoods.good', select: 'name code'
//             }])
//             return { allDiscounts }
//     } else {
//         let allDiscounts = await Discount(connect(DB_CONNECTION, portal))
//             .paginate(option, {
//                 page,
//                 limit,
//                 populate: [{
//                     path: 'creator', select: 'name'
//                 }, {
//                     path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
//                 }, {
//                     path: 'discounts.discountOnGoods.good', select: 'name code'
//                 }]
//             })

//         return { allDiscounts }
//     }
// }

// exports.editMarketing = async (id, data, portal) => {
//     console.log('data', data);
//     const result = await MarketingCampaign(connect(DB_CONNECTION, portal)).findOneAndUpdate({_id: id}, {...data}, { new: true });
//     return { result }
// }

// exports.changeMarketingStatus = async (id, portal) => {
//     const result = await MarketingCampaign(connect(DB_CONNECTION, portal))
//     .findOneAndUpdate({_id: id}, {status: 1}, { new: true })
//     return { result }
// }

// exports.changeMarketingStatus = async (id, portal) => {
//     const campaign = await MarketingCampaign(connect(DB_CONNECTION, portal)).findOne({ _id: id });

//     if (!campaign) {
//         throw new Error('Campaign not found');
//     }

//     campaign.status = !campaign.status;

//     return await campaign.save();
// };


// exports.deleteMarketingCampaign = async (id, portal) => {
//     const result = await MarketingCampaign(connect(DB_CONNECTION, portal))
//         .findByIdAndDelete({ _id: id})
//     return result;
// }

// exports.getDiscountByGoodsId = async (query, portal) => {
//     let { goodId, quantity } = query;

//     let queryDate =
//     [{ effectiveDate: { $lte: new Date() }, expirationDate: { $gte: new Date() } },
//     { effectiveDate: { $lte: new Date() }, expirationDate: null },
//     { effectiveDate: null, expirationDate: { $gte: new Date() } },
//     { effectiveDate: null, expirationDate: null }];

//     let discounts = await Discount(connect(DB_CONNECTION, portal)).find({
//         discounts:
//             { $elemMatch: { discountOnGoods: { $elemMatch: { good: goodId } } } },
//         lastVersion: true,
//         status: true,
//         type: 1,
//         $or: queryDate,
//     }).populate([ {
//         path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
//     }, {
//         path: 'discounts.discountOnGoods.good', select: 'name code baseUnit'
//     }])
//     if (!discounts) {
//         throw Error("No discount for good!")
//     }

//     return { discounts };
// }

// exports.getDiscountForOrderValue = async (query, portal) => {

//     let queryDate =
//     [{ effectiveDate: { $lte: new Date() }, expirationDate: { $gte: new Date() } },
//     { effectiveDate: { $lte: new Date() }, expirationDate: null },
//     { effectiveDate: null, expirationDate: { $gte: new Date() } },
//     { effectiveDate: null, expirationDate: null }];

//     let discounts = await Discount(connect(DB_CONNECTION, portal)).find({
//         lastVersion: true,
//         status: true,
//         type: 0,
//         $or: queryDate,
//     }).populate([ {
//         path: 'discounts.bonusGoods.good', select: 'name code baseUnit'
//     }, {
//         path: 'discounts.discountOnGoods.good', select: 'name code baseUnit'
//     }])
//     if (!discounts) {
//         throw Error("No discount for order value!")
//     }

//     return { discounts };
// }
