const UserService = require('./user.service');

exports.get = async (req, res) => {
    try {
        console.log("ID company: ", req.params.idCompany);
        var users = await UserService.get(req.params.idCompany);

        res.status(200).json(users);
    } catch (error) {
        
        res.status(400).json(error)
    }
};

exports.create = async (req, res) => {
    try {
        var user = await UserService.create(req.body);

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
