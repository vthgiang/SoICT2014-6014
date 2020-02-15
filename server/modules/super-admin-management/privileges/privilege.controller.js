const PrivilegeService = require('./privilege.service');

exports.get = async (req, res) => {
    try {
        var roles = await PrivilegeService.get(req, res);
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await PrivilegeService.create(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await PrivilegeService.getById(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await PrivilegeService.edit(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await PrivilegeService.delete(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.addRoleToLink = async (req, res) => {
    try {
        var role = await PrivilegeService.addRoleToLink(req.body.idLink, req.body.idRole);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getLinksOfRole = async (req, res) => {
    try {
        var links = await PrivilegeService.getLinksOfRole(req.params.idRole);
        
        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).send(error);
    }
};