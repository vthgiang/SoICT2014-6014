const LinkDefaultService = require('./systemLink.service');
const {LogInfo, LogError} =  require('../../../logs');

exports.getAllSystemLinks = async (req, res) => {
    try {
        var links = await LinkDefaultService.getAllSystemLinks();
        
        LogInfo(req.user.email, 'GET_LINKS_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'get_links_default_success',
            content: links
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_LINKS_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getAllSystemLinkCategories = async (req, res) => {
    try {
        const categories = await LinkDefaultService.getAllSystemLinkCategories();
        
        LogInfo(req.user.email, 'GET_LINKS_DEFAULT_CATEGORIES');
        res.status(200).json({
            success: true,
            message: 'get_links_default_categories_success',
            content: categories
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_LINKS_DEFAULT_CATEGORIES');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getPaginatedSystemLinks = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkDefaultService.getPaginatedSystemLinks(limit, page, req.body);

        LogInfo(req.user.email, 'PAGINATE_LINKS_DEFAULT')
        res.status(200).json({
            success: true,
            message: 'paginate_links_default_success',
            content: links
        });
    } catch (error) {
        
        LogError(req.user.email, 'PAGINATE_LINKS_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.createSystemLink = async (req, res) => {
    try {
        const { url, description, roles, category } = req.body;
        const link = await LinkDefaultService.createSystemLink(url, description, roles, category);
        const data = await LinkDefaultService.getSystemLink(link._id);

        LogInfo(req.user.email, 'CREATE_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'create_link_default_success',
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'CREATE_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getSystemLink = async (req, res) => {
    try {
        var link = await LinkDefaultService.getSystemLink(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'show_link_default_success',
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.editSystemLink = async (req, res) => {
    try {
        const { url, description, roles, category } = req.body;
        const link = await LinkDefaultService.editSystemLink(req.params.id, url, description, roles, category);
        const data = await LinkDefaultService.getSystemLink(link._id);
        
        LogInfo(req.user.email, 'EDIT_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'edit_link_default_success',
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteSystemLink = async (req, res) => {
    try {
        const link = await LinkDefaultService.deleteSystemLink(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'delete_link_default_success',
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};