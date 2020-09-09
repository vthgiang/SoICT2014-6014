const Terms = require('../../../seed/terms');
const {OrganizationalUnit, Company, Role, RoleType, User, UserRole, Privilege} = require('../../../models').schema

/**
 * Lấy danh sách tất cả các role của 1 công ty
 * @company id công ty
 */
exports.getRoles = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    var roleId = query.roleId;
    
    if (!page && !limit && !roleId) {
        return await Role
            .find({company})
            .populate([
                { path: 'users', model: UserRole, populate: {path: 'userId', model: User}},
                { path: 'parents', model: Role },
                { path: 'type', model: RoleType }
            ]);
    } else if (page && limit && !roleId) {
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {company};
        console.log("option: ", option);
        return await Role.paginate( option , { 
            page, 
            limit,
            populate: [
                { path: 'users', model: UserRole, populate: {path: 'userId', model: User}},
                { path: 'parents', model: Role },
                { path: 'type', model: RoleType }
            ]
        });
    } else if (!page && !limit && roleId) {
        const roles = await OrganizationalUnit.findOne({ 
            $or:[
                { 'deans': roleId }, 
                { 'viceDeans': roleId }, 
                { 'employees': roleId }
            ]  
        }).populate([
            { path: 'deans' }, 
            { path: 'viceDeans' }, 
            { path: 'employees' },
        ]);
    
        return roles;
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

    if (checkRoleCreated) {
        throw ['role_name_exist'];
    }

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

    if (check !== null) {
        throw ('role_name_exist');
    }

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
    console.log("Data: ", data)
    const filterValidRoleArray = async (array, companyId) => {
        let resArray= [];
        if (array.length > 0) {
            let checkRoleValid = await Role.findOne({name: {$in: data.deans}, company: companyId });

            if (checkRoleValid) {
                throw ['role_name_exist'];
            }

            for (let i = 0; i < array.length; i++) {
                if(array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const roleChucDanh = await RoleType.findOne({ name: Terms.ROLE_TYPES.POSITION });
    const deanAb = await Role.findOne({ name: Terms.ROOT_ROLES.DEAN.name });
    const viceDeanAb = await Role.findOne({ name: Terms.ROOT_ROLES.VICE_DEAN.name });
    const employeeAb = await Role.findOne({ name: Terms.ROOT_ROLES.EMPLOYEE.name });

    const employeeArr = await filterValidRoleArray(data.employees, companyID);
    console.log('employeeArr:', employeeArr)
    const dataEmployee = employeeArr.map(em=>{
        return {
            name: em,
            company: companyID,
            type: roleChucDanh._id,
            parents: [employeeAb._id]
        }
    }); 
    const employees = dataEmployee.length > 0? await Role.insertMany(dataEmployee): [];

    const viceDeanArr = await filterValidRoleArray(data.viceDeans, companyID);
    console.log('viceDeanArr:', viceDeanArr)
    const dataViceDean = viceDeanArr.map(vice=>{
        return {
            name: vice,
            company: companyID,
            type: roleChucDanh._id,
            parents: [...employees.map(em=>em._id), viceDeanAb._id]
        }
    }); 
    const viceDeans = dataViceDean.length > 0 ? await Role.insertMany(dataViceDean) : [];

    const deanArr = await filterValidRoleArray(data.deans, companyID);
    console.log('deanArr:', deanArr)
    const dataDean = deanArr.map(dean=>{
        return {
            name: dean,
            company: companyID,
            type: roleChucDanh._id,
            parents: [...employees.map(em=>em._id), ...viceDeans.map(vice=>vice._id), deanAb._id]
        }
    }); 
    const deans = dataDean.length > 0? await Role.insertMany(dataDean): [];

    return {
        deans, viceDeans, employees // danh sách các mảng các chức danh đã tạo
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
 * Chỉnh sửa thông tin role
 * @id id role
 * @data dữ liệu chỉnh sửa, mặc định không truyền vào thì là {}
 */
exports.editRole = async(id, data={}) => {
    const role = await Role.findById(id);

    if(data.name && data.name !== ''){
        role.name = data.name;
    }

    if(data.parents && data.parents !== ''){
        role.parents = data.parents;
    }

    await role.save();

    return role;
}

/**
 * Chỉnh sửa mối quan hệ giữa user và role
 * @roleId id role
 * @userArr mảng id các user
 */
exports.editRelationshipUserRole = async( roleId, userArr=[] ) => {
    const check = await Role.findById(roleId);
    if(!check) throw ['role_not_found'];

    await UserRole.deleteMany({
        roleId: roleId
    });
    if(userArr.length > 0){
        const user_role = userArr.map( user => {
            return {
                roleId: roleId,
                userId: user
            };
        })
        return await UserRole.insertMany(user_role);
    }
}


/**
 * Xóa role theo id
 * @id id role
 * 1. Xóa role
 * 2. Xóa thông tin liên quan của các role kế thừa role hiện tại
 * 3. Xóa thông tin trong UserRole
 * 4. Xóa thông tin trong Privilege
 * 5. Xóa thông tin trong OrganizationalUnit (nếu có)
 */
exports.deleteRole = async(id) => {
    await Role.deleteOne({ _id: id });
    const roles = await Role.find({parents: id});

    for (let i = 0; i < roles.length; i++) {
        const role = await Role.findById(roles[i]._id);
        role.parents.splice(role.parents.indexOf(roles[i]._id),1);
        await role.save();
    }
    await UserRole.deleteMany({roleId: id});
    await Privilege.deleteMany({roleId: id});
    const organD = await OrganizationalUnit.findOne({deans: id});
    if (organD) {
        organD.deans.splice(organD.deans.indexOf(id));
        await organD.save();
    }

    const organV = await OrganizationalUnit.findOne({viceDeans: id});
    if (organV) {
        organV.viceDeans.splice(organV.viceDeans.indexOf(id));
        await organV.save();
    }

    const organE = await OrganizationalUnit.findOne({employees: id});
    if (organE) {
        organE.employees.splice(organE.employees.indexOf(id));
        await organE.save();
    }

    return id; // trả về id của role vừa xóa
    
}


