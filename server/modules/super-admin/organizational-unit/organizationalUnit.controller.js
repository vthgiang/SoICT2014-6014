const OrganizationalUnitService = require('./organizationalUnit.service');
const RoleService = require('../role/role.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getAllOrganizationalUnits = async (req, res) => {
    try {
        var list = await OrganizationalUnitService.getAllOrganizationalUnits(req.user.company._id); 
        var tree = await OrganizationalUnitService.getAllOrganizationalUnitsAsTree(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENTS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_departments_success',
            content: { list, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DEPARTMENTS', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.createOrganizationalUnit = async (req, res) => {
    try {
        var roles = await RoleService.createRolesForOrganizationalUnit(req.body, req.user.company._id);
        var organizationalUnit = await OrganizationalUnitService.createOrganizationalUnit( req.body, roles.dean._id, roles.viceDean._id, roles.employee.id, req.user.company._id );
        var tree = await OrganizationalUnitService.getAllOrganizationalUnitsAsTree(req.user.company._id);
        organizationalUnit.dean = roles.dean;
        organizationalUnit.viceDean = roles.viceDean;
        organizationalUnit.employee = roles.employee;

        await LogInfo(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'create_department_success',
            content: { department: organizationalUnit, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.show = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.getById(req, res);
        
        await LogInfo(req.user.email, 'SHOW_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'show_department_success',
            content: department
        });
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.edit = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.edit(req.params.id, req.body);
        var dean = await RoleService.editRole(department.dean, {name: req.body.dean});
        var viceDean = await RoleService.editRole(department.viceDean, {name: req.body.viceDean});
        var employee = await RoleService.editRole(department.employee, {name: req.body.employee});
        department.dean = dean;
        department.viceDean = viceDean;
        department.employee = employee;
        var tree = await OrganizationalUnitService.getAllOrganizationalUnitsAsTree(req.user.company._id);

        await LogInfo(req.user.email, 'EDIT_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'edit_department_success',
            content: { department, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await OrganizationalUnitService.delete(req.params.id);
        var tree = await OrganizationalUnitService.getAllOrganizationalUnitsAsTree(req.user.company._id);

        await LogInfo(req.user.email, 'DELETE_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'delete_department_success',
            content: { role, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};


exports.getDepartmentOfUser = async (req, res) => {
    try {
        const department = await OrganizationalUnitService.getDepartmentOfUser(req.params.id);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENT_OF_USER', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_department_of_user_success',
            content: department
        });
    } catch (error) {

        await LogError(req.user.email, 'GET_DEPARTMENT_OF_USER', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
}

exports.getDepartmentsThatUserIsDean = async (req, res) =>{
    try {
        const department = await OrganizationalUnitService.getDepartmentsThatUserIsDean(req.params.id);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENT_THAT_USER_IS_DEAN', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_department_that_user_is_dean_success',
            content: department
        });
    }
    catch (error) {
        await LogError(req.user.email, 'GET_DEPARTMENT_THAT_USER_IS_DEAN', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
}