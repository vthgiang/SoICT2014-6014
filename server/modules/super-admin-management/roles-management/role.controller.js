const RoleService = require('./role.service');
const { Log } = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET_ROLES');
    try {
        var roles = await RoleService.get(req.user.company._id); //truyen vao id cua cong ty
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET_PAGINATE ROLES');
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var roles = await RoleService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        isLog && Logger.info(req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE_ROLE');
    try {
        var role = await RoleService.create(req.body, req.user.company._id);
        await RoleService.editRelationshiopUserRole(role._id, req.body.users);
        var data = await RoleService.getById(req.user.company._id, role._id);
        
        console.log("Dtaa: ", data);
        isLog && Logger.info(req.user.email);
        res.status(200).json(data);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW_ROLE');
    try {
        var role = await RoleService.getById(req.user.company._id, req.params.id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT_ROLE');
    try {
        await RoleService.editRelationshiopUserRole(req.params.id, req.body.users);
        var role = await RoleService.edit(req.params.id, req.body); //truyền vào id role và dữ liệu chỉnh sửa
        var data = await RoleService.getById(req.user.company._id, role._id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(data);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE_ROLE');
    try {
        var role = await RoleService.delete(req.params.id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.test = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT_RELATIONSHIOP_USER_ROLE');
    try {
        var role = await RoleService.editRelationshiopUserRole( req.params.id, req.body.users );

        isLog && Logger.info(req.user.email);        
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);     
        res.status(400).json(error);
    }
};
