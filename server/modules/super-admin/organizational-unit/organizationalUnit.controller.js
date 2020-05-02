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
            messages: ['get_departments_success'],
            content: { list, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DEPARTMENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_departments_faile'],
            content: error
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
            messages: ['create_department_success'],
            content: { department: organizationalUnit, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_department_faile'],
            content: error
        });
    }
};

exports.getOrganizationalUnit = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.getOrganizationalUnit(req.params.id);
        
        await LogInfo(req.user.email, 'SHOW_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_department_success'],
            content: department
        });
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_department_faile'],
            content: error
        });
    }
};

exports.editOrganizationalUnit = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.editOrganizationalUnit(req.params.id, req.body);
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
            messages: ['edit_department_success'],
            content: { department, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_department_faile'],
            content: error
        });
    }
};

exports.deleteOrganizationalUnit = async (req, res) => {
    try {
        var role = await OrganizationalUnitService.deleteOrganizationalUnit(req.params.id);
        var tree = await OrganizationalUnitService.getAllOrganizationalUnitsAsTree(req.user.company._id);

        await LogInfo(req.user.email, 'DELETE_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_department_success'],
            content: { role, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_department_faile'],
            content: error
        });
    }
};


exports.getOrganizationalUnitsOfUser = async (req, res) => {
    try {
        const department = await OrganizationalUnitService.getOrganizationalUnitsOfUser(req.params.id);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENT_OF_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_department_of_user_success'],
            content: department
        });
    } catch (error) {

        await LogError(req.user.email, 'GET_DEPARTMENT_OF_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_department_of_user_faile'],
            content: error
        });
    }
}

exports.getOrganizationalUnitsThatUserIsDean = async (req, res) =>{
    try {
        const department = await OrganizationalUnitService.getOrganizationalUnitsThatUserIsDean(req.params.id);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENT_THAT_USER_IS_DEAN', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_department_that_user_is_dean_success'],
            content: department
        });
    }
    catch (error) {
        await LogError(req.user.email, 'GET_DEPARTMENT_THAT_USER_IS_DEAN', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_department_that_user_is_dean_faile'],
            content: error
        });
    }
}