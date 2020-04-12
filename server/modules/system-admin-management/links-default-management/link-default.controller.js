const LinkDefaultService = require('./link-default.service');
const {LogInfo, LogError} =  require('../../../logs');

exports.get = async (req, res) => {
    try {
        var links = await LinkDefaultService.get();
        
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

exports.getCategories = async (req, res) => {
    try {
        const categories = await LinkDefaultService.getCategories();
        
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

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkDefaultService.getPaginate(limit, page, req.body);

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

exports.create = async (req, res) => {
    try {
        var { url, description, roles } = req.body;
        var link = await LinkDefaultService.create(url, description, roles);
        var data = await LinkDefaultService.show(link._id);

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

exports.show = async (req, res) => {
    try {
        var link = await LinkDefaultService.show(req.params.id);
        
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

exports.edit = async (req, res) => {
    try {
        var { url, description, roles } = req.body;
        var link = await LinkDefaultService.edit(req.params.id, url, description, roles);
        var data = await LinkDefaultService.show(link._id);
        
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

exports.delete = async (req, res) => {
    try {
        var link = await LinkDefaultService.delete(req.params.id);
        
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