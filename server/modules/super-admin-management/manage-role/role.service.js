const Role = require('../../../models/role.model');
const User = require('../../../models/user.model');
const UserRole = require('../../../models/user_role.model');
const Company = require('../../../models/company.model');

//lay tat ca role cua 1 cong ty
exports.get = async (company) => {

    return await Role
        .find({ company }) //id cua cong ty 
        .limit(10)
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
        abstract: data.abstract,
        isAbstract: false
    });
}

exports.createAbstract = async(data) => {

    return await Role.create({
        name: data.name,
        company: data.company,
        abstract: data.abstract
    });
}

exports.crt_rolesOfDepartment = async(data) => {
    var employee = await Role.create({
        name: data.employee,
        company: data.company,
        abstract: []
    });
    var vice_dean = await Role.create({
        name: data.vice_dean,
        company: data.company,
        abstract: [employee._id]
    });
    var dean = await Role.create({
        name: data.dean,
        company: data.company,
        abstract: [employee._id, vice_dean._id]
    });

    return {
        dean, vice_dean, employee
    }
}

exports.edit = async(id, data) => {
    var role = await Role.findById(id)
        .populate([
            { path: 'users', model: UserRole },
            { path: 'company', model: Company },
            // { path: 'abstract', model: Role }
        ]);
    role.name = data.name;
    role.abstract = data.abstract;
    role.save();

    return role;
}

exports.delete = async(id) => {
    var deleteRole = await Role.deleteOne({ _id: id });
    var deleteRelationship = await UserRole.deleteMany({
        roleId: id
    });
    return {
        deleteRole, deleteRelationship
    }
}

exports.relationshipUserRole = async (userId, roleId) => { 
    var relationship = await UserRole.create({
        userId,
        roleId
    });
    
    return relationship;
}

exports.editRelationshiopUserRole = async( roleId, userArr ) => {
    //Nhận đầu vào là id của role cần edit và mảng các user mới sẽ có role đó
    await UserRole.deleteMany({
        roleId: roleId
    });
    var ur1 = await UserRole.find();
    var user_role = userArr.map( user => {
        return {
            roleId: roleId,
            userId: user
        };
    })
    var relationshipUpdated = await UserRole.insertMany(user_role);
    var ur2 = await UserRole.find();
    return {
        ur1,
        ur2,
        relationshipUpdated
    };
}

