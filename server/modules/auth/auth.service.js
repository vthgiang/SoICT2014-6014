const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {loginValidation} = require('./auth.validation');
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const { Privilege, Role, User, UserRole } = require('../../models/_export').data;

exports.login = async (fingerprint, data) => { // data bao gom email va password

    const {error} = loginValidation(data);
    if(error) throw {message: error.details[0].message};

    const user = await User
        .findOne({email : data.email})
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    if(!user) throw {message: "email_invalid"};
    const validPass = await bcrypt.compare(data.password, user.password);
    if(!validPass) {
        if(user.active) user.status = user.status + 1;
        if(user.status > 5){
            user.active = false;
            user.status = 0;
            user.save();
            throw { message: 'wrong5_block'};
        }
        user.save();
        throw {message: 'password_invalid'};
    }
    if(user.roles.length < 1) throw ({message: 'acc_have_not_role'})
    if(user.roles[0].roleId.name !== 'System Admin'){ 
        //Không phải phiên đăng nhập của system admin 
        if(!user.active) throw { message: 'acc_blocked'};
        if(!user.company.active) throw ({message: 'service_off'});
    
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
    if(user === null) throw("email_not_found");
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
                    href="http://localhost:3000/reset-password?otp=${code}&email=${email}"
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
    var user = await User.findOne({ email, reset_password_token: otp });
    if(user === null) return false;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.save();

    return true;
}

exports.changeInformation = async (id, name, email, avatar=null) => {
    var user = await User.findById(id).populate([
        { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
        { path: 'company' }
    ]);
    user.email = email;
    user.name = name;
    user.avatar = avatar;
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
    if(!validPass) throw ({message: 'password_invalid'});

    // Lưu mật khẩu mới
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(new_password, salt);
    user.password = hash;
    await user.save();

    return user;
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

    return links;
}

exports.show = async (id) => {
    var user = await User
        .findById(id)
        .select('-password -status -delete_soft -token')
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);
    if(user === null) throw({message: 'user_not_found'});
    
    return user;
}