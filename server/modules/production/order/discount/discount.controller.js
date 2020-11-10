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

exports.editDiscount = async (req, res) => {
    try {
        let id = req.params.id;
        data = req.body;
        let discount = await DiscountService.editDiscount(req.user._id, id, data, req.portal);

        await Log.info(req.user.email, "EDIT_DISCOUNT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: discount
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_DISCOUNT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.changeDiscountStatus = async ( req, res ) => {
    try {
        let id = req.params.id;
        let discount = await DiscountService.changeDiscountStatus(id, req.portal)
        await Log.info(req.user.email, "CHANGE_DISCOUNT_STATUS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["change_status_successfully"],
            content: discount
        });
    } catch (error) {
        await Log.error(req.user.email, "CHANGE_DISCOUNT_STATUS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["change_status_failed"],
            content: error.message
        });
    }
}

exports.deleteDiscountByCode = async ( req, res ) => {
    try {
        let code = req.query.code;
        let discounts = await DiscountService.deleteDiscountByCode(code, req.portal)
        
        await Log.info(req.user.email, "DELETE_DISCOUNT_BY_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_successfully"],
            content: discounts
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

