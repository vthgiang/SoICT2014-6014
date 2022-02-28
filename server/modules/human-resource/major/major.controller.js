const MajorService = require("./major.service");
const UserService = require(`${SERVER_MODULES_DIR}/super-admin/user/user.service`);
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const EmployeeService = require("../profile/profile.service");

const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách các chuyên ngành */
exports.searchMajor = async (req, res) => {
    try {
        let data = {};

        let params = {
            majorName: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        };
        data = await MajorService.searchMajor(req.portal, params);

        await Log.info(req.user.email, "GET_MAJOR", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_major_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_MAJOR", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_major_failure"],
            content: {
                error: error,
            },
        });
    }
};

/** Tạo mới chuyên ngành */
exports.crateNewMajor = async (req, res) => {
    try {
        data = await MajorService.crateNewMajor(req.portal, req.body);
        await Log.info(req.user.email, "CREATE_MAJOR", req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_major_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATE_MAJOR", req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_major_failure"],
            content: {
                error: error,
            },
        });
    }
};

/** Chỉnh sửa chuyên ngành */
exports.editMajor = async (req, res) => {
    try {
        data = await MajorService.editMajor(req.portal, req.body, req.params);
        await Log.info(req.user.email, "EDIT_MAJOR", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_major_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_MAJOR", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_major_failure"],
            content: {
                error: error,
            },
        });
    }
};

// ====================DELETE=======================

/** Xóa chuyên ngành */
exports.deleteMajor = async (req, res) => {
    try {
        data = await MajorService.deleteMajor(
            req.portal,
            req.body,
            req.params.id
        );
        await Log.info(req.user.email, "DELETE_MAJOR", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_major_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_MAJOR", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_major_failure"],
            content: {
                error: error,
            },
        });
    }
};
