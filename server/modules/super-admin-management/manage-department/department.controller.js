const DepartmentService = require('./department.service');
const RoleService = require('../manage-role/role.service');

exports.get = async (req, res) => {
    try {
        var list = await DepartmentService.get(req.params.id); 
        var tree = await DepartmentService.getTree(req.params.id);

        res.status(200).json({list, tree});
    } catch (error) {
        
        res.status(400).json({ error: error, tag: 'CO LOI'});
    }
};

exports.create = async (req, res) => {
    try {
        var roles = await RoleService.crt_rolesOfDepartment(req.body);
        var department = await DepartmentService.create( req.body, roles.dean, roles.vice_dean, roles.employee );
        var tree = await DepartmentService.getTree(req.body.company);
        
        res.status(200).json({department, tree});
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await DepartmentService.getById(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await DepartmentService.edit(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await DepartmentService.delete(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
