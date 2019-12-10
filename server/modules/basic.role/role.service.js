const Role = require('../../models/role.model');
const User = require('../../models/user.model');
const Company = require('../../models/company.model');

//lay tat ca role cua 1 cong ty
exports.get = async (company) => {

    return await Role
        .find({ company }) //id cua cong ty 
    //     .populate([
    //     { path: 'users', model: User },
    //     { path: 'company', model: Company },
    //     { path: 'abstract', model: Role }
    // ]);
}

exports.getById = async (id) => {

    return await Role
        .findById(id)
        .populate([
            { path: 'users', model: User },
            { path: 'company', model: Company },
            // { path: 'abstract', model: Role }
        ]);
}

exports.create = async(data) => {

    return await Role.create({
        name: data.name,
        company: data.company,
        users: data.users,
        abstract: data.abstract
    });
}

exports.edit = async(id, data) => {
    var role = await Role.findById(id);
    role.name = data.name !== null ? data.name : role.name ;
    role.users = data.users !== null ? data.users : role.users;
    role.abstract = data.abstract !== null ? data.abstract : role.abstract;
    role.save();

    return role;
}

exports.delete = async(id) => {
    
    return await Role.deleteOne({ _id: id });
}