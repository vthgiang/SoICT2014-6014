const Sabbatical = require('../../../models/sabbatical.model');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const User = require('../../../models/user.model');
//lấy danh sách thông tin kỷ luật
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
    if (data.status !== "All") {
        keySearch = {
            ...keySearch,
            status: data.status
        }
    };
    if (data.month !== "") {
        keySearch = {
            ...keySearch,
            startDate: {
                $regex: data.month,
                $options: "i"
            },
            endDate: {
                $regex: data.month,
                $options: "i"
            }
        }
    };
    var totalList = await Sabbatical.count(keySearch);
    console.log(totalList)
    var listSabbatical = await Sabbatical.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    var content = {
        totalList,
        listSabbatical
    }
    console.log(content);
    return content;

}

// thêm mới thông tin nghỉ phép
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var newSabbatical = await Sabbatical.create({
        employee: employeeinfo._id,
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    });
    var content = {
        _id: newSabbatical._id,
        employee: employeeinfo,
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    }
    return content
}

// Xoá thông tin nghỉ phép
exports.delete = async (id) => {
    return await Sabbatical.findOneAndDelete({
        _id: id,
    });
}

// Cập nhật thông tin nghỉ phép
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var SabbaticalChange = {
        employee: employeeinfo._id,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    };
    await Sabbatical.findOneAndUpdate({
        _id: id,
    }, {
        $set: SabbaticalChange
    });
    var updateSabbatical = {
        _id: id,
        employee: employeeinfo,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    }
    return updateSabbatical;
}