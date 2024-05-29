const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Models = require('../../models');
const { Company, Service } = Models;
const { connect, initModels } = require(`../../helpers/dbHelper`);
// const DelegationService = require(`../delegation/delegation.service`);

/**
 * Phương thức đăng nhập
 */
exports.login = async (data) => {
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

    const service = await Service(connect(DB_CONNECTION, data.portal))
        .findOne({ email: data.email });

    // Kích hoạt ủy quyền nếu startDate < now và chưa đến thời hạn thu hồi hoặc thu hồi nếu endDate < now  
    // await DelegationService.updateMissedDelegation(data.portal);

    // Lưu log login vào các ủy quyền có delegatee = userId
    // let delegations = await Delegation(connect(DB_CONNECTION, data.portal)).find({ delegatee: user._id });
    // delegations.forEach(async delegation => {
    //     await DelegationService.saveLog(data.portal, delegation, delegation.delegatee, null, "login", new Date())
    // })


    if (!service) throw ["email_password_invalid"];
    const validPass = await bcrypt.compare(data.password, service.password);
    if (!validPass) {
        throw ["email_password_invalid"];
    }

    const token = await jwt.sign(
        {
            _id: service._id,
            email: service.email,
            name: service.name,
            company: company,
            portal: company.shortName,
            thirdParty: true
        },
        process.env.TOKEN_SECRET
    );

    let tokenArr = [];
    let serviceParse = service.toObject();

    if (serviceParse?.tokens?.length === 10) { // nếu mảng tokens đã có 10 token thì thay thế token đầu tiên trong mảng tokens thành  requestToken user vừa gừi lên
        tokenArr = [...serviceParse.tokens, token]
        tokenArr.shift();
    } else { // chưa đủ 10 thì lại thêm tiếp
        if (serviceParse.tokens)
            tokenArr = [...serviceParse.tokens, token]
        else
            tokenArr = [token];
    }

    service.status = 0;
    service.tokens = tokenArr;

    service.save();

    return {
        token,
        service: {
            _id: service._id,
            email: service.email,
            name: service.name,
            company: company,
            portal: company.shortName
        },
    };
};

/**
 * Đăng xuất tài khoản người dùng
 * @param {*} id : id người dùng
 * @param {*} token
 */
exports.logout = async (portal, id, requestToken) => {
    let service = await Service(connect(DB_CONNECTION, portal)).findById(id);

    if (!service?.tokens || !service.tokens.some(x => x == requestToken)) {
        throw ["token_invalid"];
    }
    
    if (service?.tokens?.length) {
        service.tokens = service?.tokens.filter(currentElement => currentElement !== requestToken);
    }

    // let delegations = await Delegation(connect(DB_CONNECTION, portal)).find({ delegatee: id });
    // delegations.forEach(async delegation => {
    //     await DelegationService.saveLog(portal, delegation, delegation.delegatee, null, "logout", new Date())
    // })

    await service.save();
    return service;
};
