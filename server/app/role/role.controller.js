const RoleService = require('./role.service');

exports.get = async (req, res) => {
    try {
        var roles = await RoleService.get(req, res);
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await RoleService.create(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await RoleService.getById(req, res);
        
        res.status(200).json(role)
    } catch (error) {
        
        res.status(400).json({
            msg: `Get company info error : ${error}`
        })
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await RoleService.edit(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await RoleService.delete(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
