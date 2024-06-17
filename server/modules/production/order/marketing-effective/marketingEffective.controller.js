const { MarketingEffective } = require('../../../../models');
const MarketingEffectiveService = require('./marketingEffective.service');
const Log = require(`../../../../logs`);
const { connect } = require('../../../../helpers/dbHelper');
const moment = require('moment')

exports.getMarketingEffective = async (req, res) => {
    const { startDate, endDate } = req.query;

    const formattedStartDate = startDate ? moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
    
    const start = formattedStartDate ? new Date(formattedStartDate) : null;
    const end = formattedEndDate ? new Date(formattedEndDate) : null;
    // const start = startDate ? new Date(startDate) : null;
    // const end = endDate ? new Date(endDate) : null;
    let pipeline = [];

    if (start && end) {
        pipeline.push({
            $match: {
                date: {
                    $gte: start,
                    $lte: end
                }
            }
        });
    } else if (start) {
        pipeline.push({
            $match: {
                date: {
                    $gte: start
                }
            }
        });
    } else if (end) {
        pipeline.push({
            $match: {
                date: {
                    $lte: end
                }
            }
        });
    }

    pipeline.push({
        $group: {
            _id: null,
            totalClick: { $sum: "$click" },
            totalImpression: { $sum: "$impression" },
            totalSession: { $sum: "$session" },
            totalTransaction: { $sum: "$transaction" },
            totalRevenue: { $sum: "$revenue" },
            totalPositiveRes: { $sum: "$positiveRes" },
            totalNegativeRes: { $sum: "$negativeRes" },
            totalConversion: { $sum: "$conversion" },
            totalCost: { $sum: "$cost" }
        }
    });

    if (pipeline.length === 1 && pipeline[0].$group) {
        pipeline.unshift({ $match: {} });
    }

    try {
        let allMarketingEffectives = await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate(pipeline);
        
        console.log('allMarketingEffectives', allMarketingEffectives)
        await Log.info(req.user.email, "GET_ALL_getMarketingEffective", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allMarketingEffectives
        });
    } catch (error) {
        console.log('error', error);
        await Log.error(req.user.email, "GET_ALL_DISCOUNTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getTopMarketingCampaign = async (req, res) => {
    try {
        let allMarketingEffectives = await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate([
            {
                $lookup: {
                    from: "marketingcampaigns",
                    localField: "marketingId",
                    foreignField: "_id",
                    as: "campaign"
                }
            },
            {
                $unwind: "$campaign"
            },
            {
                $group: {
                    _id: "$campaign._id",
                    name: { $first: "$campaign.name" },
                    totalClick: { $sum: "$click" },
                    totalImpression: { $sum: "$impression" },
                    totalSession: { $sum: "$session" },
                    totalTransaction: { $sum: "$transaction" },
                    totalRevenue: { $sum: "$revenue" },
                    totalPositiveRes: { $sum: "$positiveRes" },
                    totalNegativeRes: { $sum: "$negativeRes" },
                    totalConversion: { $sum: "$conversion" },
                    totalCost: { $sum: "$cost" }
                }
            },
            {
                $sort: { totalCost: -1 }
            }, {
                $limit: 5
            }
        ]);

        await Log.info(req.user.email, "GET_ALL_getMarketingEffective", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allMarketingEffectives
        });
    } catch (error) {
        console.log('error', error);
        await Log.error(req.user.email, "GET_ALL_DISCOUNTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}
exports.getMarketingEffectiveChannel = async (req, res) => {
    try {
        let allMarketingEffectives = await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate([
            {
                $lookup: {
                    from: "marketingcampaigns",
                    localField: "marketingId",
                    foreignField: "_id",
                    as: "campaign"
                }
            },
            {
                $unwind: "$campaign"
            },
            {
                $group: {
                    _id: "$campaign.channel",
                    totalClick: { $sum: "$click" },
                    totalImpression: { $sum: "$impression" },
                    totalSession: { $sum: "$session" },
                    totalTransaction: { $sum: "$transaction" },
                    totalRevenue: { $sum: "$revenue" },
                    totalPositiveRes: { $sum: "$positiveRes" },
                    totalNegativeRes: { $sum: "$negativeRes" },
                    totalConversion: { $sum: "$conversion" },
                    totalCost: { $sum: "$cost" }
                }
            },
            {
                $sort: { totalCost: -1 }
            }
        ]);

        await Log.info(req.user.email, "GET_ALL_getMarketingEffective", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allMarketingEffectives
        });
    } catch (error) {
        console.log('error', error);
        await Log.error(req.user.email, "GET_ALL_DISCOUNTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}
