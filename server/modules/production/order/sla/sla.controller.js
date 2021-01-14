const SLAServices = require('./sla.service');
const Log = require(`../../../../logs`);

exports.createNewSLA = async (req, res) => {
    try {
        let data = req.body;
        let sla = await SLAServices.createNewSLA(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_SLA", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: sla
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_SLA", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editSLAByCode = async (req, res) => {
    try {
        let id = req.params.id;
        data = req.body;
        let sla = await SLAServices.editSLAByCode(req.user._id, id, data, req.portal);

        await Log.info(req.user.email, "EDIT_SLA", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: sla
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_SLA", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllSLAs = async ( req, res ) => {
    try {
        let query = req.query;
        let allSLAs = await SLAServices.getAllSLAs( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_SLAS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allSLAs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_SLAS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getSLAById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let sla = await SLAServices.getSLAById( id, req.portal)

        await Log.info(req.user.email, "GET_SLA_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_by_id_successfully"],
            content: sla
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SLA_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_by_id_failed"],
            content: error.message
        });
    }
}

exports.disableSLAById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let sla = await SLAServices.disableSLAById( id, req.portal)
        
        await Log.info(req.user.email, "DISABLE_SLA_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["disable_successfully"],
            content: sla
        });
    } catch (error) {
        await Log.error(req.user.email, "DISABLE_SLA_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["disable_failed"],
            content: error.message
        });
    }
}

exports.checkAvailabledCode = async ( req, res ) => {
    console.log(req.query);
    let query = req.query;
    try {
        let checked = await SLAServices.checkAvailabledCode( query, req.portal );

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


exports.getSLAByCode = async ( req, res ) => {
    let query = req.query;
    try {
        let slas = await SLAServices.getSLAByCode( query, req.portal );

        await Log.info(req.user.email, "GET_SLA_BY_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_by_code_successfully"],
            content: slas
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SLA_BY_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_by_code_get_failed"],
            content: error.message
        });
    }        
}

exports.deleteSLA = async ( req, res ) => {
    try {
        let code = req.query.code;
        let slas = await SLAServices.deleteSLA(code, req.portal)
        
        await Log.info(req.user.email, "DELETE_SERVICE_LEVEL_AGREEMENT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_successfully"],
            content: slas
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_SERVICE_LEVEL_AGREEMENT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["delete_failed"],
            content: error.message
        });
    }
}

exports.getSlaByGoodsId = async (req, res) => {
    try {
        let goodId = req.query.goodId;
        let slas = await SLAServices.getSlaByGoodsId(goodId, req.portal)
        
        await Log.info(req.user.email, "GET_SLA_BY_GOOD_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_by_good_successfully"],
            content: slas
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SLA_BY_GOOD_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_by_good_failed"],
            content: error.message
        });
    }
}