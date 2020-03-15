const LinkService = require('./link.service');
const { Log } = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET LINKS');
    try {
        var links = await LinkService.get(req.user.company._id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(links);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET PAGINATE LINKS');
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        isLog && Logger.info(req.user.email);
        res.status(200).json(links);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE LINK');
    try {
        var createLink = await LinkService.create(req.body, req.user.company._id);
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        var link = await LinkService.getById(createLink._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW LINK');
    try {
        var link = await LinkService.getById(req.params.id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT LINK');
    try {
        await LinkService.relationshipLinkRole(req.params.id, req.body.roles);
        var link = await LinkService.edit(req.params.id, req.body);
        var data = await LinkService.getById(link._id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(data);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE LINK');
    try {
        var link = await LinkService.delete(req.params.id );
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};


/* ------manage links of 1 company ------------------*/
exports.getLinksOfCompany = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET LINK OF COMPANY');
    try {
        var links = await LinkService.getLinksOfCompany(req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(links);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
}