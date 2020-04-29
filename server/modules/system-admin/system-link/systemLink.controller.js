const SystemLinkServices = require('./systemLink.service');
const {LogInfo, LogError} =  require('../../../logs');

exports.getAllSystemLinks = async (req, res) => {
    try {
        var links = await SystemLinkServices.getAllSystemLinks();
        
        LogInfo(req.user.email, 'GET_LINKS_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_links_default_success'],
            content: links
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_LINKS_DEFAULT');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getAllSystemLinkCategories = async (req, res) => {
    try {
        const categories = await SystemLinkServices.getAllSystemLinkCategories();
        
        LogInfo(req.user.email, 'GET_LINKS_DEFAULT_CATEGORIES');
        res.status(200).json({
            success: true,
            messages: ['get_links_default_categories_success'],
            content: categories
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_LINKS_DEFAULT_CATEGORIES');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getPaginatedSystemLinks = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await SystemLinkServices.getPaginatedSystemLinks(limit, page, req.body);

        LogInfo(req.user.email, 'PAGINATE_LINKS_DEFAULT')
        res.status(200).json({
            success: true,
            messages: ['paginate_links_default_success'],
            content: links
        });
    } catch (error) {
        
        LogError(req.user.email, 'PAGINATE_LINKS_DEFAULT');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.createSystemLink = async (req, res) => {
    try {
        
        const { url, description, roles, category } = req.body;
        const link = await SystemLinkServices.createSystemLink(url, description, roles, category);
        
        const data = await SystemLinkServices.getSystemLink(link._id);
        
        LogInfo(req.user.email, 'CREATE_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['create_system_link_success'],
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'CREATE_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getSystemLink = async (req, res) => {
    try {
        var link = await SystemLinkServices.getSystemLink(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['show_link_default_success'],
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.editSystemLink = async (req, res) => {
    try {
        const { url, description, roles, category } = req.body;
        const link = await SystemLinkServices.editSystemLink(req.params.id, url, description, roles, category);
        const data = await SystemLinkServices.getSystemLink(link._id);
        
        LogInfo(req.user.email, 'EDIT_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            messages: 'edit_system_link_success',
            content: data
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.deleteSystemLink = async (req, res) => {
    try {
        const link = await SystemLinkServices.deleteSystemLink(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_LINK_DEFAULT');
        res.status(200).json({
            success: true,
            messages: 'delete_system_link_success',
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_LINK_DEFAULT');
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};