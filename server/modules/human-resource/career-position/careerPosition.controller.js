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
    try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page) ? Number(req.query.page) : 1,
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerPosition(req.portal, params);

        await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_career_position_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_career_position_failure"],
            content: {
                error: error
            }
        });
    }
}

// =================CREATE====================

/** Tạo mới vị trí công việc */
exports.createNewCareerPosition = async (req, res) => {
    try {
        data = await careerPositionService.createNewCareerPosition(req.portal, req.body);
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
            messages: ["create_career_position_failure"],
            content: {
                error: error
            }
        });
    }
}

// ================EDIT===================

/** Chỉnh sửa vị trí công việc */
exports.editCareerPosition = async (req, res) => {
    try {
        data = await careerPositionService.editCareerPosition(req.portal, req.body, req.params);
        await Log.info(req.user.email, 'EDIT_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_career_position_success"],
            content: data
        });
    } catch (error) {
        // await Log.error(req.user.email, 'EDIT_POSITION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["update_career_position_failure"],
            content: {
                error: error
            }
        });
    }
}

// ====================DELETE=======================

/** Xóa vị trí công việc */
exports.deleteCareerPosition = async (req, res) => {
    try {
        data = await careerPositionService.deleteCareerPosition(req.portal, req.body, req.params.id);
        await Log.info(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_field_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_field_failure"],
            content: {
                error: error
            }
        });
    }
}
