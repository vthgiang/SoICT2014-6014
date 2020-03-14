const PrivilegeService = require('./privilege.service');
const { Log } = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET PRIVILEGE');
    try {
        var roles = await PrivilegeService.get(req, res);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(roles);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE PRIVILEGE');
    try {
        var role = await PrivilegeService.create(req, res);

        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW PRIVILEGE');
    try {
        var role = await PrivilegeService.getById(req, res);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT PRIVILEGE');
    try {
        var role = await PrivilegeService.edit(req, res);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE PRIVILEGE');
    try {
        var role = await PrivilegeService.delete(req, res);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.addRoleToLink = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'ADD ROLE TO LINK');
    try {
        var role = await PrivilegeService.addRoleToLink(req.body.idLink, req.body.idRole);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.getLinksOfRole = async (req, res) => {
    console.log("get link of rolle")
    const Logger = await Log(req.user.company.short_name, 'GET LINKS OF ROLE');
    try {
        var links = await PrivilegeService.getLinksOfRole(req.params.idRole);
        
        isLog && await Logger.info(req.user.email);
        res.status(200).json(links);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};