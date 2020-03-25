const { Company, Link, LinkDefault, Privilege, Role, RoleDefault, RoleType, User } = require('../../../models/_export').data;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

exports.get = async () => {
    
    return await Company.find({customer: true});
}

exports.getById = async (id) => {
    
    return await Company.findOne({_id: id, customer: true});
}

exports.getPaginate = async (limit, page, data={}) => {
    const newData = await Object.assign( {customer: true}, data );
    return await Company
        .paginate( newData , { 
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
    var company = await Company.findOne({_id: id, customer: true});
    if(company.short_name !== data.short_name){
        //check shortname invalid?
        var test = await Company.findOne({ short_name: data.short_name }); 
        if(test) throw { msg: 'Short name already exists' }; 
    }
    company.name = data.name;
    company.description = data.description;
    company.short_name = data.short_name;
    company.log = data.log;
    if(data.active !== null) company.active = data.active;
    company.save();

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
    //1.Tạo mật khẩu tự động cho acc Super Admin
    var salt = bcrypt.genSaltSync(10);
    var password = generator.generate({ length: 10, numbers: true });
    var hash = bcrypt.hashSync(password, salt);

    //2.Thiết lập nội dụng email gửi đến cho Super Admin của công ty
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: data.email,
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
    //Tạo tài khoản Super Admin cho doanh nghiệp/công ty
    var user = await User.create({
        name: `Super Admin ${companyName}`,
        email: userEmail,
        password: hash,
        company: companyId
    });
    //Add role Super Admin cho tài khoản trên
    await UserRole.create({
        userId: user._id,
        roleId: roleSuperAdminId
    });
    //Gửi email xác thực cho người dùng đó
    await transporter.sendMail(mainOptions);
    
    return user;
}

exports.createLinksForCompany = async(companyId, superAdminId, adminId) => {
    //Lấy dữ liệu về các link mặc định 
    const data = await LinkDefault.find();

    //Khởi tạo link vào các trang của website cho công ty
    const links = await data.map( async(link) => {
        return await Link.create({
            url: link.url,
            description: link.description,
            company: companyId
        });
    });

    //gán quyền truy cập cho admin và super admin của công ty đó
    await links.map( async(link) => {
        var admin =  await Privilege.create({
            resource: link._id,
            resource_type: 'Link',
            role: adminId
        });
        var superAdmin = await Privilege.create({
            resource: link._id,
            resource_type: 'Link',
            role: superAdminId
        });

        return {superAdmin, admin};
    });
} 