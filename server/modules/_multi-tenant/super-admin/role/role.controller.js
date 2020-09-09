const RoleService = require('./role.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getRoles = async (req, res) => {
    try {
        var roles = await RoleService.getRoles(req.user.company._id, req.query); //truyen vao id cua cong ty
        
        LogInfo(req.user.email, 'GET_ALL_ROLES', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_roles_success'],
            content: roles
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_ALL_ROLES', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_roles_faile'],
            content: error
        });
    }
};

exports.getRole = async (req, res) => {
    try {
        var role = await RoleService.getRole(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_ROLE_INFORMATION', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_role_success'],
            content: role
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_ROLE_INFORMATION', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_role_faile'],
            content: error
        });
    }
};

exports.createRole = async (req, res) => {
    try {
        var role = await RoleService.createRole(req.body, req.user.company._id);
        await RoleService.editRelationshipUserRole(role._id, req.body.users);
        var data = await RoleService.getRole(role._id);
        
        LogInfo(req.user.email, 'CREATE_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_role_success'],
            content: data
        });
    } catch (error) {
        console.log("error create role", error)
        LogError(req.user.email, 'CREATE_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_role_faile'],
            content: error
        });
    }
};

exports.editRole = async (req, res) => {
    try {
        await RoleService.editRelationshipUserRole(req.params.id, req.body.users);
        var role = await RoleService.editRole(req.params.id, req.body); //truyền vào id role và dữ liệu chỉnh sửa
        var data = await RoleService.getRole(role._id);
        
        LogInfo(req.user.email, 'EDIT_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_role_success'],
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_role_faile'],
            content: error
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        var role = await RoleService.deleteRole(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_role_success'],
            content: role
        });
    } catch (error) {
        console.log("errro:", error)
        LogError(req.user.email, 'DELETE_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_role_faile'],
            content: error
        });
    }
};