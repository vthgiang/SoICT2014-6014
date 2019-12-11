const RoleService = require('./role.service');

exports.get = async (req, res) => {
    try {
        var roles = await RoleService.get(req.params.idCompany); //truyen vao id cua cong ty
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await RoleService.create(req.body);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await RoleService.getById(req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await RoleService.edit(req.params.id, req.body);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await RoleService.delete(req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
