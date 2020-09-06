const PlanSevice = require('./plan.service');
const { LogInfo, LogError } = require('../../logs');

// Thêm mới một kế hoạch
exports.createPlan = async (req, res) => {
    try {
        const newPlan = await PlanSevice.createPlan(req.body);

        await LogInfo(req.user.email, "CREATED_NEW_PLAN", req.user.company);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newPlan
        });
    } catch (error) {
        await LogError(req.user.email, "CREATED_NEW_PLAN", req.user.company);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra tất cả các kế hoạch

exports.getPlans = async (req, res) => {
    try {
        let { page, limit, code, planName } = req.query;
        let data;
        let params;
        if (page === undefined || limit === undefined) {
            params = {
                code: code,
                planName: planName,
                page: 0,
                limit: 10
            }
            data = await PlanSevice.getPlans(params);
        } else {
            params = {
                code: code,
                planName: planName,
                page: Number(page),
                limit: Number(limit)
            }
            data = await PlanSevice.getPlans(params);
        }

        await LogInfo(req.user.email, "GET_ALL_PLANS", req.user.company);

        res.status(200).json({
            success: true,
            messages: ["get_all_plans_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, "GET_ALL_PLANS", req.user.company);

        res.status(400).json({
            success: false,
            messages: ["get_all_plans_fail"],
            content: error.message
        })
    }
}

//  Lấy ra kế hoạc theo id
exports.getPlanById = async (req, res) => {
    try {
        let { id } = req.params;
        let plan = await PlanSevice.getPlanById(id);
        if (plan !== -1) {
            await LogInfo(req.user.email, "GET_PLAN_BY_ID", req.user.company);
            res.status(200).json({
                success: true,
                messages: ["get_plan_by_id_success"],
                content: plan
            })
        } else {
            throw Error("plan is invalid")
        }
    } catch (error) {
        await LogError(req.user.email, "GET_PLAN_BY_ID", req.user.company);

        res.status(400).json({
            success: false,
            messages: ["get_plan_by_id_fail"],
            content: error.message
        })
    }
}

// Sửa kế hoạch
exports.editPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedPlan = await PlanSevice.editPlan(id, data);
        if (updatedPlan !== -1) {
            await LogInfo(req.user.email, "UPDATED_PLAN", req.user.company);

            res.status(200).json({
                success: true,
                messages: ["edit_plan_success"],
                content: updatedPlan
            })
        } else {
            throw Error("Plan is invalid");
        }

    } catch (error) {
        await LogError(req.user.email, "UPDATED_PLAN", req.user.company);

        res.status(400).json({
            success: false,
            messages: ["edit_plan_fail"],
            content: error.message
        })
    }
}

// Xóa kế hoạch
exports.deletePlan = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedPlan = await PlanSevice.deletePlan(id);
        if (deletedPlan) {
            LogInfo(req.user.email, "DELETED_PLAN", req.user.company);

            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedPlan
            })
        } else {
            throw Error("Plan is invalid");
        }
    } catch (error) {
        await LogError(req.user.email, "DELETED_PLAN", req.user.company);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        })
    }
}
