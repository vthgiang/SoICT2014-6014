const Logger = require(`../../../../logs`);
const ManufacturingPlanService = require('./manufacturingPlan.service');

exports.createManufacturingPlan = async (req, res) => {
    try {
        let data = req.body;
        let manufacturingPlan = await ManufacturingPlanService.createManufacturingPlan(data, req.portal);

        await Logger.info(req.user.email, "CREATE_MANUFACTURING_PLAN", req.portal);

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

exports.getAllManufacturingPlans = async (req, res) => {
    try {
        let query = req.query;

        let manufacturingPlans = await ManufacturingPlanService.getAllManufacturingPlans(query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_PLANS", req.portal);

        res.status(200).json({
            success: true,
            messages: "get_plans_successfully",
            content: manufacturingPlans
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_plans_failed"],
            content: error.message
        })
    }
}

exports.getApproversOfPlan = async (req, res) => {
    try {
        const currentRole = req.params.id;
        let users = await ManufacturingPlanService.getApproversOfPlan(req.portal, currentRole);

        await Logger.info(req.user.email, "GET_APPROVERS_OF_PLAN", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_approvers_successfully"],
            content: users
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_APPROVERS_OF_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_approvers_failed"],
            content: error.message
        })
    }
}