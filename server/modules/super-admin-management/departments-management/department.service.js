const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const Role = require('../../../models/role.model')
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
    var data = await Department.find({ company: id });
    
    var newData = data.map( department => {
        var departmentID = department._id.toString();
        var departmentName = department.name;
        var departmentDescription = department.description;
        var departmentDean = department.dean.toString();
        var departmentViceDean = department.vice_dean.toString();
        var employee = department.employee.toString();
        var departmentParent = department.parent !== null ? department.parent.toString() : null;
        return {
            id: departmentID,
            name: departmentName,
            description: departmentDescription,
            dean:departmentDean,
            vice_dean:departmentViceDean,
            employee:employee,
            parent_id: departmentParent
        }
    });
    var tree = await arrayToTree(newData);

    return tree;
}

exports.getById = async (req, res) => {

    return await Department.findById(req.params.id);
}

exports.create = async(data, deanId, vice_deanId, employeeId, companyID) => {

    const department = await Department.create({
        name: data.name,
        description: data.description,
        company: companyID,
        dean: deanId,
        vice_dean: vice_deanId,
        employee: employeeId,
        parent: ObjectId.isValid(data.parent) ? data.parent : null
    });
    console.log("DEPARTMENT: ", department);

    return department;
}

exports.edit = async(id, data) => {
    var department = await Department.findById(id);
    console.log("old: ",department);
    department.name = data.name;
    department.description = data.description;
    department.parent = data.parent;
    department.save();
    console.log("new: ",department);

    return department;
}

exports.delete = async(departmentId) => {
    var department = await Department.findById(departmentId); //tìm phòng ban hiện tại
    console.log("Phong hien tai: ", department.name);
    if(department.parent !== undefined || department.parent !== null){
        await Department.updateMany({ 
            parent: department._id
        },{
            $set :{ parent: department.parent }
        }); 
        console.log("update xong")
        return await Department.deleteOne({ _id: departmentId });
    }

    return {};
}
exports.getDepartmentOfUser = async (req, res) => {
    console.log('get department of user')
    try {
        var roles = await UserRole.find({userId: req.params.id});
        // console.log(roles);
        var newRoles = roles.map( role => role.roleId);
        var departments = await Department.find({
            $or: [
                {'dean': { $in: newRoles }}, 
                {'vice_dean':{ $in: newRoles }}, 
                {'employee':{ $in: newRoles }}
            ]  
        });
        console.log(departments);

        res.status(200).json(departments);
    } catch (error) {

        res.status(400).json({msg: error});
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
exports.getDepartmentByCurrentRole = async (companyId, roleId) => {
    try {
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

        res.status(200).json(department);
    } catch (error) {

        res.status(400).json({msg: error});
    }
}