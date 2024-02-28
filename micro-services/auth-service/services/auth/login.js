const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Models = require('../../models');
const { Privilege, Role, User, Company, Employee, UserRole, Delegation } = Models;
const { connect, initModels } = require(`../../../../server-refactor/helpers/dbHelper`);
const DelegationService = require(`../delegation/delegation.service`);

/**
 * Phương thức đăng nhập
 */
exports.login = async (fingerprint, data) => {
    // data bao gom email va password
    if (!data.portal) throw ["portal_invalid"];

    let company;
    if (data.portal !== process.env.DB_NAME) {
        company = await Company(
            connect(DB_CONNECTION, process.env.DB_NAME)
        )
            .findOne({ shortName: data.portal })
            .select('_id name shortName active log');
        if (!company) throw ["portal_invalid"];
    }

    await initModels(connect(DB_CONNECTION, data.portal), Models);

    const user = await User(connect(DB_CONNECTION, data.portal))
        .findOne({ email: data.email })
        .populate([
            {
                path: "roles",
                populate: [{
                    path: "roleId",
                    populate: { path: "type" }
                }, {
                    path: "delegation",
                    select: "_id delegator",
                    populate: { path: "delegator", select: "_id name" }
                }]
            },
        ]);

    // Kích hoạt ủy quyền nếu startDate < now và chưa đến thời hạn thu hồi hoặc thu hồi nếu endDate < now  
    await DelegationService.updateMissedDelegation(data.portal);

    // Lưu log login vào các ủy quyền có delegatee = userId
    let delegations = await Delegation(connect(DB_CONNECTION, data.portal)).find({ delegatee: user._id });
    delegations.forEach(async delegation => {
        await DelegationService.saveLog(data.portal, delegation, delegation.delegatee, null, "login", new Date())
    })


    if (!user) throw ["email_password_invalid"];
    const validPass = await bcrypt.compare(data.password, user.password);
    if (!validPass) {
        throw ["email_password_invalid"];
    }
    if (user.roles.length < 1) throw ["acc_have_not_role"];

    if (user.roles[0].roleId.name !== "System Admin") {
        if (!user.active) throw ["acc_blocked"];
        if (!company.active) throw ["service_off"];
    }

    const password2Exists = user.password2 ? true : false;

    const token = await jwt.sign(
        {
            _id: user._id,
            email: user.email,
            name: user.name,
            company:
                user.roles[0].roleId.name !== "System Admin"
                    ? company
                    : undefined,
            portal:
                user.roles[0].roleId.name !== "System Admin"
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
                user.roles[0].roleId.name !== "System Admin"
                    ? company
                    : undefined,
            portal:
                user.roles[0].roleId.name !== "System Admin"
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
    let user = await User(connect(DB_CONNECTION, portal)).findById(id);

    if (user?.tokens?.length) {
        user.tokens = user?.tokens.filter(currentElement => currentElement !== requestToken);
    }

    let delegations = await Delegation(connect(DB_CONNECTION, portal)).find({ delegatee: id });
    delegations.forEach(async delegation => {
        await DelegationService.saveLog(portal, delegation, delegation.delegatee, null, "logout", new Date())
    })

    await user.save();
    return user;
};

/**
 * Đăng xuất tất cả tài khoản người dùng
 * @param {*} id : id người dùng
 */
exports.logoutAllAccount = async (portal, id) => {
    let user = await User(connect(DB_CONNECTION, portal)).findById(id);
    user.tokens = [];
    let delegations = await Delegation(connect(DB_CONNECTION, portal)).find({ delegatee: id });
    delegations.forEach(async delegation => {
        await DelegationService.saveLog(portal, delegation, delegation.delegatee, null, "logout", new Date())
    })
    await user.save();

    return user;
};


