const DepartmentService = require('./department.service');
const RoleService = require('../roles-management/role.service');
const { Log } = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET DEPARTMENTS');
    try {
        var list = await DepartmentService.get(req.user.company._id); 
        var tree = await DepartmentService.getTree(req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json({list, tree});
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json({ error: error, tag: 'CO LOI'});
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE DEPARTMENT');
    try {
        var roles = await RoleService.crt_rolesOfDepartment(req.body, req.user.company._id);
        var department = await DepartmentService.create( req.body, roles.dean._id, roles.vice_dean._id, roles.employee.id, req.user.company._id );
        var tree = await DepartmentService.getTree(req.user.company._id);
        department.dean = roles.dean;
        department.vice_dean = roles.vice_dean;
        department.employee = roles.employee;
        isLog && Logger.info(req.user.email);
        res.status(200).json({department, tree});
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW DEPARTMENT');
    try {
        var department = await DepartmentService.getById(req, res);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(department);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT DEPARTMENT');
    try {
        console.log(req.body);
        var department = await DepartmentService.edit(req.params.id, req.body); //sửa phòng ban
        console.log(department);
        var dean = await RoleService.edit(department.dean, {name: req.body.dean});
        var vice_dean = await RoleService.edit(department.vice_dean, {name: req.body.vice_dean});
        var employee = await RoleService.edit(department.employee, {name: req.body.employee});
        department.dean = dean;
        department.vice_dean = vice_dean;
        department.employee = employee;
        var tree = await DepartmentService.getTree(req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json({department, tree});
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE DEPARTMENT');
    try {
        var role = await DepartmentService.delete(req.params.id);
        var tree = await DepartmentService.getTree(req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json({
            role,
            tree
        });
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};


exports.getDepartmentOfUser = (req, res) => {
    return DepartmentService.getDepartmentOfUser(req, res);
}