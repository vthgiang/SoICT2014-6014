const RoleService = require('./role.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getAllRoles = async (req, res) => {
    try {
        var roles = await RoleService.getAllRoles(req.user.company._id); //truyen vao id cua cong ty
        
        LogInfo(req.user.email, 'GET_ALL_ROLES', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_roles_success',
            content: roles
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_ALL_ROLES', req.user.company);
        res.status(400).json({
            success: false,
            message: error
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
            message: 'paginate_roles_success',
            content: roles
        });
    } catch (error) {

        LogError(req.user.email, 'PAGINATE_ROLES', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.createRole = async (req, res) => {
    try {
        const checkRole = await RoleService.searchRoles({
            company: req.user.company._id,
            name: req.body.name
        });
        if(checkRole !== null) throw ['role_name_exist', 'error_code_2'];
        var role = await RoleService.createRole(req.body, req.user.company._id);
        await RoleService.editRelationshipUserRole(role._id, req.body.users);
        var data = await RoleService.getRoleById(req.user.company._id, role._id);
        
        LogInfo(req.user.email, 'CREATE_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            message: 'create_role_success',
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'CREATE_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        var role = await RoleService.getRoleById(req.user.company._id, req.params.id);
        
        LogInfo(req.user.email, 'SHOW_ROLE_INFORMATION', req.user.company);
        res.status(200).json({
            success: true,
            message: 'show_role_success',
            content: role
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_ROLE_INFORMATION', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.editRole = async (req, res) => {
    try {
        await RoleService.editRelationshipUserRole(req.params.id, req.body.users);
        var role = await RoleService.editRole(req.params.id, req.body); //truyền vào id role và dữ liệu chỉnh sửa
        var data = await RoleService.getRoleById(req.user.company._id, role._id);
        
        LogInfo(req.user.email, 'EDIT_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            message: 'edit_role_success',
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        var role = await RoleService.deleteRole(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            message: 'delete_role_success',
            content: role
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getAllRolesInSameOrganizationalUnitWithRole = async (req, res) => {
    try {
        const roles = await RoleService.getAllRolesInSameOrganizationalUnitWithRole(req.params.id);

        LogInfo(req.user.email, 'GET_ROLES_SAME_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_roles_same_department',
            content: roles
        });
    } catch (error) {

        LogError(req.user.email, 'GET_ROLES_SAME_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};
