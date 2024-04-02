const ProductionLineTemplateService = require('./productionLineTemplate.service')
const Log = require(`../../../logs`);

exports.getProductionLineTemplateById = async (req, res) => {
    try {
        let {id} = req.params;
        let productionTemplate = await ProductionLineTemplateService.getProductionLineTemplateById(id, req.portal);
        if(productionTemplate !== -1) {
            await Log.info(req.user.email, "GET_PRODUCTION_TEMPLATE_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                message: ["get_production_line_template_is_success"],
                content: productionTemplate
            });
        } else {
            throw Error("production line is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_PRODUCTION_TEMPLATE_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            message: ["get_production_line_template_is_fail"],
            content: error.message
        });
    }
}

exports.getAllProductionLineTemplate = async (req, res) => {
    try {
        let {page, perPage, processName} = req.query;
        let data;
        let params;
        if(page === undefined || perPage === undefined) {
            params = {
                processName: processName,
                page: 0,
                perPage: 10
            }
            data = await ProductionLineTemplateService.getAllProductionLineTemplate(params, req.portal)
        } else {
            params = {
                processName: processName,
                page: Number(page),
                perPage: Number(perPage)
            }
            data = await ProductionLineTemplateService.getAllProductionLineTemplate(params, req.portal)
        }

        await Log.info(req.user.email, "GET_ALL_PRODUCTION_LINE_TEMPLATE_SUCCESS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_production_line_template_success"],
            content: data,
        });
    } catch(error) {
        await Log.info(req.user.email, "GET_ALL_PRODUCTION_LINE_TEMPLATE_FAILURE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_production_line_template_fail"],
            content: error.message,
        });
    }
}

exports.createProductionLineTemplate = async (req, res) => {
    try {
        const newChainTemplate = await ProductionLineTemplateService.createProductionLineTemplate(req.body, req.portal);

        await Log.info(req.user.email, "CREATE_PRODUCTION_LINE_TEMPLATE_SUCCESS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_production_line_success"],
            content: newChainTemplate
        });
    } catch(error) {
        await Log.error(req.user.email, "CREATE_PRODUCTION_LINE_TEMPLATE_SUCCESS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_production_line_failure"],
            content: error.message
        })
    }
}

exports.editProductionLineTemplate = async (req, res) => {
    try {
        let {id} = req.params;
        let data = req.body;
        let updatedProductionLineTemplate = await ProductionLineTemplateService.editProductionLineTemplate(id, data, req.portal);

        if(updatedProductionLineTemplate !== -1) {
            await Log.info(req.user.email, "UPDATED_TEMPLATE", req.portal);
            res.status(200).json({
                success: true,
                message: ["edit_production_line_template_success"],
                content: updatedProductionLineTemplate
            });
        } else {
            throw Error("Cotroller production line update fail");
        }
    } catch(error) {
        await Log.error(req.user.email, "UPDATED_TEMPLATE", req.portal);

        res.status(400).json({
            success: false,
            message: ["edit_production_line_template_fail"],
            content: error.message
        });
    }
}

exports.deleteProductionLineTemplate = async (req, res) => {
    try {
        let {id} = req.params;
        let removedProductionLineTemplate = await ProductionLineTemplateService.deleteProductionLineTemplate(id, req.portal);

        if(removedProductionLineTemplate) {
            await Log.info(req.user.email, "REMOVED_TEMPLATE", req.portal);
            res.status(200).json({
                success: true,
                message: ["delete_production_line_template_success"],
                content: removedProductionLineTemplate
            });
        } else {
            throw Error("Cotroller production line delete fail");
        }
    } catch(error) {
        await Log.error(req.user.email, "REMOVED_TEMPLATE", req.portal);

        res.status(400).json({
            success: false,
            message: ["delete_production_line_template_fail"],
            content: error.message
        });
    }
}