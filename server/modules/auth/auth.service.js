const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {loginValidation} = require('./auth.validation');
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const { Privilege, Role, User, UserRole } = require('../../models/_export').data;

exports.login = async (fingerprint, data) => { // data bao gom email va password

    const {error} = loginValidation(data);
    if(error) throw {msg: error.details[0].message};

    const user = await User
        .findOne({email : data.email})
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    if(!user) throw {msg: "email_invalid"};
    const validPass = await bcrypt.compare(data.password, user.password);
    if(!validPass) {
        if(user.active) user.status = user.status + 1;
        if(user.status > 5){
            user.active = false;
            user.status = 0;
            user.save();
            throw { msg: 'wrong5_block'};
        }
        user.save();
        throw {msg: 'password_invalid'};
    }
    if(user.roles.length < 1) throw ({msg: 'acc_have_not_role'})
    if(user.roles[0].roleId.name !== 'System Admin'){ 
        //Không phải phiên đăng nhập của system admin 
        if(!user.active) throw { msg: 'acc_blocked'};
        if(!user.company.active) throw ({msg: 'company_service_off'});
    
        const token = await jwt.sign(
            {
                _id: user._id, 
                email: user.email, 
                company: user.company, 
                fingerprint: fingerprint
            }, 
            process.env.TOKEN_SECRET
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
    }else{
        //Phiên đăng nhập của system admin
        const token = await jwt.sign(
            {
                _id: user._id, 
                email: user.email,  
                fingerprint: fingerprint
            }, 
            process.env.TOKEN_SECRET
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
                roles: user.roles
            }
        };
    }
}

exports.logout = async (id, token) => {
    var user = await User.findById(id);
    var position = await user.token.indexOf(token);
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

exports.profile = async (id) => {

}

exports.getLinksOfRole = async (idRole) => {
    
    const role = await Role.findById(idRole); //lay duoc role hien tai
    var roles = [role._id];
    roles = roles.concat(role.parents);
    const privilege = await Privilege.find({ 
        roleId: { $in: roles },
        resourceType: 'Link'
    }).populate({ path: 'resourceId', model: Link }); 
    const links = await privilege.map( link => link.resourceId );
    console.log("link user:",links);
    return links;
}