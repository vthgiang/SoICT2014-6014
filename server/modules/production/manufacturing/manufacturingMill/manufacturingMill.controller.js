const Logger = require(`${SERVER_LOGS_DIR}`);
const ManufacturingMillService = require('./manufacturingMill.service');

exports.createManufacturingMill = async (req, res) => {
    try {
        let newManufacturingMill = await ManufacturingMillService.createManufacturingMill(req.body, req.portal);

        await Logger.info(req.user.email, "CREATE_NEW_MANUFACTURING_MILL", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_manufacturing_mill_successfully"],
            content: newManufacturingMill
        });
    } catch (error) {
        await Logger.error(req.user.email, "CREATE_NEW_MANUFACTURING_MILL", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_manufacturing_mill_failed"],
            content: error.message
        })
    }
}

exports.createWorkSchedule = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body
        let manufacturingMill = await ManufacturingMillService.createWorkSchedule(id, data, req.portal);

        if (manufacturingMill !== -1) {
            res.status(201).json({
                success: true,
                messages: ["create_work_schedule_successfully"],
                content: manufacturingMill
            })
        } else {
            throw Error("manufacturing mill is not exist");
        }

    } catch (error) {
        await Logger.error(req.user.email, "CREATE_WORK_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_work_schedule_failed"],
            content: error.message
        })
    }
}

exports.addCommandToSchedule = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let manufacturingMill = await ManufacturingMillService.addCommandToSchedule(id, data, req.portal);

        if (manufacturingMill !== -1) {
            res.status(201).json({
                success: true,
                messages: ["add_command_to_schedule_successfully"],
                content: manufacturingMill
            });
        } else {
            throw Error("manufacturing mill is not exist");
        }
    } catch (error) {
        await Logger.error(req.user.email, "ADD_COMMAND_TO_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_command_to_schedule_failed"],
            content: error.message
        })
    }
}