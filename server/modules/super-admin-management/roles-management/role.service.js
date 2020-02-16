const Role = require('../../../models/role.model');
const RoleType = require('../../../models/role_type.model');
const User = require('../../../models/user.model');
const UserRole = require('../../../models/user_role.model');
const Company = require('../../../models/company.model');

//lay tat ca role cua 1 cong ty
exports.get = async (company) => {
    return await Role
        .find({company})
        .populate([
            { path: 'type', model: RoleType }
        ]);
}

exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    console.log("DATA: ", newData);
    return await Role
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                { path: 'users', model: UserRole},
                { path: 'type', model: RoleType }
            ]
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

exports.create = async(data, companyID) => {
    var roleTuTao = await RoleType.findOne({ name: 'tutao' });
    return await Role.create({
        name: data.name,
        company: companyID,
        abstract: data.abstract,
        type: roleTuTao._id
    });
}

exports.createAbstract = async(data, companyID) => {
    var roleAbstract = await RoleType.findOne({ name: 'abstract' });

    return await Role.create({
        name: data.name,
        company: companyID,
        type: roleAbstract._id,
        abstract: data.abstract
    });
}

exports.crt_rolesOfDepartment = async(data, companyID) => {
    var roleChucDanh = await RoleType.findOne({ name: 'chucdanh' });
    var employee = await Role.create({
        name: data.employee,
        company: companyID,
        type: roleChucDanh._id,
        abstract: []
    });
    var vice_dean = await Role.create({
        name: data.vice_dean,
        company: companyID,
        type: roleChucDanh._id,
        abstract: [employee._id]
    });
    var dean = await Role.create({
        name: data.dean,
        company: companyID,
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

