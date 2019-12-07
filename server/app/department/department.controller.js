const DepartmentService = require('./department.service');

exports.get = async (req, res) => {
    try {
        var roles = await DepartmentService.get(req, res);
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await DepartmentService.create(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await DepartmentService.getById(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await DepartmentService.edit(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await DepartmentService.delete(req, res);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
