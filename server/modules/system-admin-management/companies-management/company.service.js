const { Company, Link, LinkDefault, Privilege, Role, RoleDefault, RoleType, User } = require('../../../models/_export').data;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Terms = require("../../../seed/terms");

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
    // console.log("tạo cty: ",data);
    var name = await Company.findOne({ name: data.name });
    var test = await Company.findOne({ short_name: data.short_name });
    if(name || test) throw { msg: 'Short name already exists' };
    
    const company = await Company.create({
        name: data.name,
        description: data.description,
        short_name: data.short_name
    });
    // console.log("Đã tạo: ", company)

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
    if(checkEmail !== null) throw ({msg: 'Email này đã được đăng kí sử dụng. Vui lòng chọn 1 email khác.'})
    console.log("Khởi tạo acc super admin")
    // 1.Tạo mật khẩu tự động cho acc Super Admin
    var salt = await bcrypt.genSaltSync(10);
    // console.log("salt", salt)
    var password = await generator.generate({ length: 10, numbers: true });
    // console.log("pass", password)
    var hash = await bcrypt.hashSync(password, salt);
    // console.log("Hash", hash)

    // 2.Thiết lập nội dụng email gửi đến cho Super Admin của công ty
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
    // Tạo tài khoản Super Admin cho doanh nghiệp/công ty
    var user = await User.create({
        name: `Super Admin ${companyName}`,
        email: userEmail,
        password: hash,
        company: companyId
    });

    
    // console.log("Tạo user: ", user);
    // Add role Super Admin cho tài khoản trên
    var ur = await UserRole.create({
        userId: user._id,
        roleId: roleSuperAdminId
    });
    // console.log("tạo ur: ", ur)
    // Gửi email xác thực cho người dùng đó
    var sendMail = await transporter.sendMail(mainOptions);
    // console.log("SEND MAIL: ", sendMail);
    
    return user;
}

exports.createLinksForCompany = async(companyId, roleArr) => {
    // Lấy dữ liệu về các link mặc định ( url, thông tin, các role được phép truy cập)
    const linkDefaults = await LinkDefault.find().populate({ path: 'roles', model: RoleDefault });

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
                console.log("tìm thấy link giống nhau: ", link.url, linkDefault.url);   
                console.log("roles default: ", linkDefault.roles);   
                for (let x = 0; x < linkDefault.roles.length; x++) {
                    const roleDefault = linkDefault.roles[x]; //role đnag xét được truy cập vô link này
                    console.log("roles default node: ", roleDefault);  
                    for (let y = 0; y < roleArr.length; y++) {
                        const role = roleArr[y];
                        if(role.name === roleDefault.name){ // xác định role abstract tương ứng với role default được truy cập vô link này
                            console.log("Thêm role cho link")
                            dataPrivilege.push({
                                resourceId: link._id,
                                resourceType: 'Link',
                                roleId: role._id
                            });
                            console.log("Mảng pri: ", dataPrivilege);
                        }
                    }
                }
            }
        }
    }

    console.log("Data về privileges của cty: ",dataPrivilege);

    await Privilege.insertMany(dataPrivilege); // thêm vào cơ sở dữ liệu

    return await Link.find({company: companyId}).populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }});
} 