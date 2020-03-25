const UserService = require('./user.service');
const { Log } = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET USERS');
    try {
        var users = await UserService.get(req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(users);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.getPaginate = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET PAGINATE USERS');
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var roles = await UserService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        isLog && Logger.info(req.user.email);
        res.status(200).json(roles);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE USER');
    try {
        var user = await UserService.create(req.body, req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(user);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW USER');
    try {
        var user = await UserService.getById(req.params.id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(user)
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT USER');
    try {
        var user = await UserService.edit(req.params.id, req.body);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(user);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE USER');
    try {
        var deleteUser = await UserService.delete(req.params.id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(deleteUser);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.searchByName = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SEARCH USER BY NAME');
    try {
        var users = await UserService.searchByName(req.user.company._id, req.body.username);

        isLog && Logger.info(req.user.email);
        res.status(200).json(users);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.getUsersSameDepartment = (req, res) => {
    return UserService.getUsersSameDepartment(req, res);
}

exports.getUsersOfDepartment = (req, res) => {
    return UserService.getUsersOfDepartment(req, res);
}