const { Department, UserRole, Role } = require('../../../models').schema;
const arrayToTree = require('array-to-tree');
const ObjectId = require('mongoose').Types.ObjectId;

exports.get = async (id) => {
    return await Department
        .find({ company: id })
        .populate([
            { path: 'dean', model: Role },
            { path: 'vice_dean', model: Role },
            { path: 'employee', model: Role }
        ]);
}

exports.getTree = async (id) => {
    const data = await Department.find({ company: id }).populate([
        { path: 'dean', model: Role },
        { path: 'vice_dean', model: Role },
        { path: 'employee', model: Role }
    ]);;
    
    const newData = data.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            dean:department.dean.name,
            vice_dean:department.vice_dean.name,
            employee:department.employee.name,
            parent_id: department.parent !== null ? department.parent.toString() : null
        }
    });
    const tree = await arrayToTree(newData);

    return tree;
}

exports.getById = async (req, res) => {

    return await Department.findById(req.params.id);
}

exports.create = async(data, deanId, vice_deanId, employeeId, companyID) => {
    const check = await Department.findOne({name: data.name, company: companyID});
    if(check !== null) throw('department_name_exist');
    const department = await Department.create({
        name: data.name,
        description: data.description,
        company: companyID,
        dean: deanId,
        vice_dean: vice_deanId,
        employee: employeeId,
        parent: ObjectId.isValid(data.parent) ? data.parent : null
    });

    return department;
}

exports.edit = async(id, data) => {
    console.log("data department: ", data);
    const department = await Department.findById(id);
    if(department === null) throw('department_not_found');
    department.name = data.name;
    department.description = data.description;
    department.parent = ObjectId.isValid(data.parent) ? data.parent : null
    await department.save();

    return department;
}

exports.delete = async(departmentId) => {
    const department = await Department.findById(departmentId); //tìm phòng ban hiện tại
    // Tìm các role chức danh của phòng ban hiện tại
    const roles = await Role.find({
        _id: { $in: [department.dean, department.vice_dean, department.employee]}
    });
    // Kiểm tra xem đã user nào trong phòng ban này hay chưa?
    const userroles = await UserRole.find({
        roleId: { $in: roles.map(role=>role._id)}
    });
    
    if(userroles.length === 0){
        // Thực hiện xóa phòng ban nếu như không có ràng buộc nào với các user không? - phòng ban trống

        // Xóa tất cả các role chức danh của đơn vị phòng ban này
        await Role.deleteMany({
            _id: { $in: roles.map(role=>role._id)}
        });
        // Đổi đơn vị phòng cha cho phòng ban con của đơn vị được xóa
        if(department.parent !== undefined || department.parent !== null){
            await Department.updateMany({ 
                parent: department._id
            },{
                $set :{ parent: department.parent }
            }); 

            // Xóa đơn vị phòng ban này
            return await Department.deleteOne({ _id: departmentId });
        }
    }else{
        throw ('department_has_user');
    }
}
exports.getDepartmentOfUser = async (userId) => {
    const roles = await UserRole.find({ userId });
    const newRoles = roles.map( role => role.roleId);
    const departments = await Department.find({
        $or: [
            {'dean': { $in: newRoles }}, 
            {'vice_dean':{ $in: newRoles }}, 
            {'employee':{ $in: newRoles }}
        ]  
    });

    return departments;
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
exports.getDepartmentByCurrentRole = async (companyId, roleId) => {
    const department = await Department.findOne({
        $or: [
            {'dean': roleId, company: companyId }, 
            {'vice_dean': roleId, company: companyId }, 
            {'employee': roleId, company: companyId }
        ]
    }).populate([
        { path: 'dean', model: Role, populate: { path: 'users', model: UserRole} },
        { path: 'vice_dean', model: Role, populate: { path: 'users', model: UserRole}  },
        { path: 'employee', model: Role, populate: { path: 'users', model: UserRole}  }
    ]);

    return department;
}

exports.getDepartmentsThatUserIsDean = async (userId) => {
    const roles = await UserRole.find({ 'userId': userId });
    const newRoles = roles.map( role => role.roleId);
    const departments = await Department.find({'dean': { $in: newRoles } });
    return departments;
}