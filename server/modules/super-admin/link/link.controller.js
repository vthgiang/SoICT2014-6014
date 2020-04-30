const LinkService = require('./link.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getAllLinks = async (req, res) => {
    try {
        var links = await LinkService.getAllLinks(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_ALL_LINKS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_links_success'],
            content: links
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_ALL_LINKS', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getPaginatedLinks = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkService.getPaginatedLinks(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        await LogInfo(req.user.email, 'GET_PAGINATED_LINKS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['paginate_links_success'],
            content: links
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_PAGINATED_LINKS', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.createLink = async (req, res) => {
    try {
        var createLink = await LinkService.createLink(req.body, req.user.company._id);
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        var link = await LinkService.getLinkById(createLink._id);

        await LogInfo(req.user.email, 'CREATE_LINK', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_link_success'],
            content: link
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_LINK', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getLinkById = async (req, res) => {
    try {
        var link = await LinkService.getLinkById(req.params.id);
        
        await LogInfo(req.user.email, 'GET_LINK_BY_ID', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_link_success'],
            content: link
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_LINK_BY_ID', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.editLink = async (req, res) => {
    try {
        await LinkService.relationshipLinkRole(req.params.id, req.body.roles);
        const link = await LinkService.editLink(req.params.id, req.body);
        const data = await LinkService.getLinkById(link._id);
        
        await LogInfo(req.user.email, 'EDIT_LINK', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_link_success'],
            content: data
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_LINK', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.deleteLink = async (req, res) => {
    try {
        var link = await LinkService.deleteLink(req.params.id );
        
        await LogInfo(req.user.email, 'DELETE_LINK', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_link_success'],
            content: link
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_LINK', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};