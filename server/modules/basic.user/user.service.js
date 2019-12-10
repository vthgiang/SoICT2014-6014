const User = require('../../models/user.model');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

//lay danh sach thong tin tat ca nguoi dung trong cong ty
exports.get = async (company) => { //id cua cong ty do
    const users = await User
        .find({ company })
        .select('-password -status -delete_soft')
        .populate([
            { path: 'roles' }, 
            { path: 'company' }
        ]);

    return users;
}

//lay thong tin nguoi dung theo id
exports.getById = async (id) => { //tim user theo id
    var user = await User
        .findById(id)
        .select('-password -status -delete_soft')
        .populate([
            { path: 'roles' }, 
            { path: 'company' }
        ]);
    
    return user;
}

//tao mot tai khoan cho nguoi dung moi trong cong ty
exports.create = async (data) => {
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
        roles: data.roles ? data.roles : [], //array roles to user
        company: data.company ? data.company : null //company for user
    });
    var mail = await transporter.sendMail(mainOptions);
    
    return {user, mail};
}

exports.edit = async (id, data) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(data.password, salt);
    var user = await User.findById(id);
    user.name = data.name;
    user.password = hash;
    user.save();

    return user;
}

exports.delete = async (id) => {
    var deleteUser = await User.deleteOne({ _id: id });
    
    return deleteUser;
}