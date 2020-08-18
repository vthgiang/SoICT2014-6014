const LinkService = require('./link.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getLinks = async (req, res) => {
    try {
        let {company} = req.query;
        let links = await LinkService.getLinks(company, req.query);
 
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
            messages: Array.isArray(error) ? error : ['get_links_faile'],
            content: error
        });
    }
};

exports.getLink = async (req, res) => {
    try {
        let link = await LinkService.getLink(req.params.id);
        
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
            messages: Array.isArray(error) ? error : ['show_link_faile'],
            content: error
        });
    }
};

exports.createLink = async (req, res) => {
    try {
        let {company} = req.query;
        let createLink = await LinkService.createLink(req.body, company);
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        let link = await LinkService.getLink(createLink._id);

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
            messages: Array.isArray(error) ? error : ['create_link_faile'],
            content: error
        });
    }
};

exports.editLink = async (req, res) => {
    try {
        await LinkService.relationshipLinkRole(req.params.id, req.body.roles);
        let link = await LinkService.editLink(req.params.id, req.body);
        let data = await LinkService.getLink(link._id);
        
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
            messages: Array.isArray(error) ? error : ['edit_link_faile'],
            content: error
        });
    }
};

exports.deleteLink = async (req, res) => {
    try {
        let {id} = req.params;
        let {type} = req.query; 
        let link = await LinkService.deleteLink(id, type);
        
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
            messages: Array.isArray(error) ? error : ['delete_link_faile'],
            content: error
        });
    }
};

exports.getLinkCategories = async (req, res) => {
    try {
        let content = await LinkService.getLinkCategories();

        await LogInfo(req.user.email, 'GET_ALL_LINK_CATEGORIES');
        res.status(200).json({
            success: true,
            messages: ['get_all_link_categories_success'],
            content
        });
    } catch (error) {
        await LogInfo(req.user.email, 'GET_ALL_LINK_CATEGORIES');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_link_categories_faile'],
            content: error
        });
    }
};

exports.updateCompanyLinks = async (req, res) => {
    try {
        let data = req.body;
        let content = await LinkService.updateCompanyLinks(data);

        await LogInfo(req.user.email, 'UPDATE_COMPANY_LINKS');
        res.status(200).json({
            success: true,
            messages: ['update_company_links_success'],
            content
        });
    } catch (error) {
        await LogInfo(req.user.email, 'UPDATE_COMPANY_LINKS');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['update_company_links_faile'],
            content: error
        });
    }
};