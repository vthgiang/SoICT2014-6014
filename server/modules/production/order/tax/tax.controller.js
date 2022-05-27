const TaxService = require('./tax.service');
const Log = require(`../../../../logs`);

exports.createNewTax = async (req, res) => {
    try {
        let data = req.body;
        let tax = await TaxService.createNewTax(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_TAX", req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_successfully"],
            content: tax
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_TAX", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_failed"],
            content: error.message
        });
    }
}

exports.editTaxByCode = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let tax = await TaxService.editTaxByCode(req.user._id, id, data, req.portal);

        await Log.info(req.user.email, "EDIT_TAX", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: tax
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_TAX", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllTaxs = async ( req, res ) => {
    try {
        let query = req.query;
        let allTaxs = await TaxService.getAllTaxs( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_TAXS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allTaxs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TAXS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getTaxById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let tax = await TaxService.getTaxById( id, req.portal)

        await Log.info(req.user.email, "GET_TAX_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: tax
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TAX_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}

exports.disableTaxById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let tax = await TaxService.disableTaxById(id, req.portal)
        
        await Log.info(req.user.email, "DISABLE_TAX_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["disable_successfully"],
            content: tax
        });
    } catch (error) {
        await Log.error(req.user.email, "DISABLE_TAX_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["disable_failed"],
            content: error.message
        });
    }
}

exports.checkAvailabledCode = async ( req, res ) => {
    let query = req.query;
    try {
        let checked = await TaxService.checkAvailabledCode( query, req.portal );

        await Log.info(req.user.email, "CHECK_AVAILABLED_TAX_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["check_successfully"],
            content: { checked }
        });
    } catch (error) {
        await Log.error(req.user.email, "CHECK_AVAILABLED_TAX_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["check_failed"],
            content: error.message
        });
    } 
        
}


exports.getTaxByCode = async ( req, res ) => {
    let query = req.query;
    try {
        let taxs = await TaxService.getTaxByCode( query, req.portal );

        await Log.info(req.user.email, "GET_TAX_BY_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: taxs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TAX_BY_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    } 
        
}

exports.deleteTaxByCode = async ( req, res ) => {
    try {
        let code = req.query.code;
        let taxs = await TaxService.deleteTaxByCode(code, req.portal)
        
        await Log.info(req.user.email, "DELETE_TAX_BY_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_successfully"],
            content: taxs
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_TAX_BY_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["delete_failed"],
            content: error.message
        });
    }
}

exports.getTaxsByGoodsId = async (req, res) => {
    try {
        let goodId = req.query.goodId;
        let taxs = await TaxService.getTaxsByGoodsId(goodId, req.portal)
        
        await Log.info(req.user.email, "GET_TAX_BY_GOOD_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: taxs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TAX_BY_GOOD_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}