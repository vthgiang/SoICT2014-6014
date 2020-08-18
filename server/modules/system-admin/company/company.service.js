const { 
    Company, Link, SystemLink, Component,
    SystemComponent, Privilege, Role, RootRole, 
    RoleType, User, UserRole, ImportConfiguraion 
} = require(SERVER_MODELS_DIR).schema;

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Terms = require(SERVER_SEED_DIR+"/terms");

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
                        ? { [`${query.key}`] : new RegExp(query.value, "i") }
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
 * Xóa dữ liệu 1 công ty
 * @id id của công ty trong database
 */
exports.deleteCompany = async (id) => {

    return await Company.deleteOne({ _id: id, customer: true });
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
        `
        <div>
            <p>Tài khoản dùng để đăng nhập của SUPER ADMIN: </p>
            <ul>
                <li>Tài khoản : ${userEmail}</li>
                <li>Mật khẩu : ${password}</li>
            </ul>
            <p>Đăng nhập ngay tại : <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p><br/>
            <p>SUPER ADMIN account information: </p>
            <ul>
                <li>Account : ${userEmail}</li>
                <li>Password : ${password}</li>
            </ul>
            <p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>
        </div>tr45
        `
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
        let resIndex =-1;
        arr.forEach((node, i) => {
            if(node.url === link.url){
                resIndex = i;
            }
        });

        return resIndex;
    }
    let allLinks = await SystemLink.find()
        .populate({ path: 'roles', model: RootRole });;
    let activeLinks = await SystemLink.find({ _id: { $in: linkArr } })
        .populate({ path: 'roles', model: RootRole });
    
    let dataLinks = allLinks.map( link => {
        if(checkIndex(link, activeLinks) === -1)
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

    let systemLinks = await SystemLink.find({ _id: { $in: linkArr } })
        .populate({ path: 'components', model: SystemComponent, populate: { path: 'roles', model: RootRole } });
    
    for (let i = 0; i < systemLinks.length; i++) {
        let systemLink = systemLinks[i];
        let link = await Link.findOne({ url: systemLink.url, company: companyId });

        for (let j = 0; j < systemLink.components.length; j++) {
            let systemComponent = systemLink.components[j];
            let component = await Component.create({
                name: systemComponent.name,
                description: systemComponent.description,
                link: link._id,
                company: companyId,
                deleteSoft: false
            });
            let updateLink = await Link.findById(link._id);
            updateLink.components = [component._id, ...updateLink.components];
            await updateLink.save();

            for (let k = 0; k < systemComponent.roles.length; k++) {
                let rootRole = systemComponent.roles[k];
                let role = await Role.findOne({ name: rootRole.name, company: companyId });
                await Privilege.create({
                    resourceId: component._id,
                    resourceType: 'Component',
                    roleId: role._id
                })
            }
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
 * Thêm link mới cho công ty
 * @companyId id của công ty
 * @linkUrl đường dẫn cho link muốn tạo
 * @linkDescription mô tả về link
 */
exports.addCompanyLink = async (companyId, data) => {

    let check = await Link.findOne({
        company: companyId,
        url: data.url
    });
    if(check) throw ['url_exist'];

    let newLink = await Link.create({
        url: data.url,
        description: data.description,
        category: data.category,
        company: companyId
    });

    let systemLink = await SystemLink.findOne({ 'url': data.url });

    for (let i=0; i<systemLink.roles.length; i++) {
        let role = await RootRole.aggregate([
            { $match: { '_id': systemLink.roles[i]._id } },

            { $lookup: {
                from: "roles",
                localField: "name",
                foreignField: "name",
                as: "roles"
            } },

            { $unwind: '$roles' },
            { $replaceRoot: { newRoot: '$roles' } },

            { $match: { 'company': newLink.company } },
        ])
        
        await Privilege.create({
            'resourceId': newLink._id,
            'resourceType': 'Link',
            'roleId': role[0]._id
        })
    }

    return newLink;
}

/**
 * Xóa 1 link của công ty
 * @companyId id của công ty
 * @linkId id của link muốn xóa
 */
exports.deleteCompanyLink = async (companyId, linkId) => {
    
    await Privilege.deleteMany({
        resourceId: linkId,
        resourceType: 'Link'
    });
    
    await Link.deleteOne({ _id: linkId });

    return linkId;
}

/**
 * Thêm mới 1 component cho công ty
 * @companyId id của công ty
 * @componentname tên của component
 * @componentDescription mô tả về component
 * @linkId id của link được chứa component này
 */
exports.addCompanyComponent = async (companyId, data) => {

    let check = await Component.findOne({
        company: companyId,
        name: data.name
    });
    if(check) throw ['component_exist'];

    let link = await Link.findOne({ company: companyId, url: data.link });
    let newComponent = await Component.create({
        name: data.name,
        description: data.description,
        link: link ? link._id : null,
        company: companyId
    });

    return newComponent;
}

/**
 * Xóa một của component của công ty
 * @companyId id của công ty
 * @componentId id của component muốn xóa
 */
exports.deleteCompanyComponent = async (companyId, componentId) => {
    
    await Privilege.deleteMany({
        resourceId: componentId,
        resourceType: 'Component'
    });

    let link = await Link.findOne({
        company: companyId, 
        components: componentId
    });
    if(link){
        link.components.splice(link.components.indexOf(componentId), 1);
        await link.save();
    }

    await Component.deleteOne({ _id: componentId });

    return componentId;
}

/**
 * Lấy danh sách tất cả các link của công ty
 * @companyId id của công ty muốn lấy danh sách các link
 */
exports.getCompanyLinks = async (companyId, query) => {

    let check = await Company.findById(companyId);
    if(!check) throw ['company_not_found'];

    let page = query.page;
    let limit = query.limit;
    if (!page && !limit) {

        return await Link
            .find({ company: companyId, deleteSoft: false })
            .populate({ path: 'roles', model: Privilege, populate: { path: 'roleId', model: Role } });
    } else {
        let option = (query.key && query.value)
            ? Object.assign({ company: companyId, deleteSoft: false }, { [`${query.key}`]: new RegExp(query.value, "i") })
            : { company: companyId, deleteSoft: false };

        return await Link.paginate( 
            option, 
            {
                page, 
                limit, 
                populate: [
                    { path: 'roles', model: Privilege, populate: { path: 'roleId', model: Role } }
                ]
            }
        );
    }
}

/**
 * Lấy danh sách các component của công ty
 * @companyId id của công ty
 */
exports.getCompanyComponents = async (companyId, query) => {

    let check = await Company.findById(companyId);
    if(!check) throw ['company_not_found'];

    let page = query.page;
    let limit = query.limit;
    if (!page && !limit) {
        return await Component.find({ company: companyId })
            .populate([
                { path: 'link', model: Link }
            ]);
    } else {
        let option = (query.key && query.value)
            ? Object.assign({ company: companyId }, { [`${query.key}`]: new RegExp(query.value, "i") })
            : { company: companyId };
        let rescom = await Component
            .paginate( 
                option, 
                { 
                    page, 
                    limit,
                    populate: [
                        { path: 'link', model: Link }
                    ]
                }
            );

        return rescom;
    }
}

/**
 * Lấy component
 * @componentId id của component
 */
exports.getComponentById = async (componentId) => {

    return await Component.findById(componentId)
        .populate([
            { path: 'link', model: Link }
        ]);
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