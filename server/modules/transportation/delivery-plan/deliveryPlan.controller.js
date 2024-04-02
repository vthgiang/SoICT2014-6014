const DeliveryPlanService = require('./deliveryPlan.service');
const Log = require(`../../../logs`);

// Thêm mới một ví dụ
exports.createDeliveryPlan = async (req, res) => {
    try {
        const newDeliveryPlan = await DeliveryPlanService.createDeliveryPlan(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_DELIVERY_PLAN', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newDeliveryPlan
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_DELIVERY_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getDeliveryPlans = async (req, res) => {
    try {
        data = await DeliveryPlanService.getDeliveryPlans(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_deliveryPlans_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_deliveryPlans_fail"],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getDeliveryPlanById = async (req, res) => {
    try {
        let { id } = req.params;
        let deliveryPlan = await DeliveryPlanService.getDeliveryPlanById(req.portal, id);
        if (deliveryPlan !== -1) {
            await Log.info(req.user.email, "GET_DELIVERY_PLAN_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_deliveryPlan_by_id_success"],
                content: deliveryPlan
            });
        } else {
            throw Error("deliveryPlan is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_DELIVERY_PLAN_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_deliveryPlan_by_id_fail"],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editDeliveryPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedDeliveryPlan = await DeliveryPlanService.editDeliveryPlan(req.portal, id, data);
        if (updatedDeliveryPlan !== -1) {
            await Log.info(req.user.email, "UPDATED_DELIVERY_PLAN", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_deliveryPlan_success"],
                content: updatedDeliveryPlan
            });
        } else {
            throw Error("DeliveryPlan is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_DELIVERY_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_deliveryPlan_fail"],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteDeliveryPlans = async (req, res) => {
    try {
        let deletedDeliveryPlan = await DeliveryPlanService.deleteDeliveryPlans(req.portal, req.body.deliveryPlanIds);
        if (deletedDeliveryPlan) {
            await Log.info(req.user.email, "DELETED_DELIVERY_PLAN", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedDeliveryPlan
            });
        } else {
            throw Error("DeliveryPlan is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_DELIVERY_PLAN", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyDeliveryPlanName = async (req, res) => {
    try {
        let data;
        data = await DeliveryPlanService.getOnlyDeliveryPlanName(req.portal, req.query);

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_DELIVERY_PLANS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_deliveryPlans_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_DELIVERY_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_deliveryPlans_fail"],
            content: error.message
        });
    }
}

// get all journey data of all delivery plan

exports.getAllJourneys = async (req, res) => {
    try {
        data = await DeliveryPlanService.getAllJourneys(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_deliveryPlans_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_deliveryPlans_fail"],
            content: error.message
        });
    }
}