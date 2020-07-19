const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {loginValidation} = require('./auth.validation');
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const { Privilege, Role, User, UserRole } = require('../../models').schema;
const fs = require('fs');

/**
 * Phương thức đăng nhập
 */
exports.login = async (fingerprint, data) => { // data bao gom email va password

    const {error} = loginValidation(data);
    if(error) throw ["email_password_invalid"];

    const user = await User
        .findOne({email : data.email})
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId'} }, 
            { path: 'company', model: Company, select: '_id name short_name active' }
        ]);

    if(!user) throw ["email_password_invalid"];
    const validPass = await bcrypt.compare(data.password, user.password);
    if(!validPass) {
        // if(user.active) user.status = user.status + 1;
        // if(user.status > 5){
        //     user.active = false;
        //     user.status = 0;
        //     user.save();
        //     throw ['wrong5_block'];
        // }
        // user.save();
        throw ['email_password_invalid'];
    }
    if(user.roles.length < 1) throw ['acc_have_not_role'];
    if(user.roles[0].roleId.name !== 'System Admin'){ 
        
        //Không phải phiên đăng nhập của system admin 
        if(!user.active) throw ['acc_blocked'];
        if(!user.company.active) throw ['service_off']
    
        const token = await jwt.sign(
            {
                _id: user._id, 
                email: user.email, 
                name: user.name,
                company: user.company, 
                fingerprint: fingerprint
            }, 
            process.env.TOKEN_SECRET
        );
        
        user.status = 0;
        user.numberDevice += 1;
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
                name: user.name,
                fingerprint: fingerprint
            }, 
            process.env.TOKEN_SECRET
        );

        user.status = 0; 
        user.numberDevice += 1;
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
    if(user.numberDevice >= 1) user.numberDevice -= 1;
    user.save();

    return user;
}

exports.logoutAllAccount = async (id) => {
    var user = await User.findById(id);
    user.numberDevice = 0;
    user.save();
    
    return user;
}

/**
 * Quên mật khẩu tài khoản người dùng
 * @email: email người dùng
 */
exports.forgetPassword = async (email) => {
    var user = await User.findOne({ email });
    if(user === null) throw["email_invalid"];
    var code = await generator.generate({ length: 6, numbers: true });
    user.resetPasswordToken = code;
    user.save();
    var transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: email,
        subject: 'VNIST-QLCV : Thay đổi mật khẩu - Change password',
        html: `
        <div style="
            background-color:azure;
            padding: 100px;
            text-align: center;
        ">
            <h3>
                Yêu cầu xác thực thay đổi mật khẩu
            </h3>
            <p>Mã xác thực: <b style="color: red">${code}</b></p>
            <button style="
                padding: 8px 8px 8px 8px; 
                border: 1px solid rgb(4, 197, 30); 
                border-radius: 5px;
                background-color: #4CAF50"
            >
                <a 
                    style="
                        text-decoration: none;
                        color: white;
                        " 
                    href="${process.env.WEBSITE}/reset-password?otp=${code}&email=${email}"
                >
                    Xác thực
                </a>
            </button>
        </div>
        `
    }
    await transporter.sendMail(mainOptions);

    return true;
}

//Thiết lập lại mật khẩu tài khoản người dùng ------------------------------//
exports.resetPassword = async (otp, email, password) => {
    var user = await User.findOne({ email, resetPasswordToken: otp });
    if(user === null) throw ['otp_invalid'];
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.resetPasswordToken=undefined;
    await user.save();

    return user;
}

exports.changeInformation = async (id, name, email, avatar=undefined) => {
    var user = await User.findById(id).populate([
        { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
        { path: 'company' }
    ]);
    var deleteAvatar = '.'+user.avatar;
    user.email = email;
    user.name = name;
    if(avatar !== undefined){
        if(deleteAvatar !== './upload/avatars/user.png' && fs.existsSync(deleteAvatar)) fs.unlinkSync(deleteAvatar);
        user.avatar = avatar;
    };
    await user.save();

    return user;
}

exports.changePassword = async (id, password, new_password) => {
    const user = await User.findById(id).populate([
        { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
        { path: 'company' }
    ]);
    const validPass = await bcrypt.compare(password, user.password);
    // Kiểm tra mật khẩu cũ nhập vào có đúng hay không
    if(!validPass) throw ['password_invalid'];

    // Lưu mật khẩu mới
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(new_password, salt);
    user.password = hash;
    await user.save();

    return user;
}

exports.getLinksThatRoleCanAccess = async (idRole) => {
    
    const role = await Role.findById(idRole); //lay duoc role hien tai
    var roles = [role._id];
    roles = roles.concat(role.parents);
    const privilege = await Privilege.find({ 
        roleId: { $in: roles },
        resourceType: 'Link'
    }).populate({ path: 'resourceId', model: Link }); 
    const links = await privilege.map( link => link.resourceId );

    return links;
}

exports.getProfile = async (id) => {
    var user = await User
        .findById(id)
        .select('-password -status -deleteSoft -tokens')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    if(user === null) throw['user_not_found'];
    
    return user;
}