const Sabbatical = require('../../../models/sabbatical.model');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const User = require('../../../models/user.model');
const Role = require('../../../models/role.model');
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
        keySearchEmployee = {
            ...keySearchEmployee,
            emailCompany: {
                $in: emailCompany
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
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id);
        keySearch = {
            ...keySearch,
            employee: {
                $in: employee
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
    for (let n in listSabbatical) {
        var roles = [];
        var departments = [];
        let user = await User.findOne({
            email: listSabbatical[n].employee.emailCompany
        })
        if (user !== null) {
            roles = await UserRole.find({
                userId: user._id
            }).populate([{
                path: 'roleId',
                model: Role
            }]);
            let newRoles = roles.map(role => role.roleId._id);
            departments = await Department.find({
                $or: [
                    {'dean': { $in: newRoles }}, 
                    {'vice_dean':{ $in: newRoles }}, 
                    {'employee':{ $in: newRoles }}
                ] 
            });
        }
        if (roles !== []) {
            roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin");
        }
        listSabbatical[n] = {
            ...listSabbatical[n]._doc,
            roles,
            departments
        }
    }
    var content = {
        totalList,
        listSabbatical
    }
    return content;

}

// thêm mới thông tin nghỉ phép
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var createSabbatical = await Sabbatical.create({
        employee: employeeinfo._id,
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    });
    var roles = [];
    var departments = [];
    let user = await User.findOne({
        email: employeeinfo.emailCompany
    })
    if (user !== null) {
        roles = await UserRole.find({
            userId: user._id
        }).populate([{
            path: 'roleId',
            model: Role
        }]);
        let newRoles = roles.map(role => role.roleId._id);
        departments = await Department.find({
            $or: [
                {'dean': { $in: newRoles }}, 
                {'vice_dean':{ $in: newRoles }}, 
                {'employee':{ $in: newRoles }}
            ] 
        });
    }
    if (roles !== []) {
        roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin");
    }
    var newSabbatical = await Sabbatical.findOne({
        _id:createSabbatical._id
    }).populate([{
        path: 'employee',
        model: Employee
    }])
    var content = {
        ...newSabbatical._doc,
        roles,
        departments
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
    var roles = [];
    var departments = [];
    let user = await User.findOne({
        email: employeeinfo.emailCompany
    })
    if (user !== null) {
        roles = await UserRole.find({
            userId: user._id
        }).populate([{
            path: 'roleId',
            model: Role
        }]);
        let newRoles = roles.map(role => role.roleId._id);
        departments = await Department.find({
            $or: [
                {'dean': { $in: newRoles }}, 
                {'vice_dean':{ $in: newRoles }}, 
                {'employee':{ $in: newRoles }}
            ] 
        });
    }
    if (roles !== []) {
        roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin");
    }
    var updateSabbatical = await Sabbatical.findOne({
        _id:id
    }).populate([{
        path: 'employee',
        model: Employee
    }])
    var content = {
        ...updateSabbatical._doc,
        roles,
        departments
    }
    return content;
}