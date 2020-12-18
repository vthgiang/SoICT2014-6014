const AdminDepartmentService = require('./adminDepartment.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createAdminDepartment = async (req, res) => {
    try {
        let data = req.body;
        let adminDepartment = await AdminDepartmentService.createAdminDepartment(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_ADMIN_DEPARTMENT", req.portal);


        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: adminDepartment
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_ADMIN_DEPARTMENT", req.portal);

        console.log("Error", error);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editAdminDepartment = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;
        let adminDepartment = await AdminDepartmentService.editAdminDepartment( id, data, req.portal)

        await Log.info(req.user.email, "EDIT_ADMIN_DEPARTMENT", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: adminDepartment
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_ADMIN_DEPARTMENT", req.portal);
        console.log(error.message);

        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllAdminDepartments = async (req, res) => {
    try {
        let query = req.query;
        let allAdminDepartments = await AdminDepartmentService.getAllAdminDepartments(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_ADMIN_DEPARTMENTS", req.portal);

        res.status(200).json({
            success: true,
            message: ["get_successfully"],
            content: allAdminDepartments
        })
        
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_ADMIN_DEPARTMENTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}
