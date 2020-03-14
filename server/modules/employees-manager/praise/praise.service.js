const Praise = require('../../../models/praise.model');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const User = require('../../../models/user.model');
//lấy danh sách khen thưởng của nhân viên
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    };
    var keySearchEmployee;
    // Bắt sựu kiện đơn vị tìm kiếm khác All 
    if (data.department !== "All") {
        var department = await Department.findById(data.department); //lấy thông tin đơn vị
        if (data.position === "All") {
            var roles = [department.dean, department.vice_dean, department.employee]; //lấy 3 role của đơn vào 1 arr
        } else {
            var roles = [data.position]
        }
        // lấy danh sách người dùng theo phòng ban và chức danh
        var userRoles = await UserRole.find({
            roleId: {
                $in: roles
            }
        });
        var userId = userRoles.map(userRole => userRole.userId); //lấy userID vào 1 arr
        // Lấy email của người dùng theo phòng ban và chức danh
        var emailUsers = await User.find({
            _id: {
                $in: userId
            }
        }, {
            email: 1
        });
        emailCompany = emailUsers.map(user => user.email)
        keySearchEmployee={
            ...keySearchEmployee,
            emailCompany:{
                $in:emailCompany
            }
        }
    }
    //Bắt sựu kiện MSNV tìm kiếm khác ""
    if (data.employeeNumber !== "") {
        keySearchEmployee = {
            ...keySearchEmployee,
            employeeNumber: {
                $regex: data.employeeNumber,
                $options: "i"
            }
        }
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo =>employeeinfo._id);
        keySearch={
            ...keySearch,
            employee:{
                $in:employee
            }
        }

    }
    if (data.number !== "") {
        keySearch = {
            ...keySearch,
            number: {
                $regex: data.number,
                $options: "i"
            }
        }
    };
    var totalList = await Praise.count(keySearch);
    var listPraise = await Praise.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    var content = {
        totalList,
        listPraise
    }
    return content;

}

// thêm mới khen thưởng
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var newPraise = await Praise.create({
        employee: employeeinfo._id,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    });
    var content = {
        _id: newPraise._id,
        employee: employeeinfo,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    }
    return content
}

// Xoá thông tin khen thưởng
exports.delete = async (id) => {
    return await Praise.findOneAndDelete({
        _id: id
    });
}

// Update thông tin khen thưởng
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var praiseChange = {
        employee: employeeinfo._id,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    };
    await Praise.findOneAndUpdate({
        _id: id
    }, {
        $set: praiseChange
    });
    var updatePraise = {
        _id: id,
        employee: employeeinfo,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    }
    return updatePraise;
}