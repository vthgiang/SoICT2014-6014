const Role = require('../../../models/auth/role.model');
const RoleType = require('../../../models/super-admin/roleType.model');
const User = require('../../../models/auth/user.model');
const UserRole = require('../../../models/auth/userRole.model');
const Company = require('../../../models/system-admin/company.model');
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

// Tìm kiếm role theo cấu trúc dữ liệu cụ thể nào đó
exports.getByData = async (data) => {

    return await Role
        .findOne(data)
        .populate([
            { path: 'users', model: UserRole, populate:{ path: 'userId', model: User }},
            { path: 'parents', model: Role },
            { path: 'company', model: Company },
            { path: 'type', model: RoleType }
        ]);
}

exports.create = async(data, companyID) => {
    const roleTuTao = await RoleType.findOne({ name: Terms.ROLE_TYPES.COMPANY_DEFINED });
    const role = await Role.create({
        name: data.name,
        company: companyID,
        parents: data.parents,
        type: roleTuTao._id
    });

    return role;
}

exports.createAbstract = async(data, companyID) => {
    const roleAbstract = await RoleType.findOne({ name: Terms.ROLE_TYPES.ABSTRACT });
    const check = await Role.findOne({name: data.name, company: companyID}); 
    if(check !== null) throw ('role_name_exist');
    const role = await Role.create({
        name: data.name,
        company: companyID,
        type: roleAbstract._id,
        parents: data.parents
    });

    return role;
}

exports.crt_rolesOfDepartment = async(data, companyID) => {
    const checkDean = await Role.findOne({name: data.dean, company: companyID }); if(checkDean !== null) throw ({message: 'role_dean_exist'});
    const checkViceDean = await Role.findOne({name: data.dean, company: companyID}); if(checkViceDean !== null) throw ({message: 'role_vice_dean_exist'});
    const checkEmployee = await Role.findOne({name: data.dean, company: companyID }); if(checkEmployee !== null) throw ({message: 'role_employee_exist'});

    const roleChucDanh = await RoleType.findOne({ name: Terms.ROLE_TYPES.POSITION });
    const deanAb = await Role.findOne({ name: Terms.PREDEFINED_ROLES.DEAN.NAME }); //lấy role dean abstract
    const viceDeanAb = await Role.findOne({ name: Terms.PREDEFINED_ROLES.VICE_DEAN.NAME }); //lấy role vice dean abstract
    const employeeAb = await Role.findOne({ name: Terms.PREDEFINED_ROLES.EMPLOYEE.NAME }); //lấy role employee abstract

    const employee = await Role.create({
        name: data.employee,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employeeAb._id]
    });
    const vice_dean = await Role.create({
        name: data.vice_dean,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employee._id, viceDeanAb._id]
    });
    const dean = await Role.create({
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
    const role = await Role.findById(id)
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
    const deleteRole = await Role.deleteOne({ _id: id });
    const deleteRelationship = await UserRole.deleteMany({
        roleId: id
    });
    return {
        deleteRole, deleteRelationship
    }
}

exports.relationshipUserRole = async (userId, roleId) => { 
    const relationship = await UserRole.create({
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
    const ur1 = await UserRole.find();
    const user_role = userArr.map( user => {
        return {
            roleId: roleId,
            userId: user
        };
    })
    const relationshipUpdated = await UserRole.insertMany(user_role);
    const ur2 = await UserRole.find();
    return {
        ur1,
        ur2,
        relationshipUpdated
    };
}
exports.getRoleSameDepartment = async (id) => {
    const roles = await Department.findOne({ 
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



