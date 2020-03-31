const DepartmentService = require('./department.service');
const RoleService = require('../roles-management/role.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var list = await DepartmentService.get(req.user.company._id); 
        var tree = await DepartmentService.getTree(req.user.company._id);

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
            message: error.message !== undefined ? error.message : 'get_departments_faile',
            content: error
        });
    }
};

exports.create = async (req, res) => {
    try {
        var roles = await RoleService.crt_rolesOfDepartment(req.body, req.user.company._id);
        var department = await DepartmentService.create( req.body, roles.dean._id, roles.vice_dean._id, roles.employee.id, req.user.company._id );
        var tree = await DepartmentService.getTree(req.user.company._id);
        department.dean = roles.dean;
        department.vice_dean = roles.vice_dean;
        department.employee = roles.employee;

        await LogInfo(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'create_department_success',
            content: { department, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'create_department_faile',
            content: error
        });
    }
};

exports.show = async (req, res) => {
    try {
        var department = await DepartmentService.getById(req, res);
        
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
            message: error.message !== undefined ? error.message : 'show_department_faile',
            content: error
        });
    }
};

exports.edit = async (req, res) => {
    try {
        var department = await DepartmentService.edit(req.params.id, req.body);
        var dean = await RoleService.edit(department.dean, {name: req.body.dean});
        var vice_dean = await RoleService.edit(department.vice_dean, {name: req.body.vice_dean});
        var employee = await RoleService.edit(department.employee, {name: req.body.employee});
        department.dean = dean;
        department.vice_dean = vice_dean;
        department.employee = employee;
        var tree = await DepartmentService.getTree(req.user.company._id);

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
            message: error.message !== undefined ? error.message : 'edit_department_faile',
            content: error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await DepartmentService.delete(req.params.id);
        var tree = await DepartmentService.getTree(req.user.company._id);

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
            message: error.message !== undefined ? error.message : 'delete_department_faile',
            content: error
        });
    }
};


exports.getDepartmentOfUser = async (req, res) => {
    try {
        const department = await DepartmentService.getDepartmentOfUser(req.params.id);
        
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
            message: error.message !== undefined ? error.message : 'get_department_of_user_faile',
            content: error
        });
    }
}