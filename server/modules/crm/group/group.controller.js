const GroupService = require('./group.service');
const Logger = require(`../../../logs`);
/**
 * Các controller cho phần Nhóm khách hàng
 */
/**
 * Lấy thông tin của tất cả nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.getGroups = async (req, res) => {
    try {
        const groups = await GroupService.getGroups(req.portal, req.user.company._id, req.query, req.user._id, req.currentRole);
        await Logger.info(req.user.email, ' get_groups_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_groups_success'],
            content: groups
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_groups_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_groups_faile'],
            content: error
        })
    }
}

/**
 * Lấy thông tin của 1 nhóm khách hàng theo id
 * @param {*} req 
 * @param {*} res 
 */
exports.getGroupById = async (req, res) => {
    try {
        const group = await GroupService.getGroupById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_group_success'],
            content: group
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_group_faile'],
            content: error
        })
    }
}

/**
 * Tạo mới một nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.createGroup = async (req, res) => {
    try {
        const newGroup = await GroupService.createGroup(req.portal, req.user.company._id, req.user._id, req.body, req.currentRole);
        await Logger.info(req.user.email, ' create_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_group_success'],
            content: newGroup
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_group_faile'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa một nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.editGroup = async (req, res) => {
    try {
        const groupUpdate = await GroupService.editGroup(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_group_success'],
            content: groupUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_group_faile'],
            content: error
        })
    }
}

/**
 * Xóa một khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteGroup = async (req, res) => {
    try {
        const deleteGroup = await GroupService.deleteGroup(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_group_success'],
            content: deleteGroup
        })
    } catch (error) {
        await Logger.error(req.user.email, ' delete_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_group_faile'],
            content: error
        })
    }
}

exports.addGroupPromotion = async (req, res) => {
    try {
        const newGroupPromotion = await GroupService.addGroupPromotion(req.portal, req.user.company._id, req.user._id, req.body, req.currentRole);
        await Logger.info(req.user.email, 'create_group_promotion_success', req.portal);

        res.status(200).json({
            success: true,
            messages: ['create_group_promotion_success'],
            content: newGroupPromotion
        })
    } catch (error) {
        await Logger.error(req.user.email, 'create_group_promotion_false', req.portal);
        req.status(400).json({
            success: false,
            messages: ['create_group_promotion_false'],
            content: error
        })
    }
}

exports.editGroupPromotion = async (req, res) => {
    try {
        const editGroupPromotion = await GroupService.editGroupPromotion(req.portal, req.user.company._id, req.user._id, req.body, req.currentRole);
        await Logger.info(req.user.email, 'edit_group_promotion_success', req.portal);

        res.status(200).json({
            success: true,
            messages: ['edit_group_promotion_success'],
            content: editGroupPromotion
        })
    } catch (error) {
        await Logger.error(req.user.email, 'edit_group_promotion_false', req.portal);
        req.status(400).json({
            success: false,
            messages: ['edit_group_promotion_false'],
            content: error
        })
    }
}

exports.deleteGroupPromotion = async (req, res) => {
    try {
        const deleteGroupPromotion = await GroupService.deleteGroupPromotion(req.portal, req.user.company._id, req.user._id, req.body, req.currentRole);
        await Logger.info(req.user.email, 'delete_group_promotion_success', req.portal);

        res.status(200).json({
            success: true,
            messages: ['delete_group_promotion_success'],
            content: deleteGroupPromotion
        })
    } catch (error) {
        await Logger.error(req.user.email, 'delete_group_promotion_false', req.portal);
        req.status(400).json({
            success: false,
            messages: ['delete_group_promotion_false'],
            content: error
        })
    }
}