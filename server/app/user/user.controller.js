const UserService = require('./user.service');

exports.get = async (req, res) => {
    try {
        var users = await UserService.get(req, res);

        res.status(200).json(users);
    } catch (error) {
        
        res.status(400).json(error)
    }
};

exports.create = async (req, res) => {
    try {
        var user = await UserService.create(req, res);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error)
    }
};

exports.show = async (req, res) => {
    try {
        var user = await UserService.getById(req, res);

        res.status(200).json(user)
    } catch (error) {
        
        res.status(400).json(error)
    }
};

exports.edit = async (req, res) => {
    try {
        var user = await UserService.edit(req, res);
        
        res.status(200).json(user);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var deleteUser = await UserService.delete(req, res);

        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json(error)
    }
};
