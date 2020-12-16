const careerPositionService = require('./careerPosition.service');
const UserService = require(`${SERVER_MODULES_DIR}/super-admin/user/user.service`);
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const EmployeeService = require('../profile/profile.service');

const {
    sendEmail
} = require(`${SERVER_HELPERS_DIR}/emailHelper`);

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách vị trí công việc */
exports.searchCareerPosition = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerPosition(req.portal, params);

        await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_position_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Lấy danh sách vị trí công việc */
exports.searchCareerAction = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerAction(req.portal, params);

        await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_CAREER_ACTION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_position_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Lấy danh sách vị trí công việc */
exports.searchCareerField = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerField(req.portal, params);

        await Log.info(req.user.email, 'GET_CAREER_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_CAREER_FIELD', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_position_faile"],
            content: {
                error: error
            }
        });
    }
}



// =================CREATE====================

/** Tạo mới Lĩnh vực */
exports.crateNewCareerField = async (req, res) => {
    try {
        data = await careerPositionService.crateNewCareerField(req.portal, req.body);
        await Log.info(req.user.email, 'CREATE_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_career_field_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_FIELD', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_career_field_faile"],
            content: {
                error: error
            }
        });
    }
}


/** Tạo mới vị trí công việc */
exports.crateNewCareerPosition = async (req, res) => {
    try {
        data = await careerPositionService.crateNewCareerPosition(req.portal, req.body);
        await Log.info(req.user.email, 'CREATE_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_career_position_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_POSITION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_career_position_faile"],
            content: {
                error: error
            }
        });
    }
}


/** Tạo mới hoạt động công việc */
exports.crateNewCareerAction = async (req, res) => {
    try {
        data = await careerPositionService.crateNewCareerAction(req.portal, req.body);
        await Log.info(req.user.email, 'CREATE_ACTION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_career_action_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_ACTION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_career_action_faile"],
            content: {
                error: error
            }
        });
    }
}


// ================EDIT===================

/** Chỉnh sửa vị trí công việc */
exports.editCareerPosition = async (req, res) => {
    // try {
        data = await careerPositionService.editCareerPosition(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'EDIT_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_career_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'EDIT_POSITION', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["edit_career_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** Chỉnh sửa lĩnh vực công việc */
exports.editCareerField = async (req, res) => {
    // try {
        data = await careerPositionService.editCareerField(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'EDIT_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_career_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'EDIT_FIELD', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["edit_career_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** Chỉnh sửa hoạt động công việc */
exports.editCareerAction = async (req, res) => {
    // try {
        data = await careerPositionService.editCareerAction(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'EDIT_ACTION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_career_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'EDIT_ACTION', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["edit_career_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}



// ====================DELETE=======================

/** Xóa lĩnh vực công việc */
exports.deleteCareerField = async (req, res) => {
    try {
        data = await careerPositionService.deleteCareerField(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_field_success"],
            content: data
        });
    } catch (error) {
        // await Log.error(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_field_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xóa vị trí công việc */
exports.deleteCareerPosition = async (req, res) => {
    // try {
        data = await careerPositionService.deleteCareerPosition(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_field_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'DELETE_FIELD', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["delete_field_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** Xóa hoạt động công việc */
exports.deleteCareerAction = async (req, res) => {
    // try {
        data = await careerPositionService.deleteCareerAction(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_field_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'DELETE_FIELD', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["delete_field_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

