const {
    Company, Link, SystemLink, Component,
    SystemComponent, Privilege, Role, RootRole,
    RoleType, User, UserRole, ImportConfiguraion
} = require(`${SERVER_MODELS_DIR}/_multi-tenant`);

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Terms = require(`${SERVER_SEED_DIR}/terms`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách tất cả các công ty
 */
exports.getAllCompanies = async (query) => {

    let page = query.page;
    let limit = query.limit;

    if (!page && !limit) {
        return await Company(connect(DB_CONNECTION, process.env.DB_NAME))
            .find();
    } else {
        let option = (query.key && query.value)
            ? { [`${query.key}`]: new RegExp(query.value, "i") }
            : {};

        return await Company(connect(DB_CONNECTION, process.env.DB_NAME))
            .paginate(
                option,
                {
                    page,
                    limit
                }
            );
    }
}

/**
 * Lấy thông tin về 1 công ty theo id
 * @id id của công ty
 */
exports.getCompany = async (id) => {
    const company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findById(id);
    if (!company) throw ['company_not_found'];
    const superAdmin = await User(connect(DB_CONNECTION, company.shortName));

    return {
        ...company,
        superAdmin
    };
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @data dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
exports.createCompany = async (data) => {

    return await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .create({
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

    let company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findById(id);
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
exports.createCompanyRootRoles = async (portal) => {
    //Tạo các role root theo mẫu từ systemadmin và roleType
    let dataRoleType = await RoleType(connect(DB_CONNECTION, process.env.DB_NAME)).find();
    await RoleType(connect(DB_CONNECTION, portal)).insertMany(dataRoleType.map(role => {
        return { name: role.name }
    }));

    let rootType = await RoleType(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROLE_TYPES.ROOT });

    let admin = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.ADMIN.name });
    let superAdmin = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.SUPER_ADMIN.name, parents: [admin._id] });
    let dean = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.DEAN.name });
    let viceDean = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.VICE_DEAN.name });
    let employee = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.EMPLOYEE.name });

    return [admin, superAdmin, dean, viceDean, employee];
}

/**
 * Tạo tài khoản Superadmin của công ty
 * @companyId id của công ty
 * @companyName tên của công ty
 * @userEmail email của tài khoản được chọn làm super admin của công ty
 * @roleSuperAdminId Id của role SuperAdmin của công ty dùng để phân quyền cho tài khoản có email ở trên
 */
exports.createCompanySuperAdminAccount = async (companyShortName, userEmail) => {
    let checkEmail = await User(connect(DB_CONNECTION, companyShortName))
        .findOne({ email: userEmail });
    if (checkEmail) throw ['email_exist'];
    let roleSuperAdmin = await Role(connect(DB_CONNECTION, companyShortName))
        .findOne({ name: Terms.ROOT_ROLES.SUPER_ADMIN.name });
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

    let user = await User(connect(DB_CONNECTION, companyShortName))
        .create({
            name: `Super Admin`,
            email: userEmail,
            password: hash
        });
    let companyUpdate = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .findOne({ shortName: companyShortName });
    companyUpdate.superAdmin = user._id;
    await companyUpdate.save();

    await UserRole(connect(DB_CONNECTION, companyShortName))
        .create({
            userId: user._id,
            roleId: roleSuperAdmin._id
        })

    await transporter.sendMail(mainOptions);

    return user;
}

/**
 * Tạo link cho các trang web mà công ty có thể truy cập
 * @companyId id của công ty
 * @linkArr mảng các SystemLink làm chuẩn để tạo link cho công ty
 * @roleArr mảng các RootRole của công ty đó
 */
exports.createCompanyLinks = async (company, linkArr, roleArr) => {
    let checkIndex = (link, arr) => {
        let resIndex = -1;
        arr.forEach((node, i) => {
            if (node.url === link.url) {
                resIndex = i;
            }
        });

        return resIndex;
    }
<<<<<<< HEAD

    let allLinks = await SystemLink.find()
        .populate({ path: 'roles', model: RootRole });;
    let activeLinks = await SystemLink.find({ _id: { $in: linkArr } })
        .populate({ path: 'roles', model: RootRole });

    let dataLinks = allLinks.map(link => {
        if (checkIndex(link, activeLinks) === -1)
=======

    let allLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .find()
        .populate({ path: 'roles' });
    let activeLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({ _id: { $in: linkArr }})
        .populate({ path: 'roles' });

    let dataLinks = allLinks.map( link => {
        if(checkIndex(link, activeLinks) === -1)
>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
            return {
                url: link.url,
                category: link.category,
                description: link.description,
            }
        else return {
            url: link.url,
            category: link.category,
            description: link.description,
            deleteSoft: false
        }
    })

    let links = await Link(connect(DB_CONNECTION, company)).insertMany(dataLinks);

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
<<<<<<< HEAD
    await Privilege.insertMany(dataPrivilege);

    return await Link.find({ company: companyId })
        .populate({ path: 'roles', model: Privilege, populate: { path: 'roleId', model: Role } });
}
=======
    console.log("privileges");
    await Privilege(connect(DB_CONNECTION, company))
        .insertMany(dataPrivilege);
    console.log("link-create");
    return await Link(connect(DB_CONNECTION, company))
        .find()
        .populate({ path: 'roles', populate: { path: 'roleId' } });
}
>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9

/**
 * Tạo các component cho công ty
 * @companyId id của công ty
 * @linkArr mảng các system link được kích hoạt để làm chuẩn cho các link của công ty
 */
exports.createCompanyComponents = async (company, linkArr) => {

    let systemLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({ _id: { $in: linkArr } });

    let dataSystemComponents = systemLinks.map(link => link.components);
    dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
    dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);
<<<<<<< HEAD
    const systemComponents = await SystemComponent
        .find({ _id: { $in: dataSystemComponents } })
        .populate({ path: 'roles', model: RootRole });

    for (let i = 0; i < systemComponents.length; i++) {
        let sysLinks = await SystemLink.find({ _id: { $in: systemComponents[i].links } });
        let links = await Link.find({ company: companyId, url: sysLinks.map(link => link.url) });
=======
    const systemComponents = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({_id: {$in: dataSystemComponents}})
        .populate({ path: 'roles' });

    for (let i = 0; i < systemComponents.length; i++) {
        let sysLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).find({_id: {$in: systemComponents[i].links}});
        let links = await Link(connect(DB_CONNECTION, company)).find({url: sysLinks.map(link=>link.url)});
>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
        // Tạo component
        let component = await Component(connect(DB_CONNECTION, company)).create({
            name: systemComponents[i].name,
            description: systemComponents[i].description,
<<<<<<< HEAD
            links: links.map(link => link._id),
            company: companyId,
=======
            links: links.map(link=>link._id),
>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
            deleteSoft: false
        })
        for (let j = 0; j < links.length; j++) {
            let updateLink = await Link(connect(DB_CONNECTION, company)).findById(links[j]._id);
            updateLink.components.push(component._id);
            await updateLink.save();
        }
        // Tạo phân quyền cho components
        for (let k = 0; k < systemComponents.length; k++) {
<<<<<<< HEAD
            let roles = await Role.find({
                company: companyId,
                name: { $in: systemComponents[i].roles.map(role => role.name) }
=======
            let roles = await Role(connect(DB_CONNECTION, company)).find({
                name: {$in: systemComponents[i].roles.map(role=>role.name)}
>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
            });
            let dataPrivileges = roles.map(role => {
                return {
                    resourceId: component._id,
                    resourceType: 'Component',
                    roleId: role._id
                }
            });
            await Privilege(connect(DB_CONNECTION, company)).insertMany(dataPrivileges);
        }
    }

    return await Component(connect(DB_CONNECTION, company)).find();
}

/**
 * Chỉnh sửa email của tài khoản super admin của công ty
 * @companyId id của công ty
 * @superAdminEmail email dùng để thay thế làm email mới của super admin
 */
<<<<<<< HEAD
exports.editCompanySuperAdmin = async (companyId, superAdminEmail) => {

    let com = await Company.findById(companyId)
        .populate({ path: 'superAdmin', model: User });
    let roleSuperAdmin = await Role.findOne({ company: com._id, name: Terms.ROOT_ROLES.SUPER_ADMIN.name });

    let oldSuperAdmin = await User.findById(com.superAdmin._id);
=======
exports.editCompanySuperAdmin = async (company, superAdminEmail) => {

    let com = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({shortName: company})
        .populate({ path: 'superAdmin', model: User(connect(DB_CONNECTION, company)) });
    let roleSuperAdmin = await Role(connect(DB_CONNECTION, company)).findOne({ name: Terms.ROOT_ROLES.SUPER_ADMIN.name });

    let oldSuperAdmin = await User(connect(DB_CONNECTION, company)).findById(com.superAdmin._id);
>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
    if (oldSuperAdmin.email === superAdminEmail) {
        return oldSuperAdmin;
    } else {
        await UserRole(connect(DB_CONNECTION, company)).deleteOne({ userId: oldSuperAdmin._id, roleId: roleSuperAdmin._id });

        let user = await User(connect(DB_CONNECTION, company)).findOne({ email: superAdminEmail });
        if (user === null) {
<<<<<<< HEAD
            let newUser = await this.createCompanySuperAdminAccount(com._id, com.name, superAdminEmail);

=======
            let newUser = await this.createCompanySuperAdminAccount(com.shortName, com.name, superAdminEmail);

>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
            return newUser;
        } else {
            com.superAdmin = user._id;
            await com.save();
<<<<<<< HEAD
            await UserRole.create({ userId: user._id, roleId: roleSuperAdmin._id })

=======
            await UserRole(connect(DB_CONNECTION, company)).create({ userId: user._id, roleId: roleSuperAdmin._id })

>>>>>>> 924fb3ac1daaaa68fc368db73419a5e32284cbd9
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