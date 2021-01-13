const QuoteService = require('./quote.service');
const Log = require(`../../../../logs`);

exports.createNewQuote = async (req, res) => {
    try {
        let data = req.body;
        // console.log("DATA:", data);
        let quote = await QuoteService.createNewQuote(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_QUOTE", req.portal);


        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: quote
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_QUOTE", req.portal);

        console.log("Error", error);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getAllQuotes = async (req, res) => {
    try {
        let query = req.query;
        let allQuotes = await QuoteService.getAllQuotes(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_QUOTES", req.portal);

        res.status(200).json({
            success: true,
            message: ["get_successfully"],
            content: allQuotes
        })
        
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_QUOTES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}

exports.editQuote = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;
        let quote = await QuoteService.editQuote(req.user._id, id, data, req.portal)

        await Log.info(req.user.email, "EDIT_QUOTE", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: quote
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_QUOTE", req.portal);
        console.log(error.message);

        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.approveQuote = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let quote = await QuoteService.approveQuote(req.user._id, id, data, req.portal);

        await Log.info(req.user.email, "APPROVE_QUOTES", req.portal);

        res.status(200).json({
            success: true,
            message: ["approve_successfully"],
            content: quote
        })
        
    } catch (error) {
        await Log.error(req.user.email, "APPROVE_QUOTES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["approve_failed"],
            content: error.message
        });
    }
}

exports.deleteQuote = async (req, res) => {
    try {
        let id = req.params.id;
        let quote = await QuoteService.deleteQuote(id, req.portal);

        await Log.info(req.user.email, "DELETE_QUOTES", req.portal);

        res.status(200).json({
            success: true,
            message: ["delete_successfully"],
            content: quote
        })
        
    } catch (error) {
        await Log.error(req.user.email, "DELETE_QUOTES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["delete_failed"],
            content: error.message
        });
    }
}

exports.getQuotesToMakeOrder = async (req, res) => {
    try {
        let quotes = await QuoteService.getQuotesToMakeOrder(req.portal);

        await Log.info(req.user.email, "GET_QUOTES_TO_MAKE_ORDER", req.portal);

        res.status(200).json({
            success: true,
            message: ["get_quotes_to_make_order_successfully"],
            content: quotes
        })
        
    } catch (error) {
        await Log.error(req.user.email, "GET_QUOTES_TO_MAKE_ORDER", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_quotes_to_make_order_failed"],
            content: error.message
        });
    }
}
