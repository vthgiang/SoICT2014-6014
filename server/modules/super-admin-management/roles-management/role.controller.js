const RoleService = require('./role.service');
const { Logger } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var roles = await RoleService.get(req.user.company._id); //truyen vao id cua cong ty
        
        //isLog && Logger.info(`[GET_ROLES]`+req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        //isLog && Logger.error(`[GET_ROLES]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var roles = await RoleService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        //isLog && Logger.info(`[GET_ROLES_PAGINATE]`+req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        //isLog && Logger.error(`[GET_ROLES_PAGINATE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await RoleService.create(req.body, req.user.company._id);
        
        //isLog && Logger.info(`[CREATE_ROLE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        //isLog && Logger.error(`[CREATE_ROLE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await RoleService.getById(req.user.company._id, req.params.id);
        
        //isLog && Logger.info(`[SHOW_ROLE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        //isLog && Logger.error(`[SHOW_ROLE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        await RoleService.editRelationshiopUserRole(req.params.id, req.body.users);
        var role = await RoleService.edit(req.params.id, req.body); //truyền vào id role và dữ liệu chỉnh sửa
        
        //isLog && Logger.info(`[EDIT_ROLE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        //isLog && Logger.error(`[EDIT_ROLE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await RoleService.delete(req.params.id);
        
        //isLog && Logger.info(`[DELETE_ROLE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        //isLog && Logger.error(`[DELETE_ROLE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.test = async (req, res) => {
    try {
        var role = await RoleService.editRelationshiopUserRole( req.params.id, req.body.users );

        //isLog && Logger.info(`[EDIT_RELATIONSHIOP_USER_ROLE]`+req.user.email);        
        res.status(200).json(role);
    } catch (error) {
        
        //isLog && Logger.error(`[EDIT_RELATIONSHIOP_USER_ROLE]`+req.user.email);     
        res.status(400).json(error);
    }
};
