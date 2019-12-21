const Role = require('../../models/role.model');
const User = require('../../models/user.model');
const UserRole = require('../../models/user_role.model');
const Company = require('../../models/company.model');

//lay tat ca role cua 1 cong ty
exports.get = async (company) => {

    return await Role
        .find({ company }) //id cua cong ty 
        .populate({ path: 'users', model: UserRole });
}

exports.getById = async (id) => {

    return await Role
        .findById(id)
        .populate([
            { path: 'users', model: UserRole },
            { path: 'company', model: Company },
            // { path: 'abstract', model: Role }
        ]);
}

exports.create = async(data) => {

    return await Role.create({
        name: data.name,
        company: data.company,
        abstract: data.abstract
    });
}

exports.edit = async(id, data) => {
    var role = await Role.findById(id);
    role.name = data.name;
    role.abstract = data.abstract;
    role.save();

    return role;
}

exports.delete = async(id) => {
    
    return await Role.deleteOne({ _id: id });
}

exports.relationshipUserRole = async (userId, roleId) => { 
    var relationship = await UserRole.create({
        userId,
        roleId
    });
    
    return relationship;
}

