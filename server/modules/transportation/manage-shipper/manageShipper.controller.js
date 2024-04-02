const ShipperService = require('./manageShipper.service');
const Log = require(`../../../logs`);

// Thêm mới một ví dụ
exports.createShipper =  async (req, res) => {
    try {
        let data = await ShipperService.createShipper(req.body, req.portal);

        await Log.info(req.user.email, "CREATE_SHIPPER", req.portal);

        res.status(200).json({
            success: true,
            messages: ["create_shipper_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "CREATE_SHIPPER", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_shipper_fail"],
            content: error.message
        });
    }
}

exports.getAllShipperWithCondition =  async (req, res) => {
    try {
        let data = await ShipperService.getAllShipperWithCondition(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_SHIPPER", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_shipper_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_SHIPPER", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_shipper_fail"],
            content: error.message
        });
    }
}

exports.getAllShipperSalaryByCondition =  async (req, res) => {
    try {
        let data = await ShipperService.getAllShipperSalaryByCondition(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_SHIPPER_ SALARY", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_shipper_salary_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_SHIPPER_SALARY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_shipper_salary_fail"],
            content: error.message
        });
    }
}

exports.calculateShipperSalary =  async (req, res) => {
    try {
        let data = await ShipperService.calculateShipperSalary(req.query, req.portal);

        await Log.info(req.user.email, "CALCULATE_SHIPPER_SALARY", req.portal);

        res.status(200).json({
            success: true,
            messages: ["calculate_shipper_salary_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "CALCULATE_SHIPPE_SALARYR", req.portal);

        res.status(400).json({
            success: false,
            messages: ["calculate_shipper_salary_fail"],
            content: error.message
        });
    }
}

exports.saveSalary =  async (req, res) => {
    try {
        let data = await ShipperService.saveSalary(req.body, req.portal);

        await Log.info(req.user.email, "SAVE_SHIPPER_SALARY", req.portal);

        res.status(200).json({
            success: true,
            messages: ["save_shipper_salary"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "SAVE_SHIPPER_SALARY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["save_shipper_salary"],
            content: error.message
        });
    }
}

exports.getDriverNotConfirm =  async (req, res) => {
    try {
        let data = await ShipperService.getDriverNotConfirm(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_SHIPPER_NOT_CONFIRM", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_shipper_not_confirm_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_SHIPPER_NOT_CONFIRM", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_shipper_not_confirm_fail"],
            content: error.message
        });
    }
}

exports.editDriverInfo = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updateDriver = await ShipperService.editDriverInfo(id, data, req.portal);
        await Log.info(req.user.email, "EDIT _SHIPPER", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_shipper_success"],
            content: updateDriver
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "EDIT_SHIPPER", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_shipper_fail"],
            content: error.message
        });
    }
}

exports.getAllFreeShipperSchedule =  async (req, res) => {
    try {
        let data = await ShipperService.getAllFreeShipperSchedule(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_FREE_SHIPPER_SCHEDULE", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_shipper_schedules_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_FREE_SHIPPER_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_shipper_schedules_fail"],
            content: error.message
        });
    }
}

exports.getAllShipperAvailableForJourney =  async (req, res) => {
    try {
        let data = await ShipperService.getAllShipperAvailableForJourney(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_FREE_SHIPPER_FOR_JOURNEY", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_shipper_available_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_FREE_SHIPPER_FOR_JOURNEY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_shipper_available_fail"],
            content: error.message
        });
    }
}