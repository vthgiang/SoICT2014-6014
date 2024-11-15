const ManufacturingCommandServices = require('./manufacturingCommand.service');
const Logger = require(`../../../../logs`);

exports.createManufacturingCommand = async (req, res) => {
    try {
        let data = req.body;
        let manufacturingCommand = await ManufacturingCommandServices.createManufacturingCommand(data, req.portal);

        await Logger.info(req.user.email, "CREATE_MANUFACTURING_COMMAND", req.portal);
        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: manufacturingCommand
        })

    } catch (error) {
        await Logger.error(req.user.email, "CREATE_MANUFACTURING_COMMAND", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        })
    }
}

exports.getAllManufacturingCommands = async (req, res) => {
    try {
        let query = req.query;
        let manufacturingCommands = await ManufacturingCommandServices.getAllManufacturingCommands(query, req.user, req.portal);

        await Logger.info(req.user.email, "GET_ALL_MANUFACTURING_COMMANDS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: manufacturingCommands
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_COMMANDS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        })
    }
}

exports.getManufacturingCommandById = async (req, res) => {
    try {
        let id = req.params.id
        let manufacturingCommand = await ManufacturingCommandServices.getManufacturingCommandById(id, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_COMMAND_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_by_id_successfully"],
            content: manufacturingCommand
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_COMMAND_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_by_id_failed"],
            content: error.message
        })
    }
}

exports.editManufaturingCommand = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let manufacturingCommand = await ManufacturingCommandServices.editManufaturingCommand(id, data, req.portal);

        await Logger.info(req.user.email, "EDIT_MANUFACTURING_COMMAND", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: manufacturingCommand
        })
    } catch (error) {
        await Logger.error(req.user.email, "EDIT_MANUFACTURING_COMMAND", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        })
    }
}

exports.getNumberCommands = async (req, res) => {
    try {
        const data = req.query;
        let commandNumber = await ManufacturingCommandServices.getNumberCommands(data, req.portal);

        await Logger.info(req.user.email, "GET_NUMBER_COMMAND", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_number_successfully"],
            content: commandNumber
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_NUMBER_COMMAND", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_number_failed"],
            content: error.message
        })
    }
}

exports.getNumberCommandsStatus = async (req, res) => {
    try {
        const data = req.query;
        let commandNumberStatus = await ManufacturingCommandServices.getNumberCommandsStatus(data, req.portal);

        await Logger.info(req.user.email, "GET_NUMBER_COMMAND_STATUS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_number_status_successfully"],
            content: commandNumberStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_NUMBER_COMMAND_STATUS", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_number_status_failed"],
            content: error.message
        })
    }
}

exports.getTopTenProduct = async (req, res) => {
    try {
        const data = req.query;
        let topTenProduct = await ManufacturingCommandServices.getTopTenProduct(data, req.portal);

        await Logger.info(req.user.email, "GET_TOP_TEN_PRODUCT", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_top_ten_successfully"],
            content: topTenProduct
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_TOP_TEN_PRODUCT", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_top_ten_failed"],
            content: error.message
        })
    }
}

exports.getFluctuatingProduct = async (req, res) => {
    try {
        const data = req.query;
        let fluctuatingProduct = await ManufacturingCommandServices.getFluctuatingProduct(data, req.portal);

        await Logger.info(req.user.email, "GET_FLUCTUATING_PRODUCT", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_fluctuating_successfully"],
            content: fluctuatingProduct
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_FLUCTUATING_PRODUCT", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_fluctuating_failed"],
            content: error.message
        })
    }
}
