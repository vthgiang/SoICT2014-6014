const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const Models = require('../models');
const { Privilege, Role, User, Company, Employee, UserRole, Delegation } = Models;
const fs = require('fs');
const { connect, initModels } = require('../helpers/dbHelper');
const { sendEmail } = require('../helpers/emailHelper');
const { validateEmailValid } = require('../helpers/validationHelper');
const DelegationService = require('../services/delegation');
const { getDbConnection } = require('../database')

/**
 * Phương thức đăng nhập
 */
exports.login = async (fingerprint, data) => {
    // data bao gom email va password
    if (!data.portal) throw ['portal_invalid'];

    let company;
    if (data.portal !== process.env.DB_NAME) {
        company = await Company(
            connect(await getDbConnection()(), process.env.DB_NAME)
        )
            .findOne({ shortName: data.portal })
            .select('_id name shortName active log');
        if (!company) throw ['portal_invalid'];
    }

    await initModels(connect(await getDbConnection()(), data.portal), Models);

    const user = await User(connect(await getDbConnection()(), data.portal))
        .findOne({ email: data.email })
        .populate([
            {
                path: 'roles',
                populate: [{
                    path: 'roleId',
                    populate: { path: 'type' }
                }, {
                    path: 'delegation',
                    select: '_id delegator',
                    populate: { path: 'delegator', select: '_id name' }
                }]
            },
        ]);

    // Kích hoạt ủy quyền nếu startDate < now và chưa đến thời hạn thu hồi hoặc thu hồi nếu endDate < now
    await DelegationService.updateMissedDelegation(data.portal);

    // Lưu log login vào các ủy quyền có delegatee = userId
    let delegations = await Delegation(connect(await getDbConnection()(), data.portal)).find({ delegatee: user._id });
    delegations.forEach(async delegation => {
        await DelegationService.saveLog(data.portal, delegation, delegation.delegatee, null, 'login', new Date())
    })


    if (!user) throw ['email_password_invalid'];
    const validPass = await bcrypt.compare(data.password, user.password);
    if (!validPass) {
        throw ['email_password_invalid'];
    }
    if (user.roles.length < 1) throw ['acc_have_not_role'];

    if (user.roles[0].roleId.name !== 'System Admin') {
        if (!user.active) throw ['acc_blocked'];
        if (!company.active) throw ['service_off'];
    }

    const password2Exists = user.password2 ? true : false;

    const token = await jwt.sign(
        {
            _id: user._id,
            email: user.email,
            name: user.name,
            company:
                user.roles[0].roleId.name !== 'System Admin'
                    ? company
                    : undefined,
            portal:
                user.roles[0].roleId.name !== 'System Admin'
                    ? company.shortName
                    : process.env.DB_NAME,
            fingerprint: fingerprint,
        },
        process.env.TOKEN_SECRET
    );

    let tokenArr = [];
    let userParse = user.toObject();

    if (userParse?.tokens?.length === 10) { // nếu mảng tokens đã có 10 token thì thay thế token đầu tiên trong mảng tokens thành  requestToken user vừa gừi lên
        tokenArr = [...userParse.tokens, token]
        tokenArr.shift();
    } else { // chưa đủ 10 thì lại thêm tiếp
        if (userParse.tokens)
            tokenArr = [...userParse.tokens, token]
        else
            tokenArr = [token];
    }

    user.status = 0;
    user.tokens = tokenArr;

    if (data.pushNotificationToken) {
        var existTokens = user.pushNotificationTokens.filter(
            (token) => token === data.pushNotificationToken
        );
        if (existTokens.length === 0) {
            user.pushNotificationTokens.push(data.pushNotificationToken);
        }
    }

    user.save();

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            company:
                user.roles[0].roleId.name !== 'System Admin'
                    ? company
                    : undefined,
            portal:
                user.roles[0].roleId.name !== 'System Admin'
                    ? company.shortName
                    : process.env.DB_NAME,
            password2Exists,
        },
    };
};

/**
 * Đăng xuất tài khoản người dùng
 * @param {*} id : id người dùng
 * @param {*} token
 */
exports.logout = async (portal, id, requestToken) => {
    let user = await User(connect(getDbConnection()(), portal)).findById(id);

    if (user?.tokens?.length) {
        user.tokens = user?.tokens.filter(currentElement => currentElement !== requestToken);
    }

    let delegations = await Delegation(connect(getDbConnection()(), portal)).find({ delegatee: id });
    delegations.forEach(async delegation => {
        await DelegationService.saveLog(portal, delegation, delegation.delegatee, null, 'logout', new Date())
    })

    await user.save();
    return user;
};

/**
 * Đăng xuất tất cả tài khoản người dùng
 * @param {*} id : id người dùng
 */
exports.logoutAllAccount = async (portal, id) => {
    let user = await User(connect(await getDbConnection()(), portal)).findById(id);
    user.tokens = [];
    let delegations = await Delegation(connect(await getDbConnection()(), portal)).find({ delegatee: id });
    delegations.forEach(async delegation => {
        await DelegationService.saveLog(portal, delegation, delegation.delegatee, null, 'logout', new Date())
    })
    await user.save();

    return user;
};

/**
 * Quên mật khẩu tài khoản người dùng
 * @email: email người dùng
 * @password2: mật khẩu cấp 2 dự phòng khi quên mật khẩu
 */
exports.forgetPassword = async (portal, email, password2) => {
    if (!email)
        throw ['email_empty']
    if (!validateEmailValid(email))
        throw ['email_invalid']

    var user = await User(connect(await getDbConnection()(), portal)).findOne({ email });
    if (!user)
        throw ['email_not_found'];
    if (user.password2) {
        // Nếu người dùng đã có pass cấp 2 rồi thì kiểm tra xem pass c2 vừa nhập có trùng vs giá trị cũ hay không
        if (!password2)
            throw ['password2_empty'];
        const validPass = await bcrypt.compare(String(password2), user.password2);
        if (!validPass) throw ['password2_invalid'];
    }

    var code = await generator.generate({ length: 10, numbers: true });
    const token = jwt.sign({ email: email, code: code, portal: portal }, process.env.TOKEN_SECRET, { expiresIn: '30m' })

    console.log('=================================================')
    console.log('token', `${process.env.WEBSITE}/reset-password?token=${token}`);
    console.log('=================================================')
    user.resetPasswordToken = code;
    await user.save();

    let subject = `${process.env.WEB_NAME} : Thay đổi mật khẩu - Change password`;
    let html = `
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
exports.resetPassword = async (data) => {
    const { otp, token, password } = data;
    if (!token)
        throw ['token_empty'];
    if (!otp)
        throw ['otp_empty'];

    // Giải mã token
    const secret = jwt.verify(token, process.env.TOKEN_SECRET);

    // validate dữ liêu
    if (!secret.portal)
        throw ['portal_empty']

    if (!secret.email)
        throw ['email_empty'];

    if (secret.code !== otp)
        throw ['otp_invalid'];

    var user = await User(connect(await getDbConnection()(), secret.portal)).findOne({
        email: secret.email,
        resetPasswordToken: otp,
    });
    if (user === null) throw ['reset_password_invalid'];
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.resetPasswordToken = undefined;
    await user.save();

    return user;
};


exports.checkLinkValid = async (query) => {
    const { token } = query;
    const secret = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!token)
        throw ['token_reset_password_empty']; // token trống

    const findUser = await User(connect(await getDbConnection()(), secret.portal)).findOne({
        email: secret.email,
        resetPasswordToken: secret.code,
    });
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
exports.changeInformation = async (
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

    let user = await User(connect(await getDbConnection()(), portal))
        .findById(userId)
        .select('-password')
        .populate([{ path: 'roles', populate: { path: 'roleId' } }]);

    // Check nếu email mới trùng với 1 email nào đó có sẵn trong hệ thống thì không cho đổi
    if (email.toString() !== user.email.toString()) {
        let checkEmailExist = await User(connect(await getDbConnection()(), portal)).findOne({ email: email });
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
    let deleteAvatar = '.' + user.avatar;
    user.email = email;
    user.name = name;
    if (avatar) {
        if (
            deleteAvatar !== './upload/avatars/user.png' &&
            fs.existsSync(deleteAvatar)
        )
            fs.unlinkSync(deleteAvatar);
        user.avatar = avatar;
    }
    await user.save();

    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    delete user['password2'];

    // Tìm user trong bảng employees và cập nhật lại email
    // Trước khi cập nhật, kiểm tra email mới có trùng với nhân viên nào chưa
    const employees = await Employee(connect(await getDbConnection()(), portal)).findOne({ emailInCompany: email });
    if (!employees)
        await Employee(connect(await getDbConnection()(), portal)).findOneAndUpdate({ emailInCompany: oldEmail }, { $set: { emailInCompany: email } });

    return user;
};

/**
 * Thay đổi mật khẩu
 * @param {*} userId : id người dùng
 * @param {*} password : mật khẩu cũ
 * @param {*} new_password : mật khẩu mới
 */
exports.changePassword = async (portal, userId, password, new_password, confirmPassword, password2) => {
    if (!password)
        throw ['old_password_empty']

    if (!new_password)
        throw ['newPassword_empty']

    if (!confirmPassword)
        throw ['confirmPassword_empty']

    if (new_password !== confirmPassword)
        throw ['confirm_password_invalid']

    let user = await User(connect(await getDbConnection()(), portal))
        .findById(userId)
        .populate([{ path: 'roles', populate: { path: 'roleId' } }]);

    const validPass = await bcrypt.compare(password, user.password);
    // Kiểm tra mật khẩu cũ nhập vào có đúng hay không
    if (!validPass) throw ['password_invalid'];

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

    await user.save();

    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    delete user['password2'];
    delete user['password'];

    return user;
};


exports.changePassword2 = async (portal, userId, body) => {
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

    let user = await User(connect(await getDbConnection()(), portal))
        .findById(userId)
        .populate([{ path: 'roles', populate: { path: 'roleId' } }]);

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
 * Lấy ra các trang mà người dùng có quyền truy cập
 * @param {*} roleId : id role người dùng
 */
exports.getLinksThatRoleCanAccess = async (portal, roleId, userId) => {
    const role = await Role(connect(await getDbConnection()(), portal)).findById(roleId); //lay duoc role hien tai
    let roles = [role._id, ...role.parents];
    const privilege = await Privilege(connect(await getDbConnection()(), portal))
        .find({
            roleId: { $in: roles },
            resourceType: 'Link',
        })
        .populate({ path: 'resourceId' });
    const userrole = await UserRole(connect(await getDbConnection()(), portal)).findOne({ userId, roleId: role._id });


    // Lấy ds các link theo RBAC original và ko có policy
    let links = await privilege
        .filter((pri) => pri.resourceId.deleteSoft === false && pri.policies.length == 0)
        .map((pri) => pri.resourceId);

    // Gán thêm các link được phân quyền theo policy với những user có UserRole và Privilege khớp policy
    privilege.forEach(pri => {
        if (pri.policies.length > 0) {
            if (userrole.policies.length > 0) {
                if (pri.policies.some(policy => userrole.policies.includes(policy)) && pri.resourceId.deleteSoft === false) {
                    links = links.concat(pri.resourceId)
                }
            }
        }
    })

    let delegationAllowedLinks = [];
    // Nếu role đó là role được ủy quyền
    if (userrole.delegation) {
        let delegateeDelegation = await Delegation(connect(await getDbConnection()(), portal)).findOne({ _id: userrole.delegation });

        privilege.forEach(pri => {
            if (pri.delegations.length > 0) {
                // Kiểm tra privilege có được delegate không thì thêm links
                if (userrole.delegation) {
                    if (pri.delegations.some(delegation => userrole.delegation.toString() == delegation.toString()) && pri.resourceId.deleteSoft === false) {
                        delegationAllowedLinks = delegationAllowedLinks.concat(pri.resourceId);
                    }
                }
            }
        })
        // Lọc ra các link được phép truy cập theo tùy chọn trang trong cấu hình ủy quyền
        links = delegationAllowedLinks.length > 0 ? links.filter(link => delegationAllowedLinks.includes(link)) : links;
        await DelegationService.saveLog(portal, delegateeDelegation, delegateeDelegation.delegatee, role.name, 'switch_delegate_role', new Date())

    }

    return links;
};

/**
 * Lấy ra thông tn người dùng
 * @param {*} userId : id người dùng
 */
exports.getProfile = async (portal, userId) => {
    let user = await User(connect(await getDbConnection()(), portal))
        .findById(userId)
        .select('-password -status -deleteSoft -tokens')
        .populate([{ path: 'roles', populate: [{ path: 'roleId', populate: { path: 'type' } }, { path: 'delegation', select: '_id delegator', populate: { path: 'delegator', select: 'name' } }] }]).lean();
    if (user === null) throw ['user_not_found'];
    // user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;

    delete user['password2'];
    return user;
};

exports.createPassword2 = async (portal, userId, data) => {
    const { oldPassword, newPassword2, confirmNewPassword2 } = data;

    let user = await User(connect(await getDbConnection()(), portal)).findById(userId);
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

    await user.save();

    user = user.toObject();
    const password2Exists = user.password2 ? true : false;
    user['password2Exists'] = password2Exists;
    delete user['password2'];
    delete user['password'];

    return user;
}

exports.deletePassword2 = async (portal, data, userId) => {
    const { pwd2 } = data;
    if (!pwd2)
        throw ['password2_empty']

    let user = await User(connect(await getDbConnection()(), portal))
        .findById(userId)
        .populate([{ path: 'roles', populate: { path: 'roleId' } }]);

    const validPwd2 = await bcrypt.compare(pwd2, user.password2);
    if (!validPwd2) {
        throw ['password2_invalid'];
    }

    let userUpdate = await User(connect(await getDbConnection()(), portal)).findOneAndUpdate({ _id: userId }, { $unset: { password2: '' } }, { new: true })
    userUpdate = userUpdate.toObject();
    userUpdate['password2Exists'] = false;
    return userUpdate;
}

exports.checkPassword2Exists = async (portal, userId) => {
    const userToken = await User(
        connect(await getDbConnection()(), portal)
    ).findById(userId);
    if (userToken.numberDevice === 0) throw ['acc_log_out'];
    // Kiểm tra người dùng đã có mật khẩu cấp 2 hay chưa?
    if (userToken && userToken.password2) throw ['auth_password2_found']
}
