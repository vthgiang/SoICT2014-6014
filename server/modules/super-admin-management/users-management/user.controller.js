const UserService = require('./user.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var users = await UserService.get(req.user.company._id);

        res.status(200).json(users);
    } catch (error) {
        
        res.status(400).json(error)
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var roles = await UserService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var user = await UserService.create(req.body, req.user.company._id);

        res.status(200).json(user);
    } catch (error) {

        res.status(400).json(error)
    }
};

exports.show = async (req, res) => {
    try {
        var user = await UserService.getById(req.params.id);

        res.status(200).json(user)
    } catch (error) {
        
        res.status(400).json(error)
    }
};

exports.edit = async (req, res) => {
    try {
        var user = await UserService.edit(req.params.id, req.body);
        
        res.status(200).json(user);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var deleteUser = await UserService.delete(req.params.id);

        res.status(200).json(deleteUser);
    } catch (error) {

        res.status(400).json(error)
    }
};

exports.searchByName = async (req, res) => {
    try {
        var users = await UserService.searchByName(req.user.company._id, req.body.username);

        res.status(200).json(users);
    } catch (error) {

        res.status(400).json(error)
    }
};

exports.getUsersSameDepartment = (req, res) => {
    return UserService.getUsersSameDepartment(req, res);
}