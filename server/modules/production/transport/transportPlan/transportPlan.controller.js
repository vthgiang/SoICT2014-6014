const TransportPlanService = require('./transportPlan.service');
const Log = require(`../../../../logs`);

// Thêm mới một ví dụ
exports.createTransportPlan = async (req, res) => {
    try {
        const newTransportPlan = await TransportPlanService.createTransportPlan(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_TRANSPORT_PLAN', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newTransportPlan
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_TRANSPORT_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

//  Lấy ra Ví dụ theo id
exports.getPlanById = async (req, res) => {
    try {
        let { id } = req.params;
        let transportPlan = await TransportPlanService.getPlanById(req.portal, id);
        if (transportPlan !== -1) {
            await Log.info(req.user.email, "GET_PLAN_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_plan_by_id_success"],
                content: transportPlan
            });
        } else {
            throw Error("plan is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_PLAN_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_plan_by_id_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getAllTransportPlans = async (req, res) => {
    try {
        let data;
        data = await TransportPlanService.getAllTransportPlans(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_TRANSPORT_PLANS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TRANSPORT_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["fail"],
            content: error.message
        });
    }
}

exports.editTransportPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedTransportPlan = await TransportPlanService.editTransportPlan(req.portal, id, data);
        if (updatedTransportPlan !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_PLAN", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_success"],
                content: updatedTransportPlan
            });
        } else {
            throw Error("TransportPlan is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_fail"],
            content: error.message
        });
    }
}

exports.addTransportRequirementToPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedTransportPlan = await TransportPlanService.addTransportRequirementToPlan(req.portal, id, data);
        if (updatedTransportPlan !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_PLAN_ADD", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_plan_success"],
                content: updatedTransportPlan
            });
        } else {
            throw Error("TransportPlan is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_PLAN_ADD", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_plan_fail"],
            content: error.message
        });
    }
}

exports.addTransportVehicleToPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedTransportPlan = await TransportPlanService.addTransportVehicleToPlan(req.portal, id, data);
        if (updatedTransportPlan !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_PLAN_ADD", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_plan_success"],
                content: updatedTransportPlan
            });
        } else {
            throw Error("TransportPlan is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_PLAN_ADD", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_plan_fail"],
            content: error.message
        });
    }
}

exports.deleteTransportPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let deleteTransportPlan = await TransportPlanService.deleteTransportPlan(req.portal, id);
        if (deleteTransportPlan) {
            await Log.info(req.user.email, "DELETED_TRANSPORT_PLAN", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deleteTransportPlan
            });
        } else {
            throw Error("TransportPlan is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_TRANSPORT_PLAN", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}
