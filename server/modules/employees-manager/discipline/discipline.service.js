const Discipline = require('../../../models/discipline.model');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const User = require('../../../models/user.model');
const Role = require('../../../models/role.model');

//lấy danh sách kỷ luật của nhân viên
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
    if (data.number !== "") {
        keySearch = {
            ...keySearch,
            number: {
                $regex: data.number,
                $options: "i"
            }
        }
    };
    var totalList = await Discipline.count(keySearch);
    var listDiscipline = await Discipline.find(keySearch).populate({
            path: 'employee',
            model: Employee
        })
        .skip(data.page)
        .limit(data.limit);
    for (let n in listDiscipline) {
        var roles = [];
        var departments = [];
        let user = await User.findOne({
            email: listDiscipline[n].employee.emailCompany
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
        listDiscipline[n] = {
            ...listDiscipline[n]._doc,
            roles,
            departments
        }
    }
    var content = {
        totalList,
        listDiscipline
    }
    return content;

}

// thêm mới kỷ luật
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var createDiscipline = await Discipline.create({
        employee: employeeinfo._id,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
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
    var newDiscipline = await Discipline.findOne({
        _id: createDiscipline._id
    }).populate([{
        path: 'employee',
        model: Employee
    }])
    var content = {
        ...newDiscipline._doc,
        roles,
        departments
    }
    return content
}

// Xoá thông tin kỷ luật
exports.delete = async (id) => {
    return await Discipline.findOneAndDelete({
        _id: id
    });
}

// Update thông tin kỷ luật
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var DisciplineChange = {
        employee: employeeinfo._id,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    };
    await Discipline.findOneAndUpdate({
        _id: id
    }, {
        $set: DisciplineChange
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
    var updateDiscipline = await Discipline.findOne({
        _id: id
    }).populate([{
        path: 'employee',
        model: Employee
    }])
    var content = {
        ...updateDiscipline._doc,
        roles,
        departments
    }
    return content;
}