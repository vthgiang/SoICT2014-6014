const TransportDepartment = require('./transportDepartment.service');
const Log = require(`../../../../logs`);

// Thêm mới một ví dụ
exports.createTransportDepartment = async (req, res) => {
    try {
        const newTransportDepartment = await TransportDepartment.createTransportDepartment(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_TRANSPORT_DEPARTMENT', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newTransportDepartment
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_TRANSPORT_DEPARTMENT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

exports.getAllTransportDepartments = async (req, res) => {
    try {
        let data;
        data = await TransportDepartment.getAllTransportDepartments(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_TRANSPORT_DEPARTMENTS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TRANSPORT_DEPARTMENTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["fail"],
            content: error.message
        });
    }
}

exports.getUserByRole = async (req, res) => {
    try {
        let data;
        data = await TransportDepartment.getUserByRole(req.portal, req.query);

        await Log.info(req.user.email, "GET_USER_BY_ROLE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_USER_BY_ROLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["fail"],
            content: error.message
        });
    }
}
