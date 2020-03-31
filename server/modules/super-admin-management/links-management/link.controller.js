const LinkService = require('./link.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var links = await LinkService.get(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_LINKS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_links_success',
            content: links
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_LINKS', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'get_links_faile',
            content: error
        });
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        await LogInfo(req.user.email, 'PAGINATE_LINKS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'paginate_links_success',
            content: links
        });
    } catch (error) {
        
        await LogError(req.user.email, 'PAGINATE_LINKS', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'paginate_links_faile',
            content: error
        });
    }
};

exports.create = async (req, res) => {
    try {
        var createLink = await LinkService.create(req.body, req.user.company._id);
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        var link = await LinkService.getById(createLink._id);

        await LogInfo(req.user.email, 'CREATE_LINK', req.user.company);
        res.status(200).json({
            success: true,
            message: 'create_link_success',
            content: link
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_LINK', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'create_link_faile',
            content: error
        });
    }
};

exports.show = async (req, res) => {
    try {
        var link = await LinkService.getById(req.params.id);
        
        await LogInfo(req.user.email, 'SHOW_LINK', req.user.company);
        res.status(200).json({
            success: true,
            message: 'show_link_success',
            content: link
        });
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_LINK', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'show_link_faile',
            content: error
        });
    }
};

exports.edit = async (req, res) => {
    try {
        await LinkService.relationshipLinkRole(req.params.id, req.body.roles);
        var link = await LinkService.edit(req.params.id, req.body);
        var data = await LinkService.getById(link._id);
        
        await LogInfo(req.user.email, 'EDIT_LINK', req.user.company);
        res.status(200).json({
            success: true,
            message: 'edit_link_success',
            content: data
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_LINK', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'edit_link_faile',
            content: error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await LinkService.delete(req.params.id );
        
        await LogInfo(req.user.email, 'DELETE_LINK', req.user.company);
        res.status(200).json({
            success: true,
            message: 'delete_link_success',
            content: link
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_LINK', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'delete_link_faile',
            content: error
        });
    }
};


/* ------manage links of 1 company ------------------*/
exports.getLinksOfCompany = async (req, res) => {
    try {
        var links = await LinkService.getLinksOfCompany(req.user.company._id);

        await LogInfo(req.user.email, 'GET_LINKS_OF_COMPANY', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_links_of_company_success',
            content: links
        });
    } catch (error) {

        await LogError(req.user.email, 'GET_LINKS_OF_COMPANY', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'get_links_of_company_faile',
            content: error
        });
    }
}