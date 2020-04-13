const { Company, Link, LinkDefault, Privilege, Role, RoleDefault, RoleType, User } = require('../../../models/_export').data;
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
    console.log("sua cong ty", id);
    var company = await Company.findById(id);
    if(company === null) throw ('company_not_found');
    company.name = data.name;
    company.description = data.description;
    company.short_name = data.short_name;
    company.log = data.log;
    if(data.active !== null) company.active = data.active;
    await company.save();
    console.log("sua xong cong ty", company);

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

// Cập nhật các links của công ty vào trong collection company
exports.addLinksForCompanyInCollection = async(companyId, linkArr) => {
    const company = await Company.findById(companyId);
    company.links = linkArr;
    await company.save();

    return company;
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
    const newLink = await Link.create({
        url: linkUrl,
        description: linkDescription,
        company: companyId
    });
    const com = await Company.findById(companyId); // lấy dữ liệu về công ty này
    com.links.push(newLink._id);
    await com.save();

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
    const com = await Company.findById(companyId); // lấy dữ liệu về công ty này
    com.links.splice(com.links.indexOf(linkId), 1); // Xóa dữ liệu về link khỏi công ty này
    await com.save();

    return {
        company: companyId,
        link: linkId
    };
}