const RoleService = require('./role.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getAllRoles = async (req, res) => {
    try {
        var roles = await RoleService.getAllRoles(req.user.company._id); //truyen vao id cua cong ty
        
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

exports.getPaginatedRoles = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var roles = await RoleService.getPaginatedRoles(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        LogInfo(req.user.email, 'PAGINATE_ROLES', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['paginate_roles_success'],
            content: roles
        });
    } catch (error) {

        LogError(req.user.email, 'PAGINATE_ROLES', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['paginate_roles_faile'],
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
        
        LogError(req.user.email, 'CREATE_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_role_faile'],
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
        
        LogError(req.user.email, 'DELETE_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_role_faile'],
            content: error
        });
    }
};

exports.getAllRolesInSameOrganizationalUnitWithRole = async (req, res) => {
    try {
        const roles = await RoleService.getAllRolesInSameOrganizationalUnitWithRole(req.params.id);

        LogInfo(req.user.email, 'GET_ROLES_SAME_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_roles_same_department_success'],
            content: roles
        });
    } catch (error) {

        LogError(req.user.email, 'GET_ROLES_SAME_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_roles_same_department_faile'],
            content: error
        });
    }
};
