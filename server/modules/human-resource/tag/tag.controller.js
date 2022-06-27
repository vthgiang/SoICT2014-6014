const TagService = require("./tag.service");
const UserService = require(`${SERVER_MODULES_DIR}/super-admin/user/user.service`);
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const EmployeeService = require("../profile/profile.service");

const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách các chuyên ngành */
exports.searchTag = async (req, res) => {
    try {
        let data = {};

        let params = {
            TagName: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        };
        data = await TagService.searchTag(
            req.portal,
            params,
            req.user.company._id
        );

        await Log.info(req.user.email, "GET_TAG", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_tag_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TAG", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_tag_failure"],
            content: {
                error: error,
            },
        });
    }
};

/** Tạo mới chuyên ngành */
exports.createNewTag = async (req, res) => {
    try {
        data = await TagService.createNewTag(
            req.portal,
            req.body,
            req.user.company._id
        );
        await Log.info(req.user.email, "CREATE_TAG", req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_tag_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATE_TAG", req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_tag_failure"],
            content: {
                error: error,
            },
        });
    }
};

/** Chỉnh sửa chuyên ngành */
exports.editTag = async (req, res) => {
    try {
        data = await TagService.editTag(
            req.portal,
            req.body,
            req.params,
            req.user.company._id
        );
        await Log.info(req.user.email, "EDIT_TAG", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_tag_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_TAG", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_tag_failure"],
            content: {
                error: error,
            },
        });
    }
};

// ====================DELETE=======================

/** Xóa chuyên ngành */
exports.deleteTag = async (req, res) => {
    try {
        data = await TagService.deleteTag(
            req.portal,
            req.body,
            req.params.id,
            req.user.company._id
        );
        await Log.info(req.user.email, "DELETE_TAG", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_tag_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_TAG", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_tag_failure"],
            content: {
                error: error,
            },
        });
    }
};
