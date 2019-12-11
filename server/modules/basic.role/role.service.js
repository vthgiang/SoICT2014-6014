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
    var role = await Role.updateOne({ _id: id },{
        '$set': {
            name: data.name,
            users: data.users,
            abstract: data.abstract
        }
    });
    console.log("role end: ", role);

    return role;
}

exports.delete = async(id) => {
    
    return await Role.deleteOne({ _id: id });
}