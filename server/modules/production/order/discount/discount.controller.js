const DiscountService = require('./discount.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createNewDiscount = async (req, res) => {
    try {
        let data = req.body;
        let discount = await DiscountService.createNewDiscount(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_DISCOUNT", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: discount
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_DISCOUNT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getAllDiscounts = async ( req, res ) => {
    try {
        let query = req.query;
        let allDiscounts = await DiscountService.getAllDiscounts( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_DISCOUNTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allDiscounts
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_DISCOUNTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

