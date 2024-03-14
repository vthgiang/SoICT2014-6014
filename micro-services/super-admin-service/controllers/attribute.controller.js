const AttributeService = require('../services/attribute.service');
const Logger = require('../logs/index');
const { decryptMessage } = require('../helpers/functionHelper');

// Thêm mới một ví dụ
exports.createAttribute = async (req, res) => {
    try {
        const newAttribute = await AttributeService.createAttribute(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_ATTRIBUTE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newAttribute
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_ATTRIBUTE", req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_fail'],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getAttributes = async (req, res) => {
    try {
        let data = await AttributeService.getAttributes(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_ATTRIBUTES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_attributes_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_ATTRIBUTES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_attributes_fail"],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getAttributeById = async (req, res) => {
    try {
        let { id } = req.params;
        let attribute = await AttributeService.getAttributeById(req.portal, id);
        if (attribute !== -1) {
            await Log.info(req.user.email, "GET_ATTRIBUTE_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_attribute_by_id_success"],
                content: attribute
            });
        } else {
            throw Error("attribute is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_ATTRIBUTE_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_attribute_by_id_fail"],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editAttribute = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedAttribute = await AttributeService.editAttribute(req.portal, id, data);
        if (updatedAttribute !== -1) {
            await Log.info(req.user.email, "UPDATED_ATTRIBUTE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_attribute_success"],
                content: updatedAttribute
            });
        } else {
            throw Error("Attribute is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_ATTRIBUTE", req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ["edit_attribute_fail"],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteAttributes = async (req, res) => {
    try {
        let deletedAttribute = await AttributeService.deleteAttributes(req.portal, req.body.attributeIds);
        if (deletedAttribute) {
            await Log.info(req.user.email, "DELETED_ATTRIBUTE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedAttribute
            });
        } else {
            throw Error("Attribute is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_ATTRIBUTE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyAttributeName = async (req, res) => {
    try {
        let data = await AttributeService.getOnlyAttributeName(req.portal, req.query);

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_ATTRIBUTES", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_attributes_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_ATTRIBUTES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_attributes_fail"],
            content: error.message
        });
    }
}
