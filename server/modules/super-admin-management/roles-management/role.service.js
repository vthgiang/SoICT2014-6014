const Role = require('../../../models/role.model');
const RoleType = require('../../../models/role_type.model');
const User = require('../../../models/user.model');
const UserRole = require('../../../models/user_role.model');
const Company = require('../../../models/company.model');
const Terms = require('../../../seed/terms');

//lay tat ca role cua 1 cong ty
exports.get = async (company) => {
    return await Role
        .find({company})
        .populate([
            { path: 'users', model: UserRole},
            { path: 'parents', model: Role },
            { path: 'type', model: RoleType }
        ]);
}

exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Role
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                { path: 'users', model: UserRole, populate:{ path: 'userId', model: User }},
                { path: 'parents', model: Role },
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
            { path: 'users', model: UserRole, populate:{ path: 'userId', model: User }},
            { path: 'parents', model: Role },
            { path: 'company', model: Company },
            { path: 'type', model: RoleType }
        ]);
}

exports.create = async(data, companyID) => {
    var roleTuTao = await RoleType.findOne({ name: Terms.ROLE_TYPES.COMPANY_DEFINED });
    var check = await Role.findOne({name: data.name});
    if(check !== null) throw({message: 'role_name_exist'});
    var role = await Role.create({
        name: data.name,
        company: companyID,
        parents: data.parents,
        type: roleTuTao._id
    });

    return role;
}

exports.createAbstract = async(data, companyID) => {
    var roleAbstract = await RoleType.findOne({ name: Terms.ROLE_TYPES.ABSTRACT });
    const check = await Role.findOne({name: data.name}); 
    if(check !== null) throw ({message: 'role_name_exist'});
    const role = await Role.create({
        name: data.name,
        company: companyID,
        type: roleAbstract._id,
        parents: data.parents
    });

    return role;
}

exports.crt_rolesOfDepartment = async(data, companyID) => {
    var checkDean = await Role.findOne({name: data.dean }); if(checkDean !== null) throw ({message: 'role_dean_exist'});
    var checkViceDean = await Role.findOne({name: data.dean }); if(checkViceDean !== null) throw ({message: 'role_vice_dean_exist'});
    var checkEmployee = await Role.findOne({name: data.dean }); if(checkEmployee !== null) throw ({message: 'role_employee_exist'});

    var roleChucDanh = await RoleType.findOne({ name: Terms.ROLE_TYPES.POSITION });
    var deanAb = await Role.findOne({ name: Terms.PREDEFINED_ROLES.DEAN.NAME }); //lấy role dean abstract
    var viceDeanAb = await Role.findOne({ name: Terms.PREDEFINED_ROLES.VICE_DEAN.NAME }); //lấy role vice dean abstract
    var employeeAb = await Role.findOne({ name: Terms.PREDEFINED_ROLES.EMPLOYEE.NAME }); //lấy role employee abstract

    var employee = await Role.create({
        name: data.employee,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employeeAb._id]
    });
    var vice_dean = await Role.create({
        name: data.vice_dean,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employee._id, viceDeanAb._id]
    });
    var dean = await Role.create({
        name: data.dean,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employee._id, vice_dean._id, deanAb._id]
    });

    return {
        dean, vice_dean, employee
    }
}

exports.edit = async(id, data={}) => {
    var role = await Role.findById(id)
        .populate([
            { path: 'users', model: UserRole },
            { path: 'company', model: Company },
            // { path: 'parents', model: Role }
        ]);
    if(data.name !== undefined || data.name !== null || data.name !== '')
        role.name = data.name;
    if(data.parents !== undefined || data.parents !== null || data.parents !== '')
        role.parents = data.parents;
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
exports.getRoleSameDepartment = async (id) => {
    var roles = await Department.findOne({ 
        $or:[
            {'dean':id}, 
            {'vice_dean':id}, 
            {'employee':id}
        ]  
    }).populate([
        {path:'dean'}, 
        {path:'vice_dean'}, 
        {path:'employee'}]
    );
    
    return roles;
}



