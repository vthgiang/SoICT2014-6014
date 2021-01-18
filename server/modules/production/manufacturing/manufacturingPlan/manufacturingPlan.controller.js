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
        console.log(error.message);
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

exports.getManufacturingPlanById = async (req, res) => {
    try {
        const id = req.params.id;
        const manufacturingPlan = await ManufacturingPlanService.getManufacturingPlanById(id, req.portal);

        await Logger.info(req.user.email, "GET_PLAN_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_detail_plan_successfully'],
            content: manufacturingPlan
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_PLAN_BY_ID", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ['get_detail_plan_failed'],
            content: error.message
        })
    }
}

exports.editManufacturingPlan = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;
        const manufacturingPlan = await ManufacturingPlanService.editManufacturingPlan(id, data, req.portal);

        await Logger.info(req.user.email, "EDIT_MANUFACTURING_PLAN", req.portal);

        res.status(200).json({
            success: true,
            messages: ['edit_successfully'],
            content: manufacturingPlan
        })
    } catch (error) {
        await Logger.error(req.user.email, "EDIT_MANUFACTURING_PLAN", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ['edit_failed'],
            content: error.message
        })
    }
}

exports.getNumberPlans = async (req, res) => {
    try {
        let data = req.query;
        let planNumber = await ManufacturingPlanService.getNumberPlans(data, req.portal);
        await Logger.info(req.user.email, "GET_NUMBER_PLANS", req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_number_successfully'],
            content: planNumber
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_NUMBER_PLANS", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ['get_number_failed'],
            content: error.message
        })
    }
}

exports.getNumberPlansByStatus = async (req, res) => {
    try {
        let data = req.query;
        let planNumberStatus = await ManufacturingPlanService.getNumberPlansByStatus(data, req.portal);
        await Logger.info(req.user.email, "GET_NUMBER_PLANS_BY_STATUS", req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_number_status_successfully'],
            content: planNumberStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_NUMBER_PLANS_BY_STATUS", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ['get_number_status_failed'],
            content: error.message
        })
    }
}