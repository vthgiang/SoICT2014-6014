const Logger = require(`${SERVER_LOGS_DIR}`);
const ManufacturingPlanService = require('./manufacturingPlan.service');

exports.createManufacturingPlan = async (req, res) => {
    try {
        let data = req.body;
        let manufacturingPlan = await ManufacturingPlanService.createManufacturingPlan(data, req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: manufacturingPlan
        })

    } catch (error) {
        await Logger.error(req.user.email, "CREATE_MANUFACTURING_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}