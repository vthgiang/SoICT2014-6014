const FieldService = require('./field.service');
const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách ngành nghề/ lĩnh vực */
exports.getAllFields = async (req, res) => {
    try {
        let params = {
            name: req.query.name,
            limit: Number(req.query.limit),
            page: Number(req.query.page),
        }
        let data = await FieldService.getAllFields(req.portal, params, req.user.company._id);
        await Log.info(req.user.email, 'GET_FIELDS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_fields_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_FIELDS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_fields_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới thông tin ngành nghề/ lĩnh vực */
exports.createFields = async (req, res) => {
    try {
        let data = await FieldService.createFields(req.portal, req.body, req.user.company._id);
        await Log.info(req.user.email, 'CREATE_FIELDS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_fields_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_FIELDS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_fields_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin ngành nghề/ lĩnh vực */
exports.deleteFields = async (req, res) => {
    try {
        let data = await FieldService.deleteFields(req.portal, req.params.id, req.user.company._id);
        await Log.info(req.user.email, 'DELETE_FIELDS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_fields_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_FIELDS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fields_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Chỉnh sửa thông tin ngành nghề/ lĩnh vực */
exports.updateFields = async (req, res) => {
    try {   
        let data = await FieldService.updateFields(req.portal, req.params.id, req.body, req.user.company._id);
        await Log.info(req.user.email, 'EDIT_FIELDS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_fields_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_FIELDS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_fields_faile"],
            content: {
                error: error
            }
        });
    }
};