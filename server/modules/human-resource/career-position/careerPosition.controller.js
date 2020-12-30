const careerPositionService = require('./careerPosition.service');
const UserService = require(`../../super-admin/user/user.service`);
const NotificationServices = require(`../../notification/notification.service`);
const EmployeeService = require('../profile/profile.service');

const {
    sendEmail
} = require(`../../../helpers/emailHelper`);

const Log = require(`../../../logs`);

/** Lấy danh sách vị trí công việc */
exports.searchCareerPosition = async (req, res) => {
    // try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerPosition(req.portal, params);

        // await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_CAREER_POSITION', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["get_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** Lấy danh sách vị trí công việc */
exports.searchCareerAction = async (req, res) => {
    // try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerAction(req.portal, params);

        // await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_CAREER_POSITION', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["get_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** Lấy danh sách vị trí công việc */
exports.searchCareerField = async (req, res) => {
    // try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerField(req.portal, params);

        // await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_CAREER_POSITION', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["get_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}





/** Tạo mới Lĩnh vực */
exports.crateNewCareerField = async (req, res) => {
    // try {
        data = await careerPositionService.crateNewCareerField(req.portal, req.body);
        // await Log.info(req.user.email, 'GET_MAJOR', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_career_field_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_MAJOR', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["create_career_field_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}


/** Tạo mới vị trí công việc */
exports.crateNewCareerPosition = async (req, res) => {
    // try {
        data = await careerPositionService.crateNewCareerPosition(req.portal, req.body);
        // await Log.info(req.user.email, 'GET_MAJOR', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_career_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_MAJOR', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["create_career_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}


/** Tạo mới hoạt động công việc */
exports.crateNewCareerAction = async (req, res) => {
    // try {
        data = await careerPositionService.crateNewCareerAction(req.portal, req.body);
        // await Log.info(req.user.email, 'GET_MAJOR', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_career_action_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_MAJOR', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["create_career_action_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}


/** Tạo mới hoạt động công việc */
exports.editCareerPosition = async (req, res) => {
    // try {
        data = await careerPositionService.editCareerPosition(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'GET_MAJOR', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_career_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_MAJOR', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["edit_career_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

