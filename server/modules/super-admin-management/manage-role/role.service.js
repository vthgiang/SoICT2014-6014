const Role = require('../../../models/role.model');
const RoleType = require('../../../models/role_type.model');
const User = require('../../../models/user.model');
const UserRole = require('../../../models/user_role.model');
const Company = require('../../../models/company.model');

//lay tat ca role cua 1 cong ty
exports.get = async (company) => {
    return await Role.find({company});
}

exports.getPaginate = async (company, limit, page) => {
    return await Role
        .paginate({company}, { 
            page, 
            limit,
            populate: { path: 'users', model: UserRole}
        });
}

exports.getById = async (company, roleId) => {

    return await Role
        .findOne({
            company,
            _id: roleId
        })
        .populate([
            { path: 'users', model: UserRole },
            { path: 'company', model: Company },
            { path: 'type', model: RoleType }
        ]);
}

exports.create = async(data) => {
    var roleTuTao = await RoleType.find({ name: 'tutao' });
    return await Role.create({
        name: data.name,
        company: data.company,
        abstract: data.abstract,
        type: roleTuTao._id
    });
}

exports.createAbstract = async(data) => {
    var roleAbstract = await RoleType.find({ name: 'abstract' });

    return await Role.create({
        name: data.name,
        company: data.company,
        type: roleAbstract._id,
        abstract: data.abstract
    });
}

exports.crt_rolesOfDepartment = async(data) => {
    var roleChucDanh = await RoleType.find({ name: 'chucdanh' });
    var employee = await Role.create({
        name: data.employee,
        company: data.company,
        type: roleChucDanh._id,
        abstract: []
    });
    var vice_dean = await Role.create({
        name: data.vice_dean,
        company: data.company,
        type: roleChucDanh._id,
        abstract: [employee._id]
    });
    var dean = await Role.create({
        name: data.dean,
        company: data.company,
        type: roleChucDanh._id,
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

