const {
    Company, Link, SystemLink, Component,
    SystemComponent, Privilege, Role, RootRole,
    RoleType, User, UserRole, ImportConfiguraion
} = require(SERVER_MODELS_DIR).schema;

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Terms = require(SERVER_SEED_DIR + "/terms");

/**
 * Lấy danh sách tất cả các công ty
 */
exports.getAllCompanies = async (query) => {

    let page = query.page;
    let limit = query.limit;

    if (!page && !limit) {
        return await Company
            .find()
            .populate([
                { path: "links", model: Link },
                { path: "superAdmin", model: User, select: '_id name email' }
            ]);
    } else {
        let option = (query.key && query.value)
            ? { [`${query.key}`]: new RegExp(query.value, "i") }
            : {};

        return await Company.paginate(
            option,
            {
                page,
                limit,
                populate: [
                    { path: 'links', model: Link },
                    { path: "superAdmin", model: User, select: '_id name email' }
                ]
            }
        );
    }
}

/**
 * Lấy thông tin về 1 công ty theo id
 * @id id của công ty
 */
exports.getCompany = async (id) => {

    return await Company
        .findById(id)
        .populate([
            { path: "links", model: Link },
            { path: "superAdmin", model: User, select: '_id name email' }
        ]);
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @data dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
exports.createCompany = async (data) => {

    return await Company.create({
        name: data.name,
        description: data.description,
        shortName: data.shortName
    });
}

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
exports.editCompany = async (id, data) => {

    let company = await Company.findById(id);
    if (!company) throw ['company_not_found'];

    company.name = data.name;
    company.description = data.description;
    company.shortName = data.shortName;
    company.log = data.log;

    if (data.active) company.active = data.active;

    await company.save();

    return company;
}

/**
 * Tạo 5 root roles khi tạo mới 1 company
 * @SuperAdmin super admin của công ty đó
 * @Admin admin của công ty
 * @Dean trưởng đơn vị
 * @ViceDean phó đơn vị
 * @Employee nhân viên đơn vị
 */
exports.createCompanyRootRoles = async (companyId) => {

    let data = await RootRole.find();
    let rootType = await RoleType.findOne({ name: Terms.ROLE_TYPES.ROOT });
    let roles = await data.map(role => {
        return {
            name: role.name,
            company: companyId,
            type: rootType._id
        };
    })

    return await Role.insertMany(roles);
}

/**
 * Tạo tài khoản Superadmin của công ty
 * @companyId id của công ty
 * @companyName tên của công ty
 * @userEmail email của tài khoản được chọn làm super admin của công ty
 * @roleSuperAdminId Id của role SuperAdmin của công ty dùng để phân quyền cho tài khoản có email ở trên
 */
exports.createCompanySuperAdminAccount = async (companyId, companyName, userEmail) => {

    let checkEmail = await User.findOne({ email: userEmail });
    if (checkEmail) throw ['email_exist'];

    let roleSuperAdmin = await Role.findOne({ company: companyId, name: Terms.ROOT_ROLES.SUPER_ADMIN.name });
    let salt = await bcrypt.genSaltSync(10);
    let password = await generator.generate({ length: 10, numbers: true });
    let hash = await bcrypt.hashSync(password, salt);

    let transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    let mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: userEmail,
        subject: `Tạo tài khoản SUPER ADMIN cho doanh nghiệp/công ty ${companyName}`,
        text: `Email thông báo đăng kí thành công sử dụng dịch vụ Quản lý công việc và thông tin về tài khoản SUPER ADMIN của doanh nghiệp/công ty ${companyName}.`,
        html:
            `<html>
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
                <div class="wrapper">
                    <div class="title">
                        <h1>VNIST-QLCV</h1>
                    </div>
                    <div class="form">
                        <p><b>Tài khoản đăng nhập của SUPER ADMIN: </b></p>
                        <div class="info">
                            <li>Tài khoản: ${userEmail}</li>
                            <li>Mật khẩu: <b>${password}</b></li>
                        </div>
                        <p>Đăng nhập ngay tại: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p><br />
            
                        <p><b>SUPER ADMIN account information: </b></p>
                        <div class="info">
                            <li>Tài khoản: ${userEmail}</li>
                            <li>Mật khẩu: <b>${password}</b></li>
                        </div>
                        <p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>
                    </div>
                    <div class="footer">
                        <p>Bản quyền thuộc về
                            <i>Công ty Cổ phần Công nghệ
                                <br />
                                An toàn thông tin và Truyền thông Việt Nam</i>
                        </p>
                    </div>
                </div>
            </body>
        </html>`
    }

    let user = await User.create({
        name: `Super Admin`,
        email: userEmail,
        password: hash,
        company: companyId
    });

    let companyUpdate = await Company.findById(companyId);
    companyUpdate.superAdmin = user._id;
    await companyUpdate.save();

    await UserRole.create({
        userId: user._id,
        roleId: roleSuperAdmin._id
    });

    await transporter.sendMail(mainOptions);

    return user;
}

/**
 * Tạo link cho các trang web mà công ty có thể truy cập
 * @companyId id của công ty
 * @linkArr mảng các SystemLink làm chuẩn để tạo link cho công ty
 * @roleArr mảng các RootRole của công ty đó
 */
exports.createCompanyLinks = async (companyId, linkArr, roleArr) => {
    let checkIndex = (link, arr) => {
        let resIndex = -1;
        arr.forEach((node, i) => {
            if (node.url === link.url) {
                resIndex = i;
            }
        });

        return resIndex;
    }

    let allLinks = await SystemLink.find()
        .populate({ path: 'roles', model: RootRole });;
    let activeLinks = await SystemLink.find({ _id: { $in: linkArr } })
        .populate({ path: 'roles', model: RootRole });

    let dataLinks = allLinks.map(link => {
        if (checkIndex(link, activeLinks) === -1)
            return {
                url: link.url,
                category: link.category,
                description: link.description,
                company: companyId
            }
        else return {
            url: link.url,
            category: link.category,
            description: link.description,
            company: companyId,
            deleteSoft: false
        }
    })

    let links = await Link.insertMany(dataLinks);

    //Thêm phân quyền cho link
    let dataPrivilege = [];
    for (let i = 0; i < links.length; i++) {
        let link = links[i];

        for (let j = 0; j < allLinks.length; j++) {
            let systemLink = allLinks[j];

            if (link.url === systemLink.url) {
                for (let x = 0; x < systemLink.roles.length; x++) {
                    let rootRole = systemLink.roles[x];

                    for (let y = 0; y < roleArr.length; y++) {
                        let role = roleArr[y];

                        if (role.name === rootRole.name) {
                            dataPrivilege.push({
                                resourceId: link._id,
                                resourceType: 'Link',
                                roleId: role._id
                            });
                        }
                    }
                }
            }
        }
    }
    await Privilege.insertMany(dataPrivilege);

    return await Link.find({ company: companyId })
        .populate({ path: 'roles', model: Privilege, populate: { path: 'roleId', model: Role } });
}

/**
 * Tạo các component cho công ty
 * @companyId id của công ty
 * @linkArr mảng các system link được kích hoạt để làm chuẩn cho các link của công ty
 */
exports.createCompanyComponents = async (companyId, linkArr) => {

    let systemLinks = await SystemLink.find({ _id: { $in: linkArr } });

    let dataSystemComponents = systemLinks.map(link => link.components);
    dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
    dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);
    const systemComponents = await SystemComponent
        .find({ _id: { $in: dataSystemComponents } })
        .populate({ path: 'roles', model: RootRole });

    for (let i = 0; i < systemComponents.length; i++) {
        let sysLinks = await SystemLink.find({ _id: { $in: systemComponents[i].links } });
        let links = await Link.find({ company: companyId, url: sysLinks.map(link => link.url) });
        // Tạo component
        let component = await Component.create({
            name: systemComponents[i].name,
            description: systemComponents[i].description,
            links: links.map(link => link._id),
            company: companyId,
            deleteSoft: false
        })
        for (let j = 0; j < links.length; j++) {
            let updateLink = await Link.findById(links[j]._id);
            updateLink.components.push(component._id);
            await updateLink.save();
        }
        // Tạo phân quyền cho components
        for (let k = 0; k < systemComponents.length; k++) {
            let roles = await Role.find({
                company: companyId,
                name: { $in: systemComponents[i].roles.map(role => role.name) }
            });
            let dataPrivileges = roles.map(role => {
                return {
                    resourceId: component._id,
                    resourceType: 'Component',
                    roleId: role._id
                }
            });
            await Privilege.insertMany(dataPrivileges);
        }
    }

    return await Component.find({ company: companyId });
}

/**
 * Chỉnh sửa email của tài khoản super admin của công ty
 * @companyId id của công ty
 * @superAdminEmail email dùng để thay thế làm email mới của super admin
 */
exports.editCompanySuperAdmin = async (companyId, superAdminEmail) => {

    let com = await Company.findById(companyId)
        .populate({ path: 'superAdmin', model: User });
    let roleSuperAdmin = await Role.findOne({ company: com._id, name: Terms.ROOT_ROLES.SUPER_ADMIN.name });

    let oldSuperAdmin = await User.findById(com.superAdmin._id);
    if (oldSuperAdmin.email === superAdminEmail) {
        return oldSuperAdmin;
    } else {
        await UserRole.deleteOne({ userId: oldSuperAdmin._id, roleId: roleSuperAdmin._id });

        let user = await User.findOne({ company: com._id, email: superAdminEmail });
        if (user === null) {
            let newUser = await this.createCompanySuperAdminAccount(com._id, com.name, superAdminEmail);

            return newUser;
        } else {
            com.superAdmin = user._id;
            await com.save();
            await UserRole.create({ userId: user._id, roleId: roleSuperAdmin._id })

            return user;
        }
    }
}

/**
 * Lấy thông tin cấu hình file import
 * @type Thể loại file cấu hình(salary, taskTemplate);
 * @company id công ty
 */
exports.getImportConfiguraion = async (type, company) => {

    return await ImportConfiguraion.findOne({
        type: type,
        company: company
    });
};

/**
 * Tạo thông tin cấu hình file import
 * @data Thông tin cấu hình file import
 * @company id công ty
 */
exports.createImportConfiguraion = async (data, company) => {

    return await ImportConfiguraion.create({
        company: company,
        configuration: data.configuration,
        type: data.type
    })
};

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @id id thông tin cấu hình file import cần sửa
 * @data Dữ liệu chinhe sửa file cấu hình
 */
exports.editImportConfiguraion = async (id, data) => {

    let oldImportConfiguraion = await ImportConfiguraion.findById(id);

    oldImportConfiguraion.configuration = {
        ...data.configuration
    };

    await oldImportConfiguraion.save();

    return await ImportConfiguraion.findById(id);
};