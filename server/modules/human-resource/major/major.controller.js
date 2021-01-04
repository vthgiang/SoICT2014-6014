const MajorService = require('./major.service');
const UserService = require(`../../super-admin/user/user.service`);
const NotificationServices = require(`../../notification/notification.service`);
const EmployeeService = require('../profile/profile.service');

const {
    sendEmail
} = require(`../../../helpers/emailHelper`);

const Log = require(`../../../logs`);

/** Lấy danh sách nghỉ phép */
exports.searchMajor = async (req, res) => {
    try {
        let data = {};

        let params = {
            majorName: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await MajorService.searchMajor(req.portal, params);

        // await Log.info(req.user.email, 'GET_MAJOR', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_major_success"],
            content: data
        });
    } catch (error) {
        // await Log.error(req.user.email, 'GET_MAJOR', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_major_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới chuyên ngành */
exports.crateNewMajor = async (req, res) => {
    // try {
        data = await MajorService.crateNewMajor(req.portal, req.body);
        // await Log.info(req.user.email, 'create_major', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_major_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'create_major', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["create_major_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** chỉnh sửa chuyên ngành */
exports.updateMajor = async (req, res) => {
    // try {
        data = await MajorService.updateMajor(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'update_major', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_major_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'update_major', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["update_major_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

/** xóa chuyên ngành */
exports.deleteMajor = async (req, res) => {
    // try {
        data = await MajorService.deleteMajor(req.portal, req.body);
        // await Log.info(req.user.email, 'delete_major', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_major_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'delete_major', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["delete_major_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

