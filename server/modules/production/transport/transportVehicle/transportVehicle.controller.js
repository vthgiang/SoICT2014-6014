const TransportVehicleServices = require('./transportVehicle.service');
const Log = require(`../../../../logs`);

// Thêm mới một ví dụ
exports.createTransportVehicle = async (req, res) => {
    try {
        const newTransportVehicle = await TransportVehicleServices.createTransportVehicle(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_VEHICLE_REQUIREMENT', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newTransportVehicle
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_VEHICLE_REQUIREMENT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

exports.getAllTransportVehicles = async (req, res) => {
    try {
        let data;
        data = await TransportVehicleServices.getAllTransportVehicles(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_TRANSPORT_VEHICLES", req.portal);
        res.status(200).json({
            success: true,
            messages: ["success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TRANSPORT_VEHICLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["fail"],
            content: error.message
        });
    }
}

exports.editTransportVehicleToSetPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        const newTransportVehicle = await TransportVehicleServices.editTransportVehicleToSetPlan(req.portal, id, data);

        await Log.info(req.user.email, 'EDIT_TRANSPORT_PLAN_OF_VEHICLE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["edit_success"],
            content: newTransportVehicle
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_TRANSPORT_PLAN_OF_VEHICLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_fail"],
            content: error.message
        })
    }
}

exports.editTransportVehicle = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedTransportVehicle = await TransportVehicleServices.editTransportVehicle(req.portal, id, data);
        if (updatedTransportVehicle !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_VEHICLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_success"],
                content: updatedTransportVehicle
            });
        } else {
            throw Error("TransportVehicle is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_VEHICLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_fail"],
            content: error.message
        });
    }
}