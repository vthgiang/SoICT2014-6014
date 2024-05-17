const TransportationCostService = require('./transportationCost.service');
const Log = require(`../../../logs`);

exports.testAPI = async (req, res)=>{
    let data = TransportationCostService.testAPI();
    res.status(201).json({
        success: true,
        messages: ["add_success"],
        content: data
    });
}
// Tạo mới chi phí đội xe
exports.createVehicleCost = async (req, res) => {
    try {
        const newVehicleCost = await TransportationCostService.createVehicleCost(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_VEHICLE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newVehicleCost
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_VEHICLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

exports.createShipperCost = async (req, res) => {
    try {
        const newShipperCost = await TransportationCostService.createShipperCost(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_SHIPPER_COST', req.portal);

        res.status(201).json({
            success: true,
            messages: ["edit_success"],
            content: newShipperCost
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_SHIPPER_COST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getVehicleCosts = async (req, res) => {
    try {
        let data = await TransportationCostService.getVehicleCosts(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_VEHICLE_COSTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_vehicle_cost_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_VEHICLE_COSTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_vehicle_cost_fail"],
            content: error.message
        });
    }
}


exports.getShipperCosts = async (req, res) => {
    try {
        let data = await TransportationCostService.getShipperCosts(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_SHIPPER_COSTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_vehicle_cost_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_SHIPPER_COSTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_vehicle_cost_fail"],
            content: error.message
        });
    }
}

// Lấy ra thông tin công thức tính chi phí xe
exports.getCostFormula = async (req, res) => {
    try {
        data = await TransportationCostService.getCostFormula(req.portal);
        console.log("tao la formula", data);

        await Log.info(req.user.email, "GET_VEHICLE_FORMULA", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_vehicle_formula_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_VEHICLE_FORMULA", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_vehicle_formula_fail"],
            content: error.message
        });
    }
}

// Cập nhật chi phí xe
exports.updateDependentVehicleCost = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedVehicleCost = await TransportationCostService.updateDependentVehicleCost(req.portal, id, data);
        if (updatedVehicleCost !== -1) {
            await Log.info(req.user.email, "UPDATED_VEHICLE_COST", req.portal);
            res.status(200).json({
                success: true,
                messages: ["update_vehicle_cost_success"],
                content: updatedVehicleCost
            });
        } else {
            throw Error("VehicleCost is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_VEHICLE_COST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["update_vehicle_cost_fail"],
            content: error.message
        });
    }
}

// Xóa chi phí xe
exports.deleteVehicleCost = async (req, res) => {
    try {
        let deletedVehicleCost = await TransportationCostService.deleteVehicleCost(req.portal, req.params.id);
        if (deletedVehicleCost) {
            await Log.info(req.user.email, "DELETED_VEHICLE_COST", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedVehicleCost
            });
        } else {
            throw Error("VehicleCost is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_VEHICLE_COS", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}