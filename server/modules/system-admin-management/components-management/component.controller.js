const ComponentService = require('./component.service');
const { Log } = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET COMPONENTS');
    try {
        var roles = await ComponentService.get(req.user.company._id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET PAGINATE COMPONENTS');
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var components = await ComponentService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(components);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE COMPONENT');
    try {
        req.body.company = req.user.company._id;
        var createComponent = await ComponentService.create(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        var component = await ComponentService.getById(createComponent._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(component);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW COMPONENT');
    try {
        var role = await ComponentService.getById(req.params.id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT COMPONENT');
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        var component = await ComponentService.edit(req.params.id, req.body);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(component);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE COMPONENT');
    try {
        var link = await ComponentService.delete(req.params.id );
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};
