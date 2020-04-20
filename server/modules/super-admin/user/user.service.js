const { Department, User, UserRole } = require('../../../models').schema;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

// Lấy tất cả các user trong 1 công ty
exports.get = async (company) => {
    const users = await User
        .find({ company })
        .select('-password -status -delete_soft -token')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    return users;
}

//Lay danh sach nguoi dung theo phân trang
exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await User
        .paginate( newData , { 
            page, 
            limit,
            select: '-token -status -password -delete_soft',
            populate: [
                { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
                { path: 'company' }
            ]
        });
}

//lay thong tin nguoi dung theo id
exports.getById = async (id) => { //tim user theo id
    var user = await User
        .findById(id)
        .select('-password -status -delete_soft -token')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    if(user === null) throw ({ message: 'user_not_found'});
    
    return user;
}

//tao mot tai khoan cho nguoi dung moi trong cong ty
exports.create = async (data, company) => {
    var salt = bcrypt.genSaltSync(10);
    var password = generator.generate({ length: 10, numbers: true });
    var hash = bcrypt.hashSync(password, salt);
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'vnist.qlcv@gmail.com',
        to: data.email,
        subject: 'Xác thực tạo tài khoản trên hệ thống quản lý công việc',
        text: 'Yêu cầu xác thực tài khoản đã đăng kí trên hệ thống với email là : ' + data.email,
        html:   
                '<p>Tài khoản dùng để đăng nhập của bạn là : </p' + 
                '<ul>' + 
                    '<li>Tài khoản :' + data.email + '</li>' +
                    '<li>Mật khẩu :' + password + '</li>' + 
                '</ul>' + 
                `<p>Đăng nhập ngay tại : <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>` + '<br>' +
                '<p>Your account use to login in system : </p' + 
                '<ul>' + 
                    '<li>Account :' + data.email + '</li>' +
                    '<li>Password :' + password + '</li>' + 
                '</ul>' + 
                `<p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>`
    }
    var checkUser = await User.findOne({ email: data.email, company});
    if(checkUser !== null) throw({message: 'email_exist'}); // Email đã được sử dụng
    var user = await User.create({
        name: data.name,
        email: data.email,
        password: hash,
        company: company
    });
    var mail = await transporter.sendMail(mainOptions);
    
    return user;
}

exports.edit = async (id, data) => {
    var user = await User
        .findById(id)
        .select('-password -status -delete_soft')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    if(user === null) throw ({ message: 'user_not_found'}); //Không tìm thấy dữ liệu về user với id 
    user.name = data.name;
    if(data.password !== undefined && data.password !== null){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        user.password = hash;
    }
    if(data.active !== undefined && data.active !== null) user.active = data.active;
    if(user.active === false) 
        user.token = [];
    user.save();

    return user;
}

exports.delete = async (id) => {
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
//     const roles = [department.dean, department.vice_dean, department.employee]; //lấy 3 role của phòng ban vào 1 arr
//     const users = await UserRole.find({
//         roleId: { $in: roles }
//     });

//     return users.map(user => user.userId); //mảng id của các users trong phòng ban này
// }

//lấy user trong một phòng ban
exports.getUsersOfDepartment = async (departmentId) => {
    var department = await Department.findById(departmentId);
    var dean = await UserRole.findOne({ roleId: department.dean }).populate('userId roleId');
    var vice_dean = await UserRole.findOne({ roleId: department.vice_dean }).populate('userId roleId');
    var employee = await UserRole.findOne({ roleId: department.employee }).populate('userId roleId');
    var users = [];
    users = users.concat(dean, vice_dean, employee);

    return users;
}

/* lấy tất cả các user cùng phòng ban với user hiện tại
 * do user có thể thuộc về nhiều phòng ban, nên phòng ban được xét sẽ lấy theo id role hiện tại của user
*/
exports.getUsersSameDepartment = async(id_role) => {
    var department = await Department.findOne({ 
        $or:[
            {'dean': id_role}, 
            {'vice_dean': id_role}, 
            {'employee': id_role}
        ]  
    });
    if(department === null) throw({message: 'department_not_found'});
    var dean = await UserRole.findOne({ roleId: department.dean}).populate('userId roleId');
    var vice_dean = await UserRole.findOne({ roleId: department.vice_dean}).populate('userId roleId');
    var employee = await UserRole.findOne({ roleId: department.employee}).populate('userId roleId');
    var users = [];
    users = users.concat(dean, vice_dean, employee);

    return users;
}