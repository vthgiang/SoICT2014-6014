const Terms = require('../../../seed/terms');
const {OrganizationalUnit, Company, Role, RoleType, User, UserRole} = require('../../../models').schema

/**
 * Lấy danh sách tất cả các role của 1 công ty
 * @company id công ty
 */
exports.getAllRoles = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    
    if(page === undefined && limit === undefined ){
        
        return await Role
            .find({company})
            .populate([
                { path: 'users', model: UserRole},
                { path: 'parents', model: Role },
                { path: 'type', model: RoleType }
            ]);

    }else{
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {company};
        console.log("option: ", option);
        return await Role.paginate( option , { 
            page, 
            limit,
            populate: [
                { path: 'users', model: UserRole},
                { path: 'parents', model: Role },
                { path: 'type', model: RoleType }
            ]
        });
    }
}


/**
 * Lấy thông tin của 1 role
 * @roleId id role
 */
exports.getRole = async (roleId) => {

    return await Role
        .findById(roleId)
        .populate([
            { path: 'users', model: UserRole, populate:{ path: 'userId', model: User }},
            { path: 'parents', model: Role },
            { path: 'company', model: Company },
            { path: 'type', model: RoleType }
        ]);
}

/**
 * Tạo role do công ty tự định nghĩa
 * @data dữ liệu tạo
 * @companyId id công ty
 */
exports.createRole = async(data, companyId) => {
    const checkRoleCreated = await Role.findOne({name: data.name, company: companyId});
    if(checkRoleCreated !== null) throw ['role_name_exist'];
    const roleTuTao = await RoleType.findOne({ name: Terms.ROLE_TYPES.COMPANY_DEFINED });
    const role = await Role.create({
        name: data.name,
        company: companyId,
        parents: data.parents,
        type: roleTuTao._id
    });

    return role;
}

/**
 * Tạo root role cho công ty
 * @data dữ liệu tạo
 * @companyID id công ty
 */
exports.createRootRole = async(data, companyID) => {
    const rootRole = await RoleType.findOne({ name: Terms.ROLE_TYPES.ROOT });
    const check = await Role.findOne({name: data.name, company: companyID}); 
    if(check !== null) throw ('role_name_exist');
    const role = await Role.create({
        name: data.name,
        company: companyID,
        type: rootRole._id,
        parents: data.parents
    });

    return role;
}

/**
 * Tạo các role chức danh của đơn vị
 * @companyID id công ty
 * @data dữ liệu tạo
 */
exports.createRolesForOrganizationalUnit = async(data, companyID) => {
    const checkDean = await Role.findOne({name: data.dean, company: companyID }); if(checkDean !== null) throw ['role_dean_exist'];
    const checkViceDean = await Role.findOne({name: data.dean, company: companyID}); if(checkViceDean !== null) throw ['role_vice_dean_exist'];
    const checkEmployee = await Role.findOne({name: data.dean, company: companyID }); if(checkEmployee !== null) throw ['role_employee_exist'];

    const roleChucDanh = await RoleType.findOne({ name: Terms.ROLE_TYPES.POSITION });
    const deanAb = await Role.findOne({ name: Terms.ROOT_ROLES.DEAN.NAME });
    const viceDeanAb = await Role.findOne({ name: Terms.ROOT_ROLES.VICE_DEAN.NAME });
    const employeeAb = await Role.findOne({ name: Terms.ROOT_ROLES.EMPLOYEE.NAME });

    const employee = await Role.create({
        name: data.employee,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employeeAb._id]
    });
    const viceDean = await Role.create({
        name: data.viceDean,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employee._id, viceDeanAb._id]
    });
    const dean = await Role.create({
        name: data.dean,
        company: companyID,
        type: roleChucDanh._id,
        parents: [employee._id, viceDean._id, deanAb._id]
    });

    return {
        dean, viceDean, employee
    }
}

/**
 * Chỉnh sửa thông tin role
 * @id id role
 * @data dữ liệu chỉnh sửa, mặc định không truyền vào thì là {}
 */
exports.editRole = async(id, data={}) => {
    const role = await Role.findById(id)
        .populate([
            { path: 'users', model: UserRole },
            { path: 'company', model: Company }
        ]);
    if(data.name !== undefined || data.name !== null || data.name !== '')
        role.name = data.name;
    if(data.parents !== undefined || data.parents !== null || data.parents !== '')
        role.parents = data.parents;
    role.save();

    return role;
}

/**
 * Xóa role theo id
 * @id id role
 */
exports.deleteRole = async(id) => {
    const deleteRole = await Role.deleteOne({ _id: id });
    const deleteRelationship = await UserRole.deleteMany({
        roleId: id
    });
    return {
        deleteRole, deleteRelationship
    }
}

/**
 * Tạo mối quan hệ cho user và role
 * @userId id user
 * @roleId id role
 */
exports.createRelationshipUserRole = async (userId, roleId) => { 
    const relationship = await UserRole.create({
        userId,
        roleId
    });
    
    return relationship;
}

/**
 * Chỉnh sửa mối quan hệ giữa user và role
 * @roleId id role
 * @userArr mảng id các user
 */
exports.editRelationshipUserRole = async( roleId, userArr ) => {
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

/**
 * Lấy danh sách tất cả các role cùng phòng ban với role hiện tại
 * @id id role hiện tại
 */
exports.getAllRolesInSameOrganizationalUnitWithRole = async (id) => {
    const roles = await OrganizationalUnit.findOne({ 
        $or:[
            {'dean':id}, 
            {'viceDean':id}, 
            {'employee':id}
        ]  
    }).populate([
        {path:'dean'}, 
        {path:'viceDean'}, 
        {path:'employee'}]
    );
    
    return roles;
}



