const { MarketingEffective } = require('../../../../models');
const MarketingEffectiveService = require('./marketingEffective.service');
const Log = require(`../../../../logs`);
const { connect } = require('../../../../helpers/dbHelper');
const moment = require('moment');
const mongoose = require('mongoose');

exports.getMarketingEffective = async (req, res) => {
    const { startDate, endDate } = req.query;
    const formattedStartDate = startDate ? moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
    
    const start = formattedStartDate ? new Date(formattedStartDate) : null;
    const end = formattedEndDate ? new Date(formattedEndDate) : null;
    
    const diffDay = start && end && moment(end).diff(start, 'days');
    
    let pipelineCurrent = [];
    let pipelineOld = [];

    if (diffDay) {
        const oldStart = moment(start).subtract(diffDay, 'days').toDate();
        const oldEnd = moment(end).subtract(diffDay, 'days').toDate();
    
        pipelineOld.push({
            $match: {
                date: {
                    $gte: oldStart,
                    $lte: oldEnd
                }
            }
        });
    
        pipelineOld.push({
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
    
        if (pipelineOld.length === 1 && pipelineOld[0].$group) {
            pipelineOld.unshift({ $match: {} });
        }
    }
    
    if (start && end) {
        pipelineCurrent.push({
            $match: {
                date: {
                    $gte: start,
                    $lte: end
                }
            }
        });
    } 
    else if (start) {
        pipelineCurrent.push({
            $match: {
                date: {
                    $gte: start
                }
            }
        });
    } else if (end) {
        pipelineCurrent.push({
            $match: {
                date: {
                    $lte: end
                }
            }
        });
    }
    
    pipelineCurrent.push({
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

    if (pipelineCurrent.length === 1 && pipelineCurrent[0].$group) {
        pipelineCurrent.unshift({ $match: {} });
    }

    try {
        // let allMarketingEffectives = await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate(pipeline);
        
        // console.log('allMarketingEffectives', allMarketingEffectives)

        let allMarketingEffectivesCurrent = await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate(pipelineCurrent);
        let allMarketingEffectivesOld = diffDay ? await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate(pipelineOld) : [];

        console.log('allMarketingEffectivesOld', allMarketingEffectivesOld);
        console.log('allMarketingEffectivesCurrent', allMarketingEffectivesCurrent);
        let percentageChanges = {};

        function calculatePercentageChanges(current, old) {
            const fields = [
                'totalClick', 'totalImpression', 'totalSession', 'totalTransaction',
                'totalRevenue', 'totalPositiveRes', 'totalNegativeRes', 'totalConversion', 'totalCost', 'totalCPC', 'totalRoim'
            ];
        
            let percentageChanges = {};

            fields.forEach(field => {
                const currentVal = current[0] ? current[0][field] : null;
                const oldVal = old[0] ? old[0][field] : null;
        
                if (currentVal !== null && oldVal !== null) {
                    
                    if(field === 'totalCPC') {
                        const currentCPC = current[0]['totalCost'] / current[0]['totalClick']
                        const oldCPC = old[0]['totalCost'] / old[0]['totalClick']
                        percentageChanges['totalCPC'] = (((currentCPC - oldCPC) / oldCPC) * 100).toFixed(2); 
                    } else if(field === 'totalRoim') {
                        const currentRoim = current[0]['totalRevenue'] / current[0]['totalCost']
                        const oldRoim = old[0]['totalRevenue'] / old[0]['totalCost']
                        percentageChanges['totalRoim'] = (((currentRoim - oldRoim) / oldRoim) * 100).toFixed(2); 
                    } else {
                        const change = ((currentVal - oldVal) / oldVal) * 100;
                        percentageChanges[field] = change.toFixed(2); 
                    }
                } else {
                    percentageChanges[field] = null; 
                }
            });
        
            return percentageChanges;
        }
        
        await Log.info(req.user.email, "GET_ALL_getMarketingEffective", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: {
                currentTotals: allMarketingEffectivesCurrent[0],
                percentageChanges: calculatePercentageChanges(allMarketingEffectivesCurrent, allMarketingEffectivesOld)
            }
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

exports.getMarketingDetailById = async (req, res) => {
    const { marketingId } = req.params;

    try {
        let detail = await MarketingEffective(connect(DB_CONNECTION, req.portal)).aggregate([
            {
                $match: {
                    marketingId: mongoose.Types.ObjectId(marketingId)
                }
            },
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
                    _id: "$marketingId",
                    totalClick: { $sum: "$click" },
                    totalImpression: { $sum: "$impression" },
                    totalSession: { $sum: "$session" },
                    totalTransaction: { $sum: "$transaction" },
                    totalRevenue: { $sum: "$revenue" },
                    totalPositiveRes: { $sum: "$positiveRes" },
                    totalNegativeRes: { $sum: "$negativeRes" },
                    totalConversion: { $sum: "$conversion" },
                    totalCost: { $sum: "$cost" },
                    name: { $first: "$campaign.name" },
                    channel: { $first: "$campaign.channel" },
                }
            }
        ]);

        console.log('detail', detail)
        
        await Log.info(req.user.email, "GET_ALL_getMarketingDetailById", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: detail
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
