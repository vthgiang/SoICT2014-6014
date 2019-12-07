const Role = require('../../models/role.model');

exports.get = async (req, res) => {

    return await Role.find();
}

exports.getById = async (req, res) => {

    return await Role.findById(req.params.id);
}

exports.create = async(req, res) => {

    return await Role.create({
        name: req.body.name,
        company: req.body.company,
        users: req.body.users,
        abstract: req.body.abstract
    });
}

exports.edit = async(req, res) => {
    var role = await Role.findById(req.params.id);
    role.name = req.body.name;
    role.users = req.body.users;
    role.abstract = req.body.abstract;
    role.save();

    return role;
}

exports.delete = async(req, res) => {
    
    return await Role.deleteOne({ _id: req.params.id });
}