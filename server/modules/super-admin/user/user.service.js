const { OrganizationalUnit, User, UserRole, Role } = require('../../../models').schema;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

/**
 * Lấy danh sách tất cả user trong 1 công ty
 * @company id của công ty
 */
exports.getAllUsers = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    var name = query.name;
    var keySearch = {company: company};
    if(page === undefined && limit === undefined ){
        if(name!==undefined){
            keySearch = {...keySearch, name: {$regex: name, $options: "i"}};
            let searchUses = await User.find(keySearch)
            .select('-password -status -deleteSoft -tokens')
            .populate([
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]);
            return {searchUses}
        }else{
            return await User.find({ company })
            .select('-password -status -deleteSoft -tokens')
            .populate([
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]);
        }
    }else{
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {};
        
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
    if(user === null) throw ['user_not_found'];
    
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

    var checkUser = await User.findOne({ email: data.email, company});
    if(checkUser !== null) throw['email_exist'];
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
        to: email,
        subject: 'Xác thực thay đổi email',
        text: `Chuyển đổi email từ [${oldEmail}] => [${newEmail}] `,
        html:   
                '<p>Tài khoản dùng để đăng nhập của bạn là : </p' + 
                '<ul>' + 
                    '<li>Email cũ :' + oldEmail + '</li>' +
                    '<li>Email mới :' + newEmail + '</li>' +
                '</ul>' + 
                '<p>Your account use to login in system : </p' + 
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
    if(user === null) throw ['user_not_found'];
    if(user.email !== data.email){
        const checkEmail = await User.findOne({email: data.email});
        if(checkEmail !== null) throw ['email_exist'];
        user.email = data.email;
        await this.sendMailAboutChangeEmailOfUserAccount(user.email, data.email);
    }
    user.name = data.name;
    if(data.password !== undefined && data.password !== null){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        user.password = hash;
    }
    if(data.active !== undefined && data.active !== null) user.active = data.active;
    if(user.active === false) 
        user.tokens = [];
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
 * Lấy user trong một phòng ban
 */
exports.getAllUsersInOrganizationalUnit = async (departmentId) => {
    var department = await OrganizationalUnit.findById(departmentId);

    return _getAllUsersInOrganizationalUnit(department);
}

/* lấy tất cả các user cùng phòng ban với user hiện tại
 * do user có thể thuộc về nhiều phòng ban, nên phòng ban được xét sẽ lấy theo id role hiện tại của user
*/
exports.getAllUsersInSameOrganizationalUnitWithUserRole = async(id_role) => {
    var department = await OrganizationalUnit.findOne({ 
        $or:[
            {'dean': id_role}, 
            {'viceDean': id_role}, 
            {'employee': id_role}
        ]  
    });
    return _getAllUsersInOrganizationalUnit(department);
}

/**
 * Hàm tiện ích dùng trong 2 service ở trên
 */
_getAllUsersInOrganizationalUnit = async (department) => {
    var userRoles = await UserRole
    .find({ roleId: {$in: [department.dean, department.viceDean, department.employee]}})
    .populate({path: 'userId', select: 'name'})
    
    var tmp = await Role.find({_id: {$in: [department.dean, department.viceDean, department.employee]}}, {name: 1});
    var roles = {};
    tmp.forEach(item => {
        if (item._id.equals(department.dean))
            roles.dean = item;
        else if (item._id.equals(department.viceDean))
            roles.viceDean = item;
        else if (item._id.equals(department.employee))
            roles.employee = item;
    })

    let deans=[], viceDeans=[], employees=[];
    userRoles.forEach((item) => {
        if (item.roleId.equals(department.dean)){
            deans.push(item.userId);
        } else if (item.roleId.equals(department.viceDean)){
            viceDeans.push(item.userId);
        } else if (item.roleId.equals(department.employee)){
            employees.push(item.userId);
        }
    });

    var users = {deans: deans, viceDeans: viceDeans, employees: employees, roles: roles};

    return users;
}




/**
 * Kiểm tra sự tồn tại của tài khoản
 * @email : email người dung
 */
exports.checkUserExited = async (email) => {
    var user = await User.findOne({email : email},{field1: 1});
    var checkUser = false;
    if (user !== null) {
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
    const newRoles = roles.map( role => role.roleId);
    const departments = await OrganizationalUnit.find({
        $or: [
            {'dean': { $in: newRoles }}, 
            {'viceDean':{ $in: newRoles }}, 
            {'employee':{ $in: newRoles }}
        ]  
    });

    return departments;
}