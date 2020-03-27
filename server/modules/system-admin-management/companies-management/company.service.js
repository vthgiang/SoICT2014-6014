const { Company, Link, LinkDefault, Privilege, Role, RoleDefault, RoleType, User } = require('../../../models/_export').data;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

exports.get = async () => {
    
    return await Company.find();
}

exports.getById = async (id) => {
    
    return await Company.findOne({_id: id});
}

exports.getPaginate = async (limit, page, data={}) => {
    return await Company
        .paginate( data , { 
            page, 
            limit
        });
}

exports.create = async(data) => {
    console.log("tạo cty: ",data);
    var name = await Company.findOne({ name: data.name });
    var test = await Company.findOne({ short_name: data.short_name });
    if(name || test) throw { msg: 'Short name already exists' };
    
    const company = await Company.create({
        name: data.name,
        description: data.description,
        short_name: data.short_name
    });
    console.log("Đã tạo: ", company)

    return company;
}

exports.edit = async(id, data) => {
    console.log("data com:", data);
    var company = await Company.findOne({_id: id});
    if(company === null) throw ({msg: 'company_not_found'});
    if(company.short_name !== data.short_name){
        //check shortname invalid?
        var test = await Company.findOne({ short_name: data.short_name }); 
        if(test) throw { msg: 'short_name_does_not_exist' }; 
    }
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
    var typeAbstract = await RoleType.findOne({ name: 'abstract' });

    //Admin
    var admin = await Role.create({
        name: data[1].name,
        company: companyId,
        type: typeAbstract._id
    });
    //Super Admin
    var superAdmin = await Role.create({
        name: data[0].name,
        company: companyId,
        type: typeAbstract._id,
        parents: [admin._id]
    });
    var dean = await Role.create({
        name: data[2].name,
        company: companyId,
        type: typeAbstract._id
    });
    var viceDean = await Role.create({
        name: data[3].name,
        company: companyId,
        type: typeAbstract._id
    });
    var employee = await Role.create({
        name: data[4].name,
        company: companyId,
        type: typeAbstract._id
    });

    return { superAdmin, admin, dean, viceDean, employee };
}

exports.createSuperAdminAccount = async(companyId, companyName, userEmail, roleSuperAdminId) => {
    console.log("Khởi tạo acc super admin")
    //1.Tạo mật khẩu tự động cho acc Super Admin
    var salt = await bcrypt.genSaltSync(10);
    // console.log("salt", salt)
    var password = await generator.generate({ length: 10, numbers: true });
    // console.log("pass", password)
    var hash = await bcrypt.hashSync(password, salt);
    // console.log("Hash", hash)

    //2.Thiết lập nội dụng email gửi đến cho Super Admin của công ty
    var transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    // console.log("khởi tạo transporter: ", transporter)
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
    // console.log("Khởi taoj nd mail: ", mainOptions)
    //Tạo tài khoản Super Admin cho doanh nghiệp/công ty
    var user = await User.create({
        name: `Super Admin ${companyName}`,
        email: userEmail,
        password: hash,
        company: companyId
    });

    
    // console.log("Tạo user: ", user);
    //Add role Super Admin cho tài khoản trên
    var ur = await UserRole.create({
        userId: user._id,
        roleId: roleSuperAdminId
    });
    // console.log("tạo ur: ", ur)
    //Gửi email xác thực cho người dùng đó
    var sendMail = await transporter.sendMail(mainOptions);
    // console.log("SEND MAIL: ", sendMail);
    
    return user;
}

exports.createLinksForCompany = async(companyId, superAdminId, adminId) => {
    //Lấy dữ liệu về các link mặc định 
    const linkDefault = await LinkDefault.find();

    //Khởi tạo link vào các trang của website cho công ty
    const dataLinks = linkDefault.map( link => {
        return {
            url: link.url,
            description: link.description,
            company: companyId
        };
    })
    // console.log("datalink: ", dataLinks)
    const links = await Link.insertMany(dataLinks);

    //gán quyền truy cập cho admin và super admin của công ty đó
    // await console.log("links: ", links)
    await links.map( async(link) => {
        await console.log("id: ",link._id, superAdminId, adminId)
        var admin =  await Privilege.create({
            resourceId: link._id,
            resourceType: 'Link',
            roleId: adminId
        });
        var superAdmin = await Privilege.create({
            resourceId: link._id,
            resourceType: 'Link',
            roleId: superAdminId
        });
        // await console.log("pri: ", superAdmin, admin)
        return {superAdmin, admin};
    });
} 