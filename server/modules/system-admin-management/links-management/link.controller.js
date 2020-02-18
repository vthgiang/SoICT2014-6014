const LinkService = require('./link.service');
const { Logger } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var links = await LinkService.get(req.user.company._id);
        
        isLog && Logger.info(`[GET_LINKS]`+req.user.email);
        res.status(200).json(links);
    } catch (error) {
        
        isLog && Logger.error(`[GET_LINKS]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        console.log("GET LINK PAGINATE")
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        isLog && Logger.info(`[GET_LINKS_PAGINATE]`+req.user.email);
        res.status(200).json(links);
    } catch (error) {
        
        isLog && Logger.error(`[GET_LINKS_PAGINATE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var createLink = await LinkService.create(req.body, req.user.company._id);
        console.log("create link: ", createLink)
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        var link = await LinkService.getById(createLink._id);

        isLog && Logger.info(`[CREATE_LINK]`+req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(`[CREATE_LINK]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var link = await LinkService.getById(req.params.id);
        
        isLog && Logger.info(`[SHOW_LINK]`+req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(`[SHOW_LINK]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        console.log("edit link")
        await LinkService.relationshipLinkRole(req.params.id, req.body.roles);
        var link = await LinkService.edit(req.params.id, req.body);
        
        isLog && Logger.info(`[EDIT_LINK]`+req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(`[EDIT_LINK]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await LinkService.delete(req.params.id );
        
        isLog && Logger.info(`[DELETE_LINK]`+req.user.email);
        res.status(200).json(link);
    } catch (error) {
        
        isLog && Logger.error(`[DELETE_LINK]`+req.user.email);
        res.status(400).json(error);
    }
};


/* ------manage links of 1 company ------------------*/
exports.getLinksOfCompany = async (req, res) => {
    try {
        var links = await LinkService.getLinksOfCompany(req.user.company._id);

        isLog && Logger.info(`[GET_LINKS_OF_COMPANY]`+req.user.email);
        res.status(200).json(links);
    } catch (error) {

        isLog && Logger.error(`[GET_LINKS_OF_COMPANY]`+req.user.email);
        res.status(400).json(error);
    }
}