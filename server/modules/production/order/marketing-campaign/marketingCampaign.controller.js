const { MarketingCampaign } = require('../../../../models');
const MarketingCampaignService = require('./marketingCampaign.service');
const Log = require(`../../../../logs`);
const { connect } = require('../../../../helpers/dbHelper');

exports.createNewMarketingCampaign = async (req, res) => {
    try {
        let data = req.body;
        let marketingCampaign = await MarketingCampaignService.createMarketingCampaign( data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_MarketingCampaign", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: marketingCampaign
        });
    }  catch (error) {
        console.log('error'. error);
        await Log.error(req.user.email, "CREATED_NEW_MarketingCampaign", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getMarketingCampaign = async ( req, res ) => {
    try {
        let allMarketingCampaigns = await MarketingCampaign(connect(DB_CONNECTION, req.portal)).find().sort([['createdAt', -1]]);;
        console.log('allMarketingCampaigns', allMarketingCampaigns);

        await Log.info(req.user.email, "GET_ALL_getMarketingCampaign", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allMarketingCampaigns
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

exports.editMarketing = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await MarketingCampaignService.editMarketing(id,  req.body, req.portal);

        await Log.info(req.user.email, "EDIT_DISCOUNT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: result
        });
    } catch (error) {
        console.log('error'. error);
        await Log.error(req.user.email, "EDIT_DISCOUNT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.changeMarketingStatus = async ( req, res ) => {
    try {
        const id = req.params.id;
        const result = await MarketingCampaignService.changeMarketingStatus(id, req.portal)
        await Log.info(req.user.email, "CHANGE_MARKETING_CAMPAIGN_STATUS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["change_status_successfully"],
            content: result
        });
    } catch (error) {
        console.log('error'. error);
        await Log.error(req.user.email, "CHANGE_MARKETING_CAMPAIGN_STATUS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["change_status_failed"],
            content: error.message
        });
    }
}

exports.deleteMarketingCampaign = async ( req, res ) => {
    try {
        const { campaignId } = req.params;
        const result = await MarketingCampaignService.deleteMarketingCampaign(campaignId, req.portal)

        await Log.info(req.user.email, "DELETE_MARKETING_CAMPAIGN", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_successfully"],
            content: result
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_DISCOUNT_BY_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["delete_failed"],
            content: error.message
        });
    }
}

// exports.getDiscountByGoodsId = async (req, res) => {
//     try {
//         let discounts = await DiscountService.getDiscountByGoodsId(req.query, req.portal)

//         await Log.info(req.user.email, "GET_DISCOUNT_BY_GOOD_ID", req.portal);
//         res.status(200).json({
//             success: true,
//             messages: ["get_by_good_successfully"],
//             content: discounts
//         });
//     } catch (error) {
//         await Log.error(req.user.email, "GET_DISCOUNT_BY_GOOD_ID", req.portal);

//         res.status(400).json({
//             success: false,
//             messages: ["get_by_good_failed"],
//             content: error.message
//         });
//     }
// }

// exports.getDiscountForOrderValue = async (req, res) => {
//     try {
//         let discounts = await DiscountService.getDiscountForOrderValue(req.query, req.portal)

//         await Log.info(req.user.email, "GET_DISCOUNT_BY_ORDER_VALUE", req.portal);
//         res.status(200).json({
//             success: true,
//             messages: ["get_for_order_successfully"],
//             content: discounts
//         });
//     } catch (error) {
//         await Log.error(req.user.email, "GET_DISCOUNT_BY_ORDER_VALUE", req.portal);

//         res.status(400).json({
//             success: false,
//             messages: ["get_for_order_failed"],
//             content: error.message
//         });
//     }
// }
