const mongoose = require('mongoose');
const {
    Service,
    Requester,
} = require(`../../../models`);
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const { connect } = require(`../../../helpers/dbHelper`);
const { sendEmail } = require('../../../helpers/emailHelper');

/**
 * Lấy danh sách services
 */
exports.getServices = async (portal, query = {}) => {
    var page = Number(query.page ?? 1);
    var perPage = Number(query.perPage ?? 10);

    keySearch = {}
    if (query.email) {
        keySearch = {
            ...keySearch,
            email: {
                $regex: query.email,
                $options: 'i'
            },
        };
    }
    if (query.name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: query.name,
                $options: 'i'
            },
        };
    }

    let services = await Service(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .select('-password -password2 -status -deleteSoft -tokens');

    const totalServices = await Service(connect(DB_CONNECTION, portal))
        .countDocuments(keySearch);
    const totalPages = query?.perPage
        ? Math.ceil(totalServices / query.perPage)
        : 1;
    return {
        data: services,
        totalServices,
        totalPages,
    };
};

/**
 * Lấy thông tin service theo id
 * @id id của service
 */
exports.getService = async (portal, id) => {
    var service = await Service(connect(DB_CONNECTION, portal))
        .findById(id)
        .select('-password -password2 -status -deleteSoft -tokens')
        .populate(
            {
                path: 'company',
            },
        );

    if (!service) {
        throw ['service_not_found'];
    }

    return service;
};

/**
 * Tạo tài khoản cho service
 * @data dữ liệu về service
 * @portal portal của db
 */
exports.createService = async (portal, data, company) => {
    if (!data.password) {
        data.password = generator.generate({
            length: 10,
            numbers: true,
        });
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(data.password, salt);

    if (!data.email)
        throw ['email_empty'];

    if (!data.name)
        throw ['servicename_empty'];

    var checkService = await Service(connect(DB_CONNECTION, portal)).findOne({
        email: data.email.trim(),
    });

    if (checkService) {
        throw ['email_exist'];
    }

    var service = await Service(connect(DB_CONNECTION, portal)).create({
        name: data.name.trim(),
        email: data.email.trim(),
        password: hash,
        company: company
    });

    await this.sendMailAboutCreatedAccount(data.email, data.password, portal);

    // sync new Service to Requester
    await Requester(connect(DB_CONNECTION, portal)).create({
        name: service.name,
        refId: service._id,
        type: 'Service',
        attributes: []
    });
    
    return service;
};

/**
 * Gửi email thông báo đã tạo tài khoản thành công
 * @email người nhận
 * @password của tài khoản đó
 */
exports.sendMailAboutCreatedAccount = async (email, password, portal) => {
    let subject = 'Xác thực tạo tài khoản trên hệ thống quản lý công việc';
    let text = 'Yêu cầu xác thực tài khoản đã đăng kí trên hệ thống với email là : ' + email;
    let html = `<html>
                <head>
                    <style>
                        .wrapper {
                            width: 100%;
                            min-width: 580px;
                            background-color: #FAFAFA;
                            padding: 10px 0;
                        }
                
                        .info {
                            list-style-type: none;
                        }
                
                        @media screen and (max-width: 600px) {
                            .form {
                                border: solid 1px #dddddd;
                                padding: 50px 30px;
                                border-radius: 3px;
                                margin: 0px 5%;
                                background-color: #FFFFFF;
                            }
                        }
                
                        .form {
                            border: solid 1px #dddddd;
                            padding: 50px 30px;
                            border-radius: 3px;
                            margin: 0px 25%;
                            background-color: #FFFFFF;
                        }
                
                        .title {
                            text-align: center;
                        }
                
                        .footer {
                            margin: 0px 25%;
                            text-align: center;
                
                        }
                    </style>
                </head>
                
                <body>
                    <div class='wrapper'>
                        <div class='title'>
                            <h1>${process.env.WEB_NAME}</h1>
                        </div>
                        <div class='form'>
                            <p><b>Thông tin tài khoản đăng nhập của bạn: </b></p>
                            <div class='info'>
                                <li>Portal: ${portal}</li>
                                <li>Tài khoản: ${email}</li>
                                <li>Mật khẩu: <b>${password}</b></li>
                            </div>
                            <p>Đăng nhập ngay tại: <a href='${process.env.WEBSITE}/login'>${process.env.WEBSITE}/login</a></p><br />
                
                            <p><b>Your account information: </b></p>
                            <div class='info'>
                                <li>Portal: ${portal}</li>
                                <li>Account: ${email}</li>
                                <li>Password: <b>${password}</b></li>
                            </div>
                            <p>Login in: <a href='${process.env.WEBSITE}/login'>${process.env.WEBSITE}/login</a></p>
                        </div>
                        <div class='footer'>
                            <p>Copyright by
                                <i>Công ty Cổ phần Công nghệ
                                    <br />
                                    An toàn thông tin và Truyền thông Việt Nam</i>
                            </p>
                        </div>
                    </div>
                </body>
        </html>`;
    return await sendEmail(email, subject, text, html);
};

/**
 * Gửi email thông báo thay đổi email tài khoản hiện tại
 * @oldEmail email cũ
 * @newEmail email mới
 */
exports.sendMailAboutChangeEmailOfServiceAccount = async (oldEmail, newEmail) => {
    let subject = 'Xác thực thay đổi email';
    let text = `Chuyển đổi email từ [${oldEmail}] => [${newEmail}] `;
    let html = '<p>Tài khoản dùng để đăng nhập của bạn là : </p>' +
        '<ul>' +
        '<li>Email cũ :' +
        oldEmail +
        '</li>' +
        '<li>Email mới :' +
        newEmail +
        '</li>' +
        '</ul>' +
        '<p>Your account use to login in system : </p>' +
        '<ul>' +
        '<li>Old email :' +
        oldEmail +
        '</li>' +
        '<li>New email :' +
        newEmail +
        '</li>' +
        '</ul>';

    return await sendEmail(newEmail, subject, text, html);
};


/**
 * Chỉnh sửa thông tin tài khoản người dùng
 * @id id tài khoản
 * @data dữ liệu chỉnh sửa
 */
exports.editService = async (portal, id, data) => {
    if (!data.email)
        throw ['email_empty'];
    if (!data.name)
        throw ['servicename_empty'];
    var service = await Service(connect(DB_CONNECTION, portal))
        .findById(id)
        .select('-password -password2 -status -deleteSoft')
        .populate([
            {
                path: 'roles',
                populate: {
                    path: 'roleId',
                },
            },
            {
                path: 'company',
            },
        ]);

    const name = data.name.trim();
    const email = data.email.trim();
    if (!service) {
        throw ['service_not_found'];
    }

    if (service.email !== email) {
        const checkEmail = await Service(connect(DB_CONNECTION, portal)).findOne({
            email: data.email,
        });
        if (checkEmail !== null) throw ['email_exist'];
        await this.sendMailAboutChangeEmailOfServiceAccount(
            service.email,
            data.email
        );
    }
    service.name = name;

    if (data.password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        service.password = hash;
    }

    if (data.active) {
        service.active = data.active;
    }

    if (service.active === false) {
        service.tokens = [];
    }

    const oldEmail = service.email;
    service.email = email;

    await service.save();

    // sync Service to Requester
    await Requester(connect(DB_CONNECTION, portal)).updateOne(
        {
            refId: service._id
        },
        {
            $set: { name: service.name }
        }
    );

    return service;
};

/**
 * Xóa tài khoản người dùng
 * @id id tài khoản người dùng
 */
exports.deleteService = async (portal, id) => {
    var deleteService = await Service(connect(DB_CONNECTION, portal)).deleteOne({
        _id: id,
    });

    // sync new Service to Requester
    await Requester(connect(DB_CONNECTION, portal)).deleteOne({
        refId: id,
    });

    return deleteService;
};

/**
 * Xóa tài khoản người dùng theo email
 * @email email tài khoản người dùng
 */
exports.deleteServiceByEmail = async (portal, email) => {
    var deleteService = await Service(connect(DB_CONNECTION, portal)).findOneAndDelete({
        email: email,
    }, { $new: true });

    if (deleteService) {
        // sync new User to Requester
        await Requester(connect(DB_CONNECTION, portal)).deleteOne({
            refId: deleteService._id,
        });
    }

    return deleteService;
};

/**
 * Lấy thông tin service theo email
 * @portal portal của db
 * @param {*} email : email service
 */
exports.getServiceInformByEmail = async (portal, email, company) => {
    let service = await Service(connect(DB_CONNECTION, portal)).findOne(
        {
            email: email,
            company: company,
        },
        {
            email: 1,
            _id: 1,
        }
    );
    return service;
};

exports.sendEmailResetPasswordService = async (portal, email) => {
    let service = await Service(connect(DB_CONNECTION, portal)).findOne({ email });
    // let code = await generator.generate({ length: 6, numbers: true });
    // service.resetPasswordToken = code;
    const salt = bcrypt.genSaltSync(10);
    const password = generator.generate({
        length: 10,
        numbers: true,
    });
    const hash = bcrypt.hashSync(password, salt);

    service.password = hash;

    if (service.password2) {
        service.password2 = ''
        await Service(connect(DB_CONNECTION, portal)).updateOne({
            _id: service._id,
        }, { $set: service })
    } else {
        await service.save();
    }

    let subject = `${process.env.WEB_NAME} : Thay đổi mật khẩu - Change password`;
    let text = `Yêu cầu cấp lại mật khẩu cho email ${email}`
    let html = `<html>
                <head>
                    <style>
                        .wrapper {
                            width: 100%;
                            min-width: 580px;
                            background-color: #FAFAFA;
                            padding: 10px 0;
                        }
                
                        .info {
                            list-style-type: none;
                        }
                
                        @media screen and (max-width: 600px) {
                            .form {
                                border: solid 1px #dddddd;
                                padding: 50px 30px;
                                border-radius: 3px;
                                margin: 0px 5%;
                                background-color: #FFFFFF;
                            }
                        }
                
                        .form {
                            border: solid 1px #dddddd;
                            padding: 50px 30px;
                            border-radius: 3px;
                            margin: 0px 25%;
                            background-color: #FFFFFF;
                        }
                
                        .title {
                            text-align: center;
                        }
                
                        .footer {
                            margin: 0px 25%;
                            text-align: center;
                
                        }
                    </style>
                </head>
                
                <body>
                    <div class='wrapper'>
                        <div class='title'>
                            <h1>${process.env.WEB_NAME}</h1>
                        </div>
                        <div class='form'>
                            <p><b>Thông tin tài khoản đăng nhập mới của bạn: </b></p>
                            <div class='info'>
                                <li>Portal: ${portal}</li>
                                <li>Tài khoản: ${email}</li>
                                <li>Mật khẩu: <b>${password}</b></li>
                            </div>
                            <p>Đăng nhập ngay tại: <a href='${process.env.WEBSITE}/login'>${process.env.WEBSITE}/login</a></p><br />
                
                            <p><b>Your account information: </b></p>
                            <div class='info'>
                                <li>Portal: ${portal}</li>
                                <li>Account: ${email}</li>
                                <li>Password: <b>${password}</b></li>
                            </div>
                            <p>Login in: <a href='${process.env.WEBSITE}/login'>${process.env.WEBSITE}/login</a></p>
                        </div>
                        <div class='footer'>
                            <p>Copyright by
                                <i>Công ty Cổ phần Công nghệ
                                    <br />
                                    An toàn thông tin và Truyền thông Việt Nam</i>
                            </p>
                        </div>
                    </div>
                </body>
        </html>`
    sendEmail(email, subject, text, html);

    return {
        portal, email
    }
}
