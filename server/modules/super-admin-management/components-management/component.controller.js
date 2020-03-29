const ComponentService = require('./component.service');
const LinkServices = require('../links-management/link.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var roles = await ComponentService.get(req.user.company._id);
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var components = await ComponentService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty
        
        res.status(200).json(components);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        req.body.company = req.user.company._id;
        var createComponent = await ComponentService.create(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        var component = await ComponentService.getById(createComponent._id);
        await LinkServices.addComponentOfLink(req.body.linkId, createComponent._id); //thêm component đó vào trang

        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await ComponentService.getById(req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        var component = await ComponentService.edit(req.params.id, req.body);
        
        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await ComponentService.delete(req.params.id );
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

//Lấy tất cả các component của user với trang web hiện tại
exports.getComponentsOfUserInLink = async (req, res) => {
    try {
        var components  = await ComponentService.getComponentsOfUserInLink(req.params.roleId, req.params.linkId);
        
        res.status(200).json(components);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

