const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const UserRole = require('../../models/user_role.model');
const {loginValidation} = require('./auth.validation');
const generator = require("generate-password");
const nodemailer = require("nodemailer");

exports.login = async (browserFinger, data) => { // data bao gom email va password

    const {error} = loginValidation(data);
    if(error) throw {msg: error.details[0].message};

    const user = await User
        .findOne({email : data.email})
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    if(!user) throw {msg: "Email invalid"};

    const validPass = await bcrypt.compare(data.password, user.password);

    if(!validPass) {
        if(user.active) user.status = user.status + 1;
        if(user.status > 5){
            user.active = false;
            user.status = 0;
            user.save();

            throw { msg: 'Enter the wrong password more than 5 times. The account has been locked.'};
        }
        user.save();

        throw {msg: 'Password invalid'};
    }
    if(!user.active) throw { msg: ' Cannot login! The account has been locked !'};
    const token = await jwt.sign(
        {_id: user._id, email: user.email, company: user.company, browserFinger: browserFinger}, 
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1d' //giới hạn thời gian khả dụng của jwt là 1 ngày
        }
    );
    user.status = 0; 
    user.token.push(token);
    user.save();
    
    return { 
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            company: user.company
        }
    };
}

exports.logout = async (id, token) => {
    console.log("logout service")
    var user = await User.findById(id);
    var position = await user.token.indexOf(token);
    console.log("INDEX: ", position)
    user.token.splice(position, 1);
    user.save();

    return user;
}

exports.logoutAllAccount = async (id) => {
    var user = await User.findById(id);
    user.token = [];
    user.save();
    
    return user;
}

//Quên mật khẩu tài khoản người dùng --------------------------------------//
exports.forgotPassword = async (email) => {
    var user = await User.findOne({ email });
    if(user === null) return false;
    var code = await generator.generate({ length: 6, numbers: true });
    user.reset_password_token = code;
    user.save();
    var transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: email,
        subject: 'VNIST-QLCV : Thay đổi mật khẩu - Change password',
        html:   
                '<p>Mã xác thực của bạn: ' + code + '</p>' +
                '<p>Your OTP: ' + code + '</p>'
    }
    await transporter.sendMail(mainOptions);

    return true;
}

//Thiết lập lại mật khẩu tài khoản người dùng ------------------------------//
exports.resetPassword = async (otp, email, password) => {
    var user = await User.findOne({ email, reset_password_token: otp });
    if(user === null) return false;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.save();

    return true;
}