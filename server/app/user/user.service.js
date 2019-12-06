const User = require('../../models/user.model');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

exports.get = async (req, res) => {
    const users = await User
    .find()
    .select('_id name email company roles')
    .populate([
        { path: 'roles' }, 
        { path: 'company' }
    ]);

    return users;
}

exports.getById = async (req, res) => {
    var user = await User
        .findById(req.params.id)
        .select('_id name email company roles')
        .populate([
            { path: 'roles' }, 
            { path: 'company' }
        ]);
    
    return user;
}

exports.create = async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var password = generator.generate({ length: 10, numbers: true });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'vnist.qlcv@gmail.com',
        to: req.body.email,
        subject: 'Xác thực tạo tài khoản trên hệ thống quản lý công việc',
        text: 'Yêu cầu xác thực tài khoản đã đăng kí trên hệ thống với email là : ' + req.body.email,
        html:   
                '<p>Tài khoản dùng để đăng nhập của bạn là : </p' + 
                '<ul>' + 
                    '<li>Tài khoản :' + req.body.email + '</li>' +
                    '<li>Mật khẩu :' + password + '</li>' + 
                '</ul>' + 
                `<p>Đăng nhập ngay tại : <a href="${process.env.SERVER}/login">${process.env.SERVER}/login</a></p>` + '<br>' +
                '<p>Your account use to login in system : </p' + 
                '<ul>' + 
                    '<li>Account :' + req.body.email + '</li>' +
                    '<li>Password :' + password + '</li>' + 
                '</ul>' + 
                `<p>Login in: <a href="${process.env.SERVER}/login">${process.env.SERVER}/login</a></p>`
    }
    var user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        roles: req.body.roles ? req.body.roles : [], //array roles to user
        company: req.body.company ? req.body.company : null //company for user
    });
    var mail = await transporter.sendMail(mainOptions);
    
    return {user, mail};
}

exports.edit = async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.password = hash;
    user.save();

    return user;
}

exports.delete = async (req, res) => {
    var deleteUser = await User.deleteOne({ _id: req.params.id });
    
    return deleteUser;
}