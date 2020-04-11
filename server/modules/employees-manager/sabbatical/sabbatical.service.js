const Sabbatical = require('../../../models/sabbatical.model');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const UserRole = require('../../../models/user_role.model');
const User = require('../../../models/user.model');
const Role = require('../../../models/role.model');

// Lấy danh sách thông tin nghỉ phép
exports.get = async (data, company) => {
    let keySearchEmployee, keySearch = {company: company};

    // Bắt sựu kiện đơn vị tìm kiếm khác null 
    if (data.unit !== null) {
        let unit = [], roles = [], departmnet = data.unit;
        for(let n in departmnet){
            let unitInfo = await Department.findById(departmnet[n]);  // Lấy thông tin đơn vị
            unit = [...unit, unitInfo]
        }
        if (data.position === null) {
            unit.forEach(u => {
                let role = [u.dean, u.vice_dean, u.employee];        // Lấy 3 role của đơn vị vào 1 arr
                roles = roles.concat(role); 
            })
        } else {
            roles = data.position
        }

        // lấy danh sách người dùng theo phòng ban và chức danh
        let userRoles = await UserRole.find({roleId: {$in: roles}});

        //lấy userID vào 1 arr
        let userId = userRoles.map(userRole => userRole.userId); 

        // Lấy email của người dùng theo phòng ban và chức danh
        var emailUsers = await User.find({_id: {$in: userId}}, {email: 1});

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
    //Bắt sựu kiện trạng thái tìm kiếm khác null
    if (data.status !== null) {
        keySearch = {
            ...keySearch,
            status: {
                $in: data.status
            }
        }
    };
    //Bắt sựu kiện tháng tìm kiếm khác ""
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
    var listSabbatical = await Sabbatical.find(keySearch).populate({ path: 'employee', model: Employee })
        .sort({ 'createDate': 'desc' })
        .skip(data.page)
        .limit(data.limit);
    for (let n in listSabbatical) {
        var roles = [];
        var departments = [];
        let user = await User.findOne({ email: listSabbatical[n].employee.emailCompany })
        if (user !== null) {
            roles = await UserRole.find({ userId: user._id }).populate([{ path: 'roleId', model: Role }]);
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

// Thêm mới thông tin nghỉ phép
exports.create = async (data, company) => {

    // Lấy thông tin nhân viên theo mã số nhân viên
    var employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company }, { _id:1, emailCompany:1 });
    if(employeeInfo!==null){
        var roles = [],departments = [];

        // Tạo mới thông tin nghỉ phép vào database
        var createSabbatical = await Sabbatical.create({
            employee: employeeInfo._id,
            company: company,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            reason: data.reason,
        });

        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let user = await User.findOne({ email: employeeInfo.emailCompany },{ _id:1 })
        if (user !== null) {
            roles = await UserRole.find({ userId: user._id }).populate([{ path: 'roleId', model: Role }]);
            let newRoles = roles.map(role => role.roleId._id);
            departments = await Department.find({
                $or: [
                    {'dean': { $in: newRoles }}, 
                    {'vice_dean':{ $in: newRoles }}, 
                    {'employee':{ $in: newRoles }}
                ] 
            });
        }
        if (roles !== []) { roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin") }
        
        // Lấy thông tin nghỉ phép vừa tạo 
        var newSabbatical = await Sabbatical.findOne({ _id: createSabbatical._id }).populate([{ path: 'employee', model: Employee }])
        
        // Thêm thông tin phòng ban, chức vụ và dữ liệu đầu ra
        var content = {
            ...newSabbatical._doc,
            roles, 
            departments
        }
        return content
    } else return null;
}

// Xoá thông tin nghỉ phép
exports.delete = async (id) => {
    return await Sabbatical.findOneAndDelete({ _id: id });
}

// Cập nhật thông tin nghỉ phép
exports.update = async (id, data) => {
    // Lấy thông tin nhân viên theo mã số nhân viên
    var employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber }, { _id:1, emailCompany:1 });
    if(employeeInfo!==null){
        var roles = [],departments = [];
        var SabbaticalChange = {
            employee: employeeInfo._id,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            reason: data.reason,
            updateDate:Date.now()
        };

        // Cập nhật thông tin nghỉ phép vào database
        await Sabbatical.findOneAndUpdate({ _id: id }, { $set: SabbaticalChange });

        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let user = await User.findOne({ email: employeeInfo.emailCompany },{ _id:1 })
        if (user !== null) {
            roles = await UserRole.find({ userId: user._id }).populate([{ path: 'roleId', model: Role }]);
            let newRoles = roles.map(role => role.roleId._id);
            departments = await Department.find({
                $or: [
                    {'dean': { $in: newRoles }}, 
                    {'vice_dean':{ $in: newRoles }}, 
                    {'employee':{ $in: newRoles }}
                ] 
            });
        }
        if (roles !== []) { roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin") }

        // Lấy thông tin nghỉ phép vừa cập nhật
        var updateSabbatical = await Sabbatical.findOne({ _id:id }).populate([{ path: 'employee', model: Employee }])

        // Thêm thông tin phòng ban, chức vụ và dữ liệu đầu ra
        var content = {
            ...updateSabbatical._doc,
            roles,
            departments
        }
        return content;
    } else return null;
}