const ComponentService = require('./component.service');
const { Logger } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var roles = await ComponentService.get(req.user.company._id);
        
        isLog && Logger.info(`[GET_COMPONENTS]`+req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        isLog && Logger.error(`[GET_COMPONENTS]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var components = await ComponentService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty
        
        isLog && Logger.info(`[GET_COMPONENTS_PAGINATE]`+req.user.email);
        res.status(200).json(components);
    } catch (error) {
        
        isLog && Logger.error(`[GET_COMPONENTS_PAGINATE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        req.body.company = req.user.company._id;
        var createComponent = await ComponentService.create(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        var component = await ComponentService.getById(createComponent._id);

        isLog && Logger.info(`[CREATE_COMPONENT]`+req.user.email);
        res.status(200).json(component);
    } catch (error) {
        
        isLog && Logger.error(`[CREATE_COMPONENT]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await ComponentService.getById(req.params.id);
        
        isLog && Logger.info(`[SHOW_COMPONENT]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(`[SHOW_COMPONENT]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        var component = await ComponentService.edit(req.params.id, req.body);
        
        isLog && Logger.info(`[EDIT_COMPONENT]`+req.user.email);
        res.status(200).json(component);
    } catch (error) {
        
        isLog && Logger.error(`[EDIT_COMPONENT]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await ComponentService.delete(req.params.id );
        
        isLog && Logger.info(`[DELETE_COMPONENT]`+req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(`[DELETE_COMPONENT]`+req.user.email);
        res.status(400).json(error);
    }
};
