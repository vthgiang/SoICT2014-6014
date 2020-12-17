const BusinessDepartmentService = require('./buninessDepartment.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createBusinessDepartment = async (req, res) => {
    try {
        let data = req.body;
        let businessDepartment = await BusinessDepartmentService.createBusinessDepartment(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_BUSINESS_DEPARTMENT", req.portal);


        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: businessDepartment
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_BUSINESS_DEPARTMENT", req.portal);

        console.log("Error", error);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editBusinessDepartment = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;
        let businessDepartment = await BusinessDepartmentService.editBusinessDepartment( id, data, req.portal)

        await Log.info(req.user.email, "EDIT_BUSINESS_DEPARTMENT", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: businessDepartment
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_BUSINESS_DEPARTMENT", req.portal);
        console.log(error.message);

        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllBusinessDepartments = async (req, res) => {
    try {
        let query = req.query;
        let allbusinessDepartments = await BusinessDepartmentService.getAllBusinessDepartments(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_BUSINESS_DEPARTMENT", req.portal);

        res.status(200).json({
            success: true,
            message: ["get_successfully"],
            content: allbusinessDepartments
        })
        
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_BUSINESS_DEPARTMENT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}
