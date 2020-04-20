const { Company, Link, LinkDefault, Component, ComponentDefault, Privilege, Role, RoleDefault, RoleType, User } = require('../../../models').schema;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Terms = require("../../../seed/terms");

exports.get = async () => {
    const companies = await Company.find()
        .populate([
            { path: "links", model: Link },
            { path: "super_admin", model: User, select: '_id name email' }
        ]);

    return companies;
}

exports.getById = async (id) => {
    
    return await Company.findOne({_id: id}).populate([
        { path: "links", model: Link },
        { path: "super_admin", model: User, select: '_id name email' }
    ]);
}

exports.getPaginate = async (limit, page, data={}) => {
    const companies = await Company.paginate( data , {page, limit, populate: [
        { path: 'links', model: Link },
        { path: "super_admin", model: User, select: '_id name email' }
    ]});

    return companies;
}

exports.create = async(data) => {
    const company = await Company.create({
        name: data.name,
        description: data.description,
        short_name: data.short_name
    });

    return company;
}

exports.edit = async(id, data) => {
    var company = await Company.findById(id);
    if(company === null) throw ('company_not_found');
    company.name = data.name;
    company.description = data.description;
    company.short_name = data.short_name;
    company.log = data.log;
    if(data.active !== null) company.active = data.active;
    await company.save();

    return company;
}

exports.delete = async(id) => {

    return await Company.deleteOne({ _id: id, customer: true });
}

exports.create5RoleAbstract = async(companyId) => {
    var data = await RoleDefault.find(); //dữ liệu về 5 role abstract có sẵn trong csdl
    var typeAbstract = await RoleType.findOne({ name: Terms.ROLE_TYPES.ABSTRACT });
    var roles = await data.map(role => {
        return {
            name: role.name,
            company: companyId,
            type: typeAbstract._id
        };
    })

    // 5 role abstract
    return await Role.insertMany(roles);
}

exports.createSuperAdminAccount = async(companyId, companyName, userEmail, roleSuperAdminId) => {
    var checkEmail = await User.findOne({email: userEmail});
    if(checkEmail !== null) throw ('email_exist');
    // 1.Tạo mật khẩu tự động cho acc Super Admin
    var salt = await bcrypt.genSaltSync(10);
    var password = await generator.generate({ length: 10, numbers: true });
    var hash = await bcrypt.hashSync(password, salt);

    // 2.Thiết lập nội dụng email gửi đến cho Super Admin của công ty
    var transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var mainOptions = {
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
        </div>
        `
    }
    // Tạo tài khoản Super Admin cho doanh nghiệp/công ty
    var user = await User.create({
        name: `Super Admin`,
        email: userEmail,
        password: hash,
        company: companyId
    });

    // Add role Super Admin cho tài khoản trên
    var ur = await UserRole.create({
        userId: user._id,
        roleId: roleSuperAdminId
    });
    
    // Gửi email xác thực cho người dùng đó
    var sendMail = await transporter.sendMail(mainOptions);
    
    return user;
}

exports.createLinksForCompany = async(companyId, linkArr, roleArr) => {
    // Lấy dữ liệu về các link mặc định ( url, thông tin, các role được phép truy cập)
    const linkDefaults = await LinkDefault.find({
        _id: { $in: linkArr }
    }).populate({ path: 'roles', model: RoleDefault });

    // Khởi tạo link vào các trang của website cho công ty
    const dataLinks = linkDefaults.map( link => {
        return {
            url: link.url,
            description: link.description,
            company: companyId
        };
    })
    const links = await Link.insertMany(dataLinks); // mảng các link của 1 cty mới

    var dataPrivilege = []; // Khởi tạo privilege gốc cho việc phân quyền giữa link và các role abstract của cty - ban đầu chưa có gì

    for (let i = 0; i < links.length; i++) {
        const link = links[i]; // link đang xét trong vòng lặp
        for (let j = 0; j < linkDefaults.length; j++) {
            const linkDefault = linkDefaults[j]; // link default đang xét hiện tại
            if(link.url === linkDefault.url){ // xác định đúng link đang xét giống vói link default hiện tại để check và gán phân quyền tuong ứng
                
                for (let x = 0; x < linkDefault.roles.length; x++) {
                    const roleDefault = linkDefault.roles[x]; //role đnag xét được truy cập vô link này
                    
                    for (let y = 0; y < roleArr.length; y++) {
                        const role = roleArr[y];
                        if(role.name === roleDefault.name){ // xác định role abstract tương ứng với role default được truy cập vô link này
                            
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
    await Privilege.insertMany(dataPrivilege); // thêm vào cơ sở dữ liệu
    const activeLinks = await LinkDefault.find({_id: { $in: linkArr }}); // lấy thông tin về các link được kích hoạt cho công ty này
    const data = await activeLinks.map(link => link.url); // mảng chứa url của các trang được kích hoạt
    await Link.updateMany({ url: { $in: data }},{ active: true });

    return await Link.find({company: companyId}).populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }});
} 

// Tạo các component tương ứng với các trang của công ty
exports.createComponentsForCompany = async(companyId, linkArr) => {
    const linkDefaults = await LinkDefault // lấy các link mặc định tương ứng với các link mà công ty có
        .find({ _id: { $in: linkArr }})
        .populate({ path: 'components', model: ComponentDefault, populate:{ path: 'roles', model: RoleDefault}});
    
    for (let i = 0; i < linkDefaults.length; i++) {
        const linkDefault = linkDefaults[i]; // Duyệt với linkDefault thứ i
        const link = await Link.findOne({ url: linkDefault.url, company: companyId }); // lấy giá trị của link tương ứng với link default này

        // Tạo các component tương ứng với link này
        for (let j = 0; j < linkDefault.components.length; j++) {
            const componentDefault = linkDefault.components[j]; // Component default làm mẫu để tạo component cho công ty
            const component = await Component.create({ // Tạo component này cho công ty
                name: componentDefault.name,
                description: componentDefault.description,
                link: link._id,
                company: companyId
            });
            for (let k = 0; k < componentDefault.roles.length; k++) { //duyệt các role tương ứng với componentDefault để add các role tương ứng với component của công ty
                const roleDefault = componentDefault.roles[k]; // Role default mẫu ứng với role của công ty
                const role = await Role.findOne({name: roleDefault.name, company: companyId}); // Lấy role của công ty tương ứng với role defaut này
                await Privilege.create({ // gán phân quyền tương ứng component với role
                    resourceId: component._id,
                    resourceType: 'Component',
                    roleId: role._id
                })
            }
        }
    }

    return await Component.find({company: companyId});
}

// Lấy tất cả các links của 1 công ty/doanh nghiệp
exports.getLinksForCompany = async(companyId) => {
    const check = await Company.findById(companyId);
    if(check === null) throw ('company_not_found');
    const links = await Link.find({company: companyId})
        .populate({ path: 'roles', model: Privilege, populate: { path: 'roleId', model: Role} });

    return links;
}

exports.editSuperAdminOfCompany = async(companyId, superAdminEmail) => {
    const com = await Company.findById(companyId);
    const roleSuperAdmin = await Role.findOne({ company: com._id, name: Terms.PREDEFINED_ROLES.SUPER_ADMIN.NAME}); // lay ttin role super admin cua cty do
    const user = await User.findOne({ company: com._id, email: superAdminEmail }); //tim thong tin ve tai khoan
    if(user === null){
        const newUser = await this.createSuperAdminAccount(com._id, com.name, superAdminEmail, roleSuperAdmin._id);
        com.super_admin = newUser._id;
        await com.save();

        return newUser;
    }else{
        com.super_admin = user._id; // Cap nhat lai super admin
        await com.save();

        return user;
    }
}

exports.addNewLinkForCompany = async(companyId, linkUrl, linkDescription) => {
    const check = await Link.findOne({
        company: companyId,
        url: linkUrl
    });
    if(check !== null) throw('url_exist');
    const newLink = await Link.create({
        url: linkUrl,
        description: linkDescription,
        company: companyId
    });

    return newLink;
}

exports.deleteLinkForCompany = async(companyId, linkId) => {
    // Xóa tắt cả phân quyền liên quan đến link này (role)
    await Privilege.deleteMany({
        resourceId: linkId,
        resourceType: 'Link'
    });
    // Xóa link này
    await Link.deleteOne({_id: linkId});

    return linkId;
}

exports.addNewComponentForCompany = async(companyId, componentName, componentDescription, linkId) => {
    const check = await Component.findOne({
        company: companyId,
        name: componentName
    });
    if(check !== null) throw('component_exist');
    const newComponent = await Component.create({
        name: componentName,
        description: componentDescription,
        link: linkId,
        company: companyId
    });

    return newComponent;
}

exports.deleteComponentForCompany = async(companyId, componentId) => {
    // Xóa tắt cả phân quyền liên quan đến component này (role)
    await Privilege.deleteMany({
        resourceId: componentId,
        resourceType: 'Component'
    });
    const link = await Link.findOne({
        company: companyId, 
        components: componentId
    });
    if(link !== null){
        link.components.splice(link.components.indexOf(componentId), 1);
        await link.save();
    }

    // Xóa component này
    await Component.deleteOne({_id: componentId});

    return componentId;
}

exports.getLinksListOfCompany = async(companyId) => {
    return await Link.find({ company: companyId });
}

exports.getLinksPaginateOfCompany = async (companyId, page, limit, data={}) => {
    const newData = await Object.assign({ company: companyId }, data );
    return await Link
        .paginate( newData , { 
            page, 
            limit
        });
}

exports.getComponentsListOfCompany = async (companyId) => {
    return await Component.find({ company: companyId })
        .populate([
            { path: 'link', model: Link}
        ]);
}

exports.getComponentById = async (componentId) => {
    return await Component.findById(componentId)
        .populate([
            { path: 'link', model: Link}
        ]);
}

exports.getComponentsPaginateOfCompany = async (companyId, page, limit, data={}) => {
    const newData = await Object.assign({ company: companyId }, data );
    return await Component
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                {path: 'link', model: Link}
            ]
        });
}