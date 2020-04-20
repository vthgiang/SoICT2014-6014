const PrivilegeService = require('./privilege.service');
const { LogInfo, LogError } = require('../../../logs');


// TODO: Xóa bớt các phương thức không dùng???
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
        var role = await PrivilegeService.addLinkThatRoleCanAccess(req.body.idLink, req.body.idRole);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getLinksRoleCanAccess = async (req, res) => {
    try {
        var links = await PrivilegeService.getLinksRoleCanAccess(req.params.idRole);
        
        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).json(error);
    }
};