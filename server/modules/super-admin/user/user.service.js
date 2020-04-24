const { OrganizationalUnit, User, UserRole } = require('../../../models').schema;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

// Lấy tất cả các user trong 1 công ty
exports.getAllUsers = async (company) => {
    const users = await User
        .find({ company })
        .select('-password -status -deleteSoft -tokens')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    return users;
}

//Lay danh sach nguoi dung theo phân trang
exports.getPaginatedUsers = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await User
        .paginate( newData , { 
            page, 
            limit,
            select: '-tokens -status -password -deleteSoft',
            populate: [
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]
        });
}

//lay thong tin nguoi dung theo id
exports.getUserById = async (id) => { //tim user theo id
    var user = await User
        .findById(id)
        .select('-password -status -deleteSoft -tokens')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    if(user === null) throw ({ message: 'user_not_found'});
    
    return user;
}

//tao mot tai khoan cho nguoi dung moi trong cong ty
exports.createUser = async (data, company) => {
    var salt = bcrypt.genSaltSync(10);
    var password = generator.generate({ length: 10, numbers: true });
    var hash = bcrypt.hashSync(password, salt);

    var checkUser = await User.findOne({ email: data.email, company});
    if(checkUser !== null) throw({message: 'email_exist'}); // Email đã được sử dụng
    var user = await User.create({
        name: data.name,
        email: data.email,
        password: hash,
        company: company
    });
    await this.sendMailAboutCreatedAccount(data.email, password)

    return user;
}

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

exports.editUser = async (id, data) => {
    var user = await User
        .findById(id)
        .select('-password -status -deleteSoft')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    if(user === null) throw ({ message: 'user_not_found'});
    if(user.email !== data.email){
        const checkEmail = await User.findOne({email: data.email});
        console.log("check email: ", checkEmail, data.email)
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

exports.deleteUser = async (id) => {
    var deleteUser = await User.deleteOne({ _id: id });
    await UserRole.deleteOne({ userId: id });
    
    return deleteUser;
}

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

//lấy user trong một phòng ban
exports.getAllUsersInOrganizationalUnit = async (departmentId) => {
    var department = await OrganizationalUnit.findById(departmentId);
    var dean = await UserRole.findOne({ roleId: department.dean }).populate('userId roleId');
    var viceDean = await UserRole.findOne({ roleId: department.viceDean }).populate('userId roleId');
    var employee = await UserRole.findOne({ roleId: department.employee }).populate('userId roleId');
    var users = [];
    users = users.concat(dean, viceDean, employee);

    return users;
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
    if(department === null) throw({message: 'department_not_found'});
    var dean = await UserRole.findOne({ roleId: department.dean}).populate('userId roleId');
    var viceDean = await UserRole.findOne({ roleId: department.viceDean}).populate('userId roleId');
    var employee = await UserRole.findOne({ roleId: department.employee}).populate('userId roleId');
    var users = [];
    users = users.concat(dean, viceDean, employee);

    return users;
}