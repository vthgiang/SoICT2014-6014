const { OrganizationalUnit, UserRole, Role } = require('../../../models').schema;
const arrayToTree = require('array-to-tree');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Lấy danh sách các đơn vị trong công ty
 * @id id công ty
 */
exports.getOrganizationalUnits = async (id) => {
    return await OrganizationalUnit
        .find({ company: id })
        .populate([
            { path: 'dean', model: Role },
            { path: 'viceDean', model: Role },
            { path: 'employee', model: Role }
        ]);
}

/**
 * Lấy thông tin các đơn vị của công ty theo dạng CÂY 
 * @id id công ty
 */
exports.getOrganizationalUnitsAsTree = async (id) => {
    const data = await OrganizationalUnit.find({ company: id }).populate([
        { path: 'dean', model: Role },
        { path: 'viceDean', model: Role },
        { path: 'employee', model: Role }
    ]);;
    
    const newData = data.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            dean:department.dean.name,
            viceDean:department.viceDean.name,
            employee:department.employee.name,
            parent_id: department.parent !== null ? department.parent.toString() : null
        }
    });
    const tree = await arrayToTree(newData);

    return tree;
}

/**
 * Lấy thông tin đơn vị theo id
 * @id đơn vị
 */
exports.getOrganizationalUnit = async (id) => {

    return await OrganizationalUnit.findById(id);
}

/**
 * Tạo đơn vị 
 * @data thông tin về đơn vị
 * @deanId id của trưởng đơn vị
 * @viceDeanId id phó đơn vị
 * @employeeId id nhân viên đơn vị
 * @companyID id công ty
 */
exports.createOrganizationalUnit = async(data, deanId, viceDeanId, employeeId, companyID) => {
    const check = await OrganizationalUnit.findOne({name: data.name, company: companyID});
    if(check !== null) throw['department_name_exist'];
    const department = await OrganizationalUnit.create({
        name: data.name,
        description: data.description,
        company: companyID,
        dean: deanId,
        viceDean: viceDeanId,
        employee: employeeId,
        parent: ObjectId.isValid(data.parent) ? data.parent : null
    });

    return department;
}

/**
 * Chỉnh sửa thông tin đơn vị
 * @id id đơn vị
 * @data dữ liệu sửa
 */
exports.editOrganizationalUnit = async(id, data) => {
    const department = await OrganizationalUnit.findById(id);
    if(department === null) throw['department_not_found'];
    department.name = data.name;
    department.description = data.description;
    department.parent = ObjectId.isValid(data.parent) ? data.parent : null
    await department.save();

    return department;
}

/**
 * Xóa đơn vị
 * @departmentId id của đơn vị
 */
exports.deleteOrganizationalUnit = async(departmentId) => {
    const department = await OrganizationalUnit.findById(departmentId);

    const roles = await Role.find({
        _id: { $in: [department.dean, department.viceDean, department.employee]}
    });

    const userroles = await UserRole.find({
        roleId: { $in: roles.map(role=>role._id)}
    });
    
    if(userroles.length === 0){

        await Role.deleteMany({
            _id: { $in: roles.map(role=>role._id)}
        });

        if(department.parent !== undefined || department.parent !== null){
            await OrganizationalUnit.updateMany({ 
                parent: department._id
            },{
                $set :{ parent: department.parent }
            }); 

            return await OrganizationalUnit.deleteOne({ _id: departmentId });
        }
    }else{
        throw ['department_has_user'];
    }
}


/**
 * SERVICE: Lấy thông tin của đơn vị và các role trong đơn vị đó của user
 * Chi tiết dữ liệu trả về:
 * 1. Thông tin về đơn vị
 * 2. Thông tin về các vai trò trong đơn vị (Trưởng dv, Phó dv, Nhân viên dv)
 * 3. Id của các user tương ứng với từng vai trò của đơn vị
 * --------------------------------------
 * Thông tin xác định dựa trên 3 tham số
 * 1. companyId - tìm kiếm trong phạm vi công ty của người dùng
 * 2. userId - id của người dùng
 * 3. roleId - xác định vai trò truy cập hiện tại của người dùng trên website (vd: đang truy cập với quyền là Nhân viên phòng hành chính,...)
 */
exports.getOrganizationalUnitByUserRole = async (companyId, roleId) => {
    const department = await OrganizationalUnit.findOne({
        $or: [
            {'dean': roleId, company: companyId }, 
            {'viceDean': roleId, company: companyId }, 
            {'employee': roleId, company: companyId }
        ]
    }).populate([
        { path: 'dean', model: Role, populate: { path: 'users', model: UserRole} },
        { path: 'viceDean', model: Role, populate: { path: 'users', model: UserRole}  },
        { path: 'employee', model: Role, populate: { path: 'users', model: UserRole}  }
    ]);

    return department;
}

/**
 * Lấy thông tin đơn vị mà user làm trưởng
 * @userId id của user
 */
exports.getOrganizationalUnitsThatUserIsDean = async (userId) => {
    const roles = await UserRole.find({ 'userId': userId });
    const newRoles = roles.map( role => role.roleId);
    const departments = await OrganizationalUnit.find({'dean': { $in: newRoles } });
    return departments;
}