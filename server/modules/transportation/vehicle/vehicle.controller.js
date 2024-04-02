const VehicleService = require('./vehicle.service');
const Log = require(`../../../logs`);

// Thêm mới một ví dụ
exports.createVehicle = async (req, res) => {
    try {
        const newVehicle = await VehicleService.createVehicle(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_VEHICLE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newVehicle
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

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getVehicles = async (req, res) => {
    try {
        let data = await VehicleService.getVehicles(req.portal, req.query);
        await Log.info(req.user.email, "GET_ALL_VEHICLES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_vehicles_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_VEHICLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_vehicles_fail"],
            content: error.message
        });
    }
}

exports.getAllVehicleWithCondition =  async (req, res) => {
    try {
        let data = await VehicleService.getAllVehicleWithCondition(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_VEHICLES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_vehicles_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_VEHICLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_vehicles_fail"],
            content: error.message
        });
    }
}

exports.getAllFreeVehicleSchedule =  async (req, res) => {
    try {
        let data = await VehicleService.getAllFreeVehicleSchedule(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_FREE_VEHICLE_SCHEDULE", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_vehicles_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_FREE_VEHICLE_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_vehicles_fail"],
            content: error.message
        });
    }
}

//  Lấy ra xe theo id
exports.getVehicleById = async (req, res) => {
    try {
        let { id } = req.params;
        let vehicle = await VehicleService.getVehicleById(req.portal, id);
        if (vehicle !== -1) {
            await Log.info(req.user.email, "GET_VEHICLE_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_vehicle_by_id_success"],
                content: vehicle
            });
        } else {
            throw Error("vehicle is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_VEHICLE_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_vehicle_by_id_fail"],
            content: error.message
        });
    }
}

// Sửa thông tin xe
exports.editVehicle = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedVehicle = await VehicleService.editVehicle(req.portal, id, data);
        if (updatedVehicle !== -1) {
            await Log.info(req.user.email, "UPDATED_VEHICLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_vehicle_success"],
                content: updatedVehicle
            });
        } else {
            throw Error("Vehicle is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_VEHICLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_vehicle_fail"],
            content: error.message
        });
    }
}

// Xóa xe
exports.deleteVehicles = async (req, res) => {
    try {
        let deletedVehicle = await VehicleService.deleteVehicles(req.portal, req.body.vehicleIds);
        if (deletedVehicle) {
            await Log.info(req.user.email, "DELETED_VEHICLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedVehicle
            });
        } else {
            throw Error("Vehicle is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_VEHICLE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các xe
exports.getOnlyVehicleName = async (req, res) => {
    try {
        let data;
        data = await VehicleService.getOnlyVehicleName(req.portal, req.query);

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_VEHICLES", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_vehicles_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_VEHICLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_vehicles_fail"],
            content: error.message
        });
    }
}

// Lấy ra danh sách tất cả xe cùng với danh sách đề mục chi phí hoạt động ứng với xe đó để tính toán chi phí xe

exports.getAllVehicleWithCostList = async (req, res) => {
    try {
        let data = await VehicleService.getAllVehicleWithCostList(req.portal, req.query);

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_VEHICLES", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_vehicles_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_VEHICLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_vehicles_fail"],
            content: error.message
        });
    }
}

// Update thông tin chi phí vận hành tất cả các xe
exports.calculateVehiclesCost = async (req, res) => {
    try {
        let data = req.body;
        let updatedVehicle = await VehicleService.calculateVehiclesCost(req.portal, data);
        if (updatedVehicle !== -1) {
            await Log.info(req.user.email, "UPDATED_VEHICLE_COST", req.portal);
            res.status(200).json({
                success: true,
                messages: ["update_vehicle_cost_success"],
                content: updatedVehicle
            });
        } else {
            throw Error("Vehicle cost is invalid");
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