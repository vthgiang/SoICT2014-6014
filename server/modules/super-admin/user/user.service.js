const { OrganizationalUnit, User, UserRole, Role } = require('../../../models').schema;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const DashboardService = require('../../kpi/evaluation/dashboard/dashboard.service');

/**
 * Lấy danh sách tất cả user trong 1 công ty
 * @company id của công ty
 */
exports.getAllUsers = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    var name = query.name;
    var keySearch = {company: company};

    if(!page && !limit){
        if(name){
            keySearch = {...keySearch, name: {$regex: name, $options: "i"}};

            let searchUses = await User.find(keySearch)
            .select('-password -status -deleteSoft -tokens')
            .populate([
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]);

            return {searchUses}
        } else {
            return await User.find({ company })
            .select('-password -status -deleteSoft -tokens')
            .populate([
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]);
        }
    } else {
        const option = (query.key && query.value)
            ? Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {company};
        console.log("option: ", option);
        return await User.paginate( option , { 
            page, 
            limit,
            select: '-tokens -status -password -deleteSoft',
            populate: [
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]
        });
    }
}

/**
 * Lấy thông tin user theo id
 * @id id của user
 */
exports.getUser = async (id) => {
    var user = await User
        .findById(id)
        .select('-password -status -deleteSoft -tokens')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    if (!user) {
        throw ['user_not_found'];
    }
    
    return user;
}

/**
 * Tạo tài khoản cho user
 * @data dữ liệu về user
 * @company công ty user thuộc về
 */
exports.createUser = async (data, company) => {
    var salt = bcrypt.genSaltSync(10);
    var password = generator.generate({ length: 10, numbers: true });
    var hash = bcrypt.hashSync(password, salt);

    var checkUser = await User.findOne({ email: data.email });

    if (checkUser) {
        throw['email_exist'];
    }

    var user = await User.create({
        name: data.name,
        email: data.email,
        password: hash,
        company: company
    });
    
    await this.sendMailAboutCreatedAccount(data.email, password)

    return user;
}

/**
 * Gửi email thông báo đã tạo tài khoản thành công
 * @email người nhận
 * @password của tài khoản đó
 */
exports.sendMailAboutCreatedAccount = async(email, password) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: email,
        subject: 'Xác thực tạo tài khoản trên hệ thống quản lý công việc',
        text: 'Yêu cầu xác thực tài khoản đã đăng kí trên hệ thống với email là : ' + email,
        html:   
                '<p>Tài khoản dùng để đăng nhập của bạn là : </p' + 
                '<ul>' + 
                    '<li>Tài khoản :' + email + '</li>' +
                    '<li>Mật khẩu :' + password + '</li>' + 
                '</ul>' + 
                `<p>Đăng nhập ngay tại : <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>` + '<br>' +
                '<p>Your account use to login in system : </p' + 
                '<ul>' + 
                    '<li>Account :' + email + '</li>' +
                    '<li>Password :' + password + '</li>' + 
                '</ul>' + 
                `<p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>`
    }

    return await transporter.sendMail(mainOptions);
}

/**
 * Gửi email thông báo thay đổi email tài khoản hiện tại
 * @oldEmail email cũ
 * @newEmail email mới
 */
exports.sendMailAboutChangeEmailOfUserAccount = async(oldEmail, newEmail) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: newEmail,
        subject: 'Xác thực thay đổi email',
        text: `Chuyển đổi email từ [${oldEmail}] => [${newEmail}] `,
        html:   
                '<p>Tài khoản dùng để đăng nhập của bạn là : </p>' + 
                '<ul>' + 
                    '<li>Email cũ :' + oldEmail + '</li>' +
                    '<li>Email mới :' + newEmail + '</li>' +
                '</ul>' + 
                '<p>Your account use to login in system : </p>' + 
                '<ul>' + 
                    '<li>Old email :' + oldEmail + '</li>' +
                    '<li>New email :' + newEmail + '</li>' +
                '</ul>'
    }

    return await transporter.sendMail(mainOptions);
}

/**
 * Chỉnh sửa thông tin tài khoản người dùng
 * @id id tài khoản
 * @data dữ liệu chỉnh sửa
 */
exports.editUser = async (id, data) => {
    var user = await User
        .findById(id)
        .select('-password -status -deleteSoft')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    if(!user) {
        throw ['user_not_found']
    };

    if(user.email !== data.email){
        const checkEmail = await User.findOne({email: data.email});
        if(checkEmail !== null) throw ['email_exist'];
        await this.sendMailAboutChangeEmailOfUserAccount(user.email, data.email);
    }
    user.name = data.name;

    if(data.password){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        user.password = hash;
    }

    if(data.active) {
        user.active = data.active;
    }

    if(user.active === false) {
        user.tokens = [];
    }
        
    user.email = data.email;
    user.save();

    return user;
}

/**
 * Xóa tài khoản người dùng
 * @id id tài khoản người dùng
 */
exports.deleteUser = async (id) => {
    var deleteUser = await User.deleteOne({ _id: id });
    await UserRole.deleteOne({ userId: id });
    
    return deleteUser;
}

/**
 * Thêm 1 hoặc nhiều role - phân quyền cho user
 * @userId id của user
 * @roleIdArr mảng id các role
 */
exports.addRolesForUser = async (userId, roleIdArr) => { 
    var data = await roleIdArr.map( roleId => {
        return {
            userId,
            roleId
        }
    });
    var relationship = await UserRole.insertMany(data);
    
    return relationship;
}

/**
 * Chỉnh sửa các role - phân quyền cho 1 user
 * @userId id user
 * @roleIdArr mảng id các role
 */
exports.editRolesForUser = async (userId, roleIdArr) => { 
    await UserRole.deleteMany({userId});
    var data = await roleIdArr.map( roleId => {
        return {
            userId,
            roleId
        }
    });
    var relationship = await UserRole.insertMany(data);
    
    return relationship;
}

// exports.getUsersOfDepartment = async (departmentId) => {
//     const department = await Department.findById(departmentId); //lấy thông tin phòng ban hiện tại
//     const roles = [department.dean, department.viceDean, department.employee]; //lấy 3 role của phòng ban vào 1 arr
//     const users = await UserRole.find({
//         roleId: { $in: roles }
//     });

//     return users.map(user => user.userId); //mảng id của các users trong phòng ban này
// }



/**
 * Lấy tất cả nhân viên của một phòng ban hoặc 1 mảng phòng ban kèm theo vai trò của họ 
 */
exports.getAllUsersInOrganizationalUnit = async (departmentId) => {
    let departmentIds = await OrganizationalUnit.find({ _id: {$in: [...departmentId.split(',')]} });
    let users = await _getAllUsersInOrganizationalUnits(departmentIds);

    return users;
}

/* lấy tất cả các user cùng phòng ban với user hiện tại
 * do user có thể thuộc về nhiều phòng ban, nên phòng ban được xét sẽ lấy theo id role hiện tại của user
*/
exports.getAllUsersInSameOrganizationalUnitWithUserRole = async(id_role) => {
    var department = await OrganizationalUnit.findOne({ 
        $or:[
            {'deans': id_role}, 
            {'viceDeans': id_role}, 
            {'employees': id_role}
        ]  
    });
    return _getAllUsersInOrganizationalUnit(department);
}

/**
 * Hàm tiện ích dùng trong 2 service ở trên
 */
_getAllUsersInOrganizationalUnit = async (department) => {
    var userRoles = await UserRole
    .find({ roleId: {$in: [...department.deans, ...department.viceDeans, ...department.employees]}})
    .populate({path: 'userId', select: 'name'})

    var tmp = await Role.find({_id: {$in: [...department.deans, ...department.viceDeans, ...department.employees]}}, {name: 1});
    var users = {deans:{}, viceDeans:{}, employees:{}, department: department.name};
    tmp.forEach(item => {
        let obj = {};
        obj._id = item.id;
        obj.name = item.name;
        obj.members=[];

        if (department.deans.includes(item._id.toString())){
            users.deans[item._id.toString()] = obj;
        } else if (department.viceDeans.includes(item._id.toString())){
            users.viceDeans[item._id.toString()] = obj;
        } else if (department.employees.includes(item._id.toString())){
            users.employees[item._id.toString()] = obj;
        }
    })

    userRoles.forEach((item) => {
    if (users.deans[item.roleId.toString()] && item.userId){
        users.deans[item.roleId.toString()].members.push(item.userId);
    } else if (users.viceDeans[item.roleId.toString()] && item.userId){
        users.viceDeans[item.roleId.toString()].members.push(item.userId);
    } else if (users.employees[item.roleId.toString()] &&  item.userId){
        users.employees[item.roleId.toString()].members.push(item.userId);
    }
    });
    
    return users;
}




/**
 * Kiểm tra sự tồn tại của tài khoản
 * @email : email người dung
 */
exports.checkUserExited = async (email) => {
    var user = await User.findOne({email : email},{field1: 1});
    var checkUser = false;
    if (user) {
        checkUser = true
    }
    return checkUser;
}


/**
 * Lấy tất cả các đơn vị tổ chức một user thuộc về
 * @userId id của user
 */
exports.getOrganizationalUnitsOfUser = async (userId) => {
    const roles = await UserRole.find({ userId });
    const newRoles = roles.map( role => role.roleId.toString());
    const departments = await OrganizationalUnit.find({
        $or: [
            {'deans': { $in: newRoles }}, 
            {'viceDeans':{ $in: newRoles }}, 
            {'employees':{ $in: newRoles }}
        ]  
    });

    return departments;
}
/**
 * Lấy tất cả các người dùng trong  đơn vị và trong các đơn vị con của nó
 * @getAllUserInCompany = true khi muốn lấy tất cả người dùng trong tất cả đơn vị của 1 công ty
 * @id Id công ty
 * @unitID Id của của đơn vị cần lấy đơn vị con
 */
exports.getAllUserInUnitAndItsSubUnits = async (id, unitId,getAllUserInCompany=false) => {
    //Lấy tất cả các đơn vị con của 1 đơn vị
    var data;

    if(!getAllUserInCompany) {
        
        var organizationalUnit = await OrganizationalUnit.findById(unitId);
        // TODO: tối ưu hóa DashboardService.getChildrenOfOrganizationalUnitsAsTree

        data = await DashboardService.getChildrenOfOrganizationalUnitsAsTree(id, organizationalUnit.deans[0]);
        
        var queue=[];
        var departments = [];
        //BFS tìm tât cả đơn vị con-hàm của Đức
        departments.push(data);
        queue.push(data);    

        while (queue.length > 0) {
            var v = queue.shift();
            if (v.children) {
                for (var i = 0; i < v.children.length; i++) {
                    var u = v.children[i];
                    queue.push(u);
                    departments.push(u);

                }
            }
        }
        //Lấy tất cả user của từng đơn vị
        var userArray=[];
        userArray = await _getAllUsersInOrganizationalUnits(departments);
        return userArray;
    }
    //Lấy tất nhan vien trong moi đơn vị trong công ty
    if (getAllUserInCompany) {
        
        const allUnits = await OrganizationalUnit.find({ company: id });    
        const newData = allUnits.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            deans:department.deans.map(item => item.toString()),
            viceDeans:department.viceDeans.map(item => item.toString()),
            employees:department.employees.map(item => item.toString()),
            parent_id: department.parent !== null ? department.parent.toString() : null
            }
        });
        
        let tmp = await _getAllUsersInOrganizationalUnits(newData);
        return  tmp;
    }
}

/**
 * Hàm tiện ích dùng trong service ở trên 
 * Khác với hàm bên module User: nhận vào 1 mảng các department và trả về 1 mảng với mỗi ptu là tất cả các nhân viên trong từng 1 phòng ban
 */
_getAllUsersInOrganizationalUnits = async (data) => {
    var userArray=[];
    for(let i= 0;i<data.length;i++)
    {   
        var department=data[i];
        var userRoles = await UserRole
        .find({ roleId: {$in: [...department.deans, ...department.viceDeans, ...department.employees]}})
        .populate({path: 'userId', select: 'name'})
    
        var tmp = await Role.find({_id: {$in: [...department.deans, ...department.viceDeans, ...department.employees]}}, {name: 1});
        var users = {deans:{}, viceDeans:{}, employees:{}, department: department.name};
        tmp.forEach(item => {
            let obj = {};
            obj._id = item.id;
            obj.name = item.name;
            obj.members=[];

            if (department.deans.includes(item._id.toString())){
                users.deans[item._id.toString()] = obj;
            } else if (department.viceDeans.includes(item._id.toString())){
                users.viceDeans[item._id.toString()] = obj;
            } else if (department.employees.includes(item._id.toString())){
                users.employees[item._id.toString()] = obj;
            }
        })

        userRoles.forEach((item) => {
        if (users.deans[item.roleId.toString()] && item.userId){
            users.deans[item.roleId.toString()].members.push(item.userId);
        } else if (users.viceDeans[item.roleId.toString()] && item.userId){
            users.viceDeans[item.roleId.toString()].members.push(item.userId);
        } else if (users.employees[item.roleId.toString()] &&  item.userId){
            users.employees[item.roleId.toString()].members.push(item.userId);
        }
        });

        userArray.push(users);
    }
    return userArray;
}
