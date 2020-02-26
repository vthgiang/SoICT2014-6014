const PrivilegeService = require('./privilege.service');
const { Logger } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var roles = await PrivilegeService.get(req, res);
        
        isLog && Logger.info(`[GET_PRIVILEGES]`+req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        isLog && Logger.error(`[GET_PRIVILEGES]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await PrivilegeService.create(req, res);

        isLog && Logger.info(`[CREATE_PRIVILEGE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(`[CREATE_PRIVILEGE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await PrivilegeService.getById(req, res);
        
        isLog && Logger.info(`[SHOW_PRIVILEGE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(`[SHOW_PRIVILEGE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await PrivilegeService.edit(req, res);
        
        isLog && Logger.info(`[EDIT_PRIVILEGE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(`[EDIT_PRIVILEGE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await PrivilegeService.delete(req, res);
        
        isLog && Logger.info(`[DELETE_PRIVILEGE]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(`[DELETE_PRIVILEGE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.addRoleToLink = async (req, res) => {
    try {
        var role = await PrivilegeService.addRoleToLink(req.body.idLink, req.body.idRole);
        
        isLog && Logger.info(`[ADD_ROLE_TO_LINK]`+req.user.email);
        res.status(200).json(role);
    } catch (error) {
        
        isLog && Logger.error(`[ADD_ROLE_TO_LINK]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.getLinksOfRole = async (req, res) => {
    try {
        console.log("GET LINK OF ROLE")
        var links = await PrivilegeService.getLinksOfRole(req.params.idRole);
        
        isLog && Logger.info(`[GET_LINKS_OF_ROLE]`+req.user.email);
        res.status(200).json(links);
    } catch (error) {
        
        isLog && Logger.error(`[GET_LINKS_OF_ROLE]`+req.user.email);
        res.status(400).send(error);
    }
};