const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const fs = require("fs");
const { sendEmail } = require("../helpers/emailHelper");
const { validateEmailValid } = require('../helpers/validationHelper');
const UserRepository = require("@/repositories/user.repo")
/**
 * Quên mật khẩu tài khoản người dùng
 * @email: email người dùng
 * @password2: mật khẩu cấp 2 dự phòng khi quên mật khẩu
 */
const forgetPassword = async (portal, email, password2) => {
    if (!email)
        throw ['email_empty']
    if (!validateEmailValid(email))
        throw ['email_invalid']

    var user = await UserRepository.findPortal({ conditions: [portal, email] });
    if (!user)
        throw ['email_not_found'];
    if (user.password2) {
        // Nếu người dùng đã có pass cấp 2 rồi thì kiểm tra xem pass c2 vừa nhập có trùng vs giá trị cũ hay không
        if (!password2)
            throw ['password2_empty'];
        const validPass = await bcrypt.compare(String(password2), user.password2);
        if (!validPass) throw ["password2_invalid"];
    }

    var code = await generator.generate({ length: 10, numbers: true });
    const token = jwt.sign({ email: email, code: code, portal: portal }, process.env.TOKEN_SECRET, { expiresIn: '30m' })

    console.log("=================================================")
    console.log('token', `${process.env.WEBSITE}/reset-password?token=${token}`);
    console.log("=================================================")
    user.resetPasswordToken = code;
    await UserRepository.saveInfoUser(user);

    const subject = `${process.env.WEB_NAME} : Thay đổi mật khẩu - Change password`;
    const html = `
                <div style="
                    background-color:azure;
                    padding: 100px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                ">
                    <div style="max-width: 500px">
                        <h2>
                                    Yêu cầu xác thực thay đổi mật khẩu
                                </h2>
                                <p>Mã xác thực: <b style="color: red">${code}</b></p>
                                    <a 
                                        style="
                                            margin-top: "5px"
                                            " 
                                        href="${process.env.WEBSITE}/reset-password?token=${token}"
                                    >
                                        Nhấn vào link để thay đổi mật khẩu
                                    </a>
                                    <p style="text-align: left;margin-top: 20px;">Nếu bạn không sử dụng liên kết này trong vòng 30 phút, liên kết này sẽ hết hạn. Để có liên kết đặt lại mật khẩu mới, hãy truy cập ${process.env.WEBSITE}/reset-password</p>
                    </div>       
                </div>
        `
    await sendEmail(email, subject, '', html)
    return {
        email,
        portal,
    };
};

/**
 * Thiết lập lại mật khẩu người dùng
 * @param {*} otp
 * @param {*} email
 * @param {*} password
 */
const resetPassword = async (data) => {
    const { otp, token, password } = data;
    if (!token)
        throw ["token_empty"];
    if (!otp)
        throw ["otp_empty"];

    // Giải mã token
    const secret = jwt.verify(token, process.env.TOKEN_SECRET);

    // validate dữ liêu
    if (!secret.portal)
        throw ['portal_empty']

    if (!secret.email)
        throw ["email_empty"];

    if (secret.code !== otp)
        throw ["otp_invalid"];

    var user = await  await UserRepository.findPortal({conditions: [secret.email, otp]});
    if (user === null) throw ["reset_password_invalid"];
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.resetPasswordToken = undefined;
    await UserRepository.saveInfoUser(user)

    return user;
};


const checkLinkValid = async (query) => {
    const { token } = query;
    const secret = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!token)
        throw ['token_reset_password_empty']; // token trống

    const findUser = await  await UserRepository.findPortal({conditions: [secret.email, secret.code]});
    if (!findUser)
        throw ['link_reset_password_invalid']// link reset không hợp lệ
}


/**
 * Thay đổi thông tin người dùng
 * @param {*} userId
 * @param {*} name
 * @param {*} email
 * @param {*} avatar
 */
const changeInformation = async (
    portal,
    userId,
    name,
    email,
    password2,
    avatar = undefined
) => {
    // validate username
    if (!name)
        throw ['username_empty']

    if (name && name.length < 6 || name.length > 255)
        throw ['username_invalid_length']

    // validate email
    if (!email)
        throw ['email_empty']

    if (!validateEmailValid(email))
        throw ['email_invalid']

    if (!password2)
        throw ['password2_empty']

    const user = await UserRepository.findPortal(portal, userId);
    // Check nếu email mới trùng với 1 email nào đó có sẵn trong hệ thống thì không cho đổi
    if (email.toString() !== user.email.toString()) {
        const checkEmailExist = await UserRepository.findPortalByEmail(portal, email);
        if (checkEmailExist)
            throw ['email_exist']
    }

    if (user.password2) {
        const validPass = await bcrypt.compare(password2, user.password2);
        if (!validPass) {
            throw ['password2_invalid'];
        }
    }

    const oldEmail = user.email;
    const deleteAvatar = "." + user.avatar;
    user.email = email;
    user.name = name;
    if (avatar) {
        if (
            deleteAvatar !== "./upload/avatars/user.png" &&
            fs.existsSync(deleteAvatar)
        )
            fs.unlinkSync(deleteAvatar);
        user.avatar = avatar;
    }
    await UserRepository.saveInfoUser(user);


    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    await UserRepository.deleteUserByPassword(password2);

    // Tìm user trong bảng employees và cập nhật lại email
    // Trước khi cập nhật, kiểm tra email mới có trùng với nhân viên nào chưa
    // const employees = await Employee(connect(DB_CONNECTION, portal)).findOne({ emailInCompany: email });
    // if (!employees)
    //     await Employee(connect(DB_CONNECTION, portal)).findOneAndUpdate({ emailInCompany: oldEmail }, { $set: { emailInCompany: email } });

    return user;
};

/**
 * Thay đổi mật khẩu
 * @param {*} userId : id người dùng
 * @param {*} password : mật khẩu cũ
 * @param {*} new_password : mật khẩu mới
 */
const changePassword = async (portal, userId, password, new_password, confirmPassword, password2) => {
    if (!password)
        throw ['old_password_empty']

    if (!new_password)
        throw ['newPassword_empty']

    if (!confirmPassword)
        throw ['confirmPassword_empty']

    if (new_password !== confirmPassword)
        throw ['confirm_password_invalid']

    const user = await User(connect(DB_CONNECTION, portal))
        .findById(userId)
        .populate([{ path: "roles", populate: { path: "roleId" } }]);

    const validPass = await bcrypt.compare(password, user.password);
    // Kiểm tra mật khẩu cũ nhập vào có đúng hay không
    if (!validPass) throw ["password_invalid"];

    // Lưu mật khẩu mới
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(new_password, salt);
    user.password = hashPassword;

    if (user.password2) {
        if (!password2)
            throw ['password2_empty']
        const validPassword2 = await bcrypt.compare(password2, user.password2);
        if (!validPassword2)
            throw ['password2_invalid']

        const hashPassword2 = await bcrypt.hashSync(password2, salt);
        user.password2 = hashPassword2;
    }

    await UserRepository.saveInfoUser(user);

    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    delete user['password2'];
    delete user['password'];

    return user;
};


const changePassword2 = async (portal, userId, body) => {
    const { oldPassword, oldPassword2, newPassword2, confirmNewPassword2 } = body;
    if (!oldPassword)
        throw ['old_password_empty']

    if (!oldPassword2)
        throw ['old_password2_empty']

    if (!newPassword2)
        throw ['new_password2_empty']
    if (!confirmNewPassword2)
        throw ['confirm_password2_empty']

    if (newPassword2 !== confirmNewPassword2)
        throw ['confirm_password2_invalid']

    const user = await UserRepository.findPortalById(portal, userId);

    // Check mật khảu cũ
    const validPass = await bcrypt.compare(oldPassword, user.password);
    if (!validPass) {
        throw ['old_password_invalid'];
    }

    // check mật khẩu cấp 2 cũ
    const validPass2 = await bcrypt.compare(oldPassword2, user.password2);
    if (!validPass2) {
        throw ['old_password2_invalid'];
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword2 = await bcrypt.hashSync(newPassword2, salt);
    user.password2 = hashPassword2;

    await user.save();

    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    delete user['password2'];
    delete user['password'];

    return user;
}


/**
 * Lấy ra thông tn người dùng
 * @param {*} userId : id người dùng
 */
const getProfile = async (portal, userId) => {
    const user = await UserRepository.getUserProfile(portal, userId);
    if (user === null) throw ["user_not_found"];
    // user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;

    delete user['password2'];
    return user;
};

const createPassword2 = async (portal, userId, data) => {
    const { oldPassword, newPassword2, confirmNewPassword2 } = data;

    const user = await UserRepository.findUserByIdPortal(portal, userId);
    // check xem pass cấp 2 đã tồn tại hay chưa
    if (user.password2) throw ['pwd2_existed']

    if (!oldPassword)
        throw ['old_password_empty'];

    if (!newPassword2) throw ['password2_empty'];
    if (!confirmNewPassword2)
        throw ['confirm_password2_empty']

    if (newPassword2 !== confirmNewPassword2)
        throw ['confirm_password2_invalid'];

    // Check mật khảu cũ
    const validPass = await bcrypt.compare(oldPassword, user.password);
    if (!validPass) {
        throw ['old_password_invalid'];
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword2 = await bcrypt.hashSync(newPassword2, salt);
    user.password2 = hashPassword2;

    await UserRepository.saveInfoUser(user);

    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    delete user['password2'];
    delete user['password'];

    return user;
}

const deletePassword2 = async (portal, data, userId) => {
    const { pwd2 } = data;
    if (!pwd2)
        throw ['password2_empty']

    const user = await User(connect(DB_CONNECTION, portal))
        .findById(userId)
        .populate([{ path: "roles", populate: { path: "roleId" } }]);

    const validPwd2 = await bcrypt.compare(pwd2, user.password2);
    if (!validPwd2) {
        throw ['password2_invalid'];
    }

    const userUpdate = await User(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: userId }, { $unset: { password2: "" } }, { new: true })
    userUpdate = userUpdate.toObject();
    userUpdate['password2Exists'] = false;
    return userUpdate;
}

const checkPassword2Exists = async (portal, userId) => {
    const userToken = await UserRepository.checkPasswordUser(portal, userId)
    if (userToken.numberDevice === 0) throw ["acc_log_out"];
    // Kiểm tra người dùng đã có mật khẩu cấp 2 hay chưa?
    if (userToken && userToken.password2) throw ['auth_password2_found']
}

module.exports = {
    forgetPassword,
    resetPassword,
    checkLinkValid,
    changeInformation,
    changePassword,
    changePassword2,
    getProfile,
    createPassword2,
    deletePassword2,
    checkPassword2Exists
};