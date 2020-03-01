const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model')
const arrayToTree = require('array-to-tree');

exports.get = async (id) => {
    var departments = await Department.find({ company: id });
    return departments;
}

exports.getTree = async (id) => {
    var data = await Department.find({ company: id });
    
    var newData = data.map( department => {
        var departmentID = department._id.toString();
        var departmentName = department.name;
        var departmentParent = department.parent !== null ? department.parent.toString() : null;
        return {
            id: departmentID,
            name: departmentName,
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
        parent: data.parent
    });
    console.log("DEPARTMENT: ", department);

    return department;
}

exports.edit = async(req, res) => {
    var department = await Department.findById(req.params.id);
    department.name = req.body.name;
    department.description = req.body.description;
    department.dean = req.body.dean;
    department.vice_dean = req.body.vice_dean;
    department.employee = req.body.employee;
    department.parents = req.body.parents;
    department.save();

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