const DepartmentService = require('./department.service');
const RoleService = require('../roles-management/role.service');
const { Logger } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var list = await DepartmentService.get(req.user.company._id); 
        var tree = await DepartmentService.getTree(req.user.company._id);

        isLog && Logger.info(`[GET_DEPARTMENTS]`+req.user.email);
        res.status(200).json({list, tree});
    } catch (error) {
        
        isLog && Logger.error(`[GET_DEPARTMENTS]`+req.user.email);
        res.status(400).json({ error: error, tag: 'CO LOI'});
    }
};

exports.create = async (req, res) => {
    try {
        var roles = await RoleService.crt_rolesOfDepartment(req.body, req.user.company._id);
        var department = await DepartmentService.create( req.body, roles.dean, roles.vice_dean, roles.employee, req.user.company._id );
        var tree = await DepartmentService.getTree(req.user.company._id);
        
        isLog && Logger.info(`[CREATE_DEPARTMENT]`+req.user.email);
        res.status(200).json({department, tree});
    } catch (error) {
        
        isLog && Logger.error(`[CREATE_DEPARTMENT]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var department = await DepartmentService.getById(req, res);
        
        isLog && Logger.info(`[SHOW_DEPARTMENT]`+req.user.email);
        res.status(200).json(department);
    } catch (error) {
        
        isLog && Logger.error(`[SHOW_DEPARTMENT]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var department = await DepartmentService.edit(req, res);
        
        isLog && Logger.info(`[EDIT_DEPARTMENT]`+req.user.email);
        res.status(200).json(department);
    } catch (error) {
        
        isLog && Logger.error(`[EDIT_DEPARTMENT]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await DepartmentService.delete(req.params.id);
        var tree = await DepartmentService.getTree(req.user.company._id);

        isLog && Logger.info(`[DELETE_DEPARTMENT]`+req.user.email);
        res.status(200).json({
            role,
            tree
        });
    } catch (error) {
        
        isLog && Logger.error(`[DELETE_DEPARTMENT]`+req.user.email);
        res.status(400).json(error);
    }
};
    