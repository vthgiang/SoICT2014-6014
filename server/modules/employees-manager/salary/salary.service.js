const Salary = require('../../../models/salary.model');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const User = require('../../../models/user.model');
const Role = require('../../../models/role.model');
//lấy danh sách các bẳng lương của nhân viên
exports.get = async (data, company) => {
    var keySearch = {
        company: company,
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
    if (data.month !== "") {
        keySearch = {
            ...keySearch,
            month: data.month
        }
    };
    var totalList = await Salary.count(keySearch);
    var listSalary = await Salary.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    for (let n in listSalary) {
        var roles = [];
        var departments = [];
        let user = await User.findOne({
            email: listSalary[n].employee.emailCompany
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
        listSalary[n] = {
            ...listSalary[n]._doc,
            roles,
            departments
        }
    }
    var content = {
        totalList,
        listSalary
    }
    return content;

}

// thêm mới bẳng lương mới
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var salary = data.mainSalary + data.unit;
    var createSalary = await Salary.create({
        employee: employeeinfo._id,
        company: company,
        month: data.month,
        mainSalary: salary,
        bonus: data.bonus
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
    var newSalary = await Salary.findOne({
        _id: createSalary._id
    }).populate([{
        path: 'employee',
        model: Employee
    }])
    var content = {
        ...newSalary._doc,
        roles,
        departments
    }
    return content
}

// Xoá bẳng lương
exports.delete = async (id) => {
    return await Salary.findOneAndDelete({
        _id: id
    });
}

// Update thông tin bảng lương
exports.update = async (id, data,company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company:company
    });
    var salaryChange = {
        employee: employeeinfo._id,
        month: data.month,
        mainSalary: data.unit ? (data.mainSalary + data.unit) : data.mainSalary,
        bonus: data.bonus
    };
    await Salary.findOneAndUpdate({
        _id: id
    }, {
        $set: salaryChange
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
    var updateSalary = await Salary.findOne({
        _id: id
    }).populate([{
        path: 'employee',
        model: Employee
    }])
    var content = {
        ...updateSalary._doc,
        roles,
        departments
    }
    return content;
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
exports.checkSalary = async (employeeNumber,month, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company:company
    });
    var idSalary = await Salary.find({
        employee: employeeinfo._id,
        company: company,
        month:month
    }, {
        field1: 1
    })
    var checkSalary = false;
    if (idSalary.length !== 0) {
        checkSalary = true
    }
    return checkSalary;
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
exports.checkArraySalary = async (data, company) => {
    var list=[];
    for(let i=0;i<data.arraySalary.length;i++){
        let employeeinfo = await Employee.findOne({
            employeeNumber: data.arraySalary[i].employeeNumber,
            company:company
        },{
            field1: 1
        });
        if(employeeinfo!==null){
            let salary=await Salary.findOne({
                employee:employeeinfo._id,
                company: company,
                month:data.arraySalary[i].month
            }, {
                field1: 1
            })
            if(salary!==null){
                list.push(i);
            }
        }
    }
    console.log(list)
    return list;
}

// Import dữ liệu bảng lương
exports.importSalary = async (data, company) => {
    var importSalary=[];
    for(let n in data.rows){
        var row = data.rows[n];
        var employeeinfo = await Employee.findOne({
            employeeNumber: row[3],
            company: company
        });
        var mainSalary = row[5].toString();
        unit = mainSalary.slice(mainSalary.length-3,mainSalary.length);
        if( unit !== "VND" && unit !== "USD"){
            mainSalary = mainSalary + "VND"
        }
        var month = "",bonus=[];
            if (row[1].toString().length === 2) {
                month = row[1].toString() + "-" + row[2].toString();
            } else {
                month = "0" + row[1].toString() + "-" + row[2].toString();
            }
            for(let i=6;i<row.length;i++){
                if(row[i]!==null){
                    bonus=[...bonus,{
                        nameBonus:data.cols[i],
                        number:row[i]
                    }]
                }
            }
        var newSalary = await Salary.create({
            employee: employeeinfo._id,
            company: company,
            month: month,
            mainSalary: mainSalary,
            bonus: bonus
        });
        importSalary[n]=newSalary;
    }
    return importSalary;
}