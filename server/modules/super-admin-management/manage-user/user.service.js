const User = require('../../../models/user.model');
const UserRole = require('../../../models/user_role.model');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

//lay danh sach thong tin tat ca nguoi dung trong cong ty
exports.get = async (company) => { //id cua cong ty do
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
    console.log("DATA-user-paginate: ", newData);
    return await User
        .paginate( newData , { 
            page, 
            limit,
            select: '-token -status',
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
                `<p>Đăng nhập ngay tại : <a href="${process.env.SERVER}/login">${process.env.SERVER}/login</a></p>` + '<br>' +
                '<p>Your account use to login in system : </p' + 
                '<ul>' + 
                    '<li>Account :' + data.email + '</li>' +
                    '<li>Password :' + password + '</li>' + 
                '</ul>' + 
                `<p>Login in: <a href="${process.env.SERVER}/login">${process.env.SERVER}/login</a></p>`
    }
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

exports.relationshipUserRole = async (userId, roleId) => { 
    var relationship = await UserRole.create({
        userId,
        roleId
    });
    
    return relationship;
}

//search user with name
exports.searchByName = async (companyId, name) => {
    console.log("data: ",name);
    var user = await User
        .find({
            company: companyId,
            name: new RegExp(name, "i")
        })
        .select('-password -status -delete_soft')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    
    return user;
}