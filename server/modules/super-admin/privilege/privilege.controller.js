const PrivilegeService = require('./privilege.service');
const { LogInfo, LogError } = require('../../../logs');


// TODO: Xóa bớt các phương thức không dùng???
exports.getAllPriveleges = async (req, res) => {
    try {
        var roles = await PrivilegeService.getAllPriveleges(req, res);
        
        res.status(200).json(roles);
    } catch (error) {

        res.status(400).json(error);
    }
};

exports.createPrivelege = async (req, res) => {
    try {
        var role = await PrivilegeService.createPrivelege(req, res);

        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getPrivelege = async (req, res) => {
    try {
        var role = await PrivilegeService.Privelege(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.editPrivelege = async (req, res) => {
    try {
        var role = await PrivilegeService.editPrivelege(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.deletePrivelege = async (req, res) => {
    try {
        var role = await PrivilegeService.deletePrivelege(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.addLinkThatRoleCanAccess = async (req, res) => {
    try {
        var role = await PrivilegeService.addLinkThatRoleCanAccess(req.body.idLink, req.body.idRole);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getLinksThatRoleCanAccess = async (req, res) => {
    try {
        var links = await PrivilegeService.getLinksThatRoleCanAccess(req.params.idRole);
        
        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).json(error);
    }
};