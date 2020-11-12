const ManufacturingCommandServices = require('./manufacturingCommand.service');

const Logger = require(`${SERVER_LOGS_DIR}`);

exports.createManufacturingCommand = async (req, res) => {
    try {
        let data = req.body;
        let manufacturingCommand = await ManufacturingCommandServices.createManufacturingCommand(data, req.portal);
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