const Log = require('../models/log.model');
const RoleType = require('../models/role_type.model');
const Role = require('../models/role.model');
const Company = require('../models/company.model');
const Link = require('../models/link.model');
const Privilege = require('../models/privilege.model');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config({path: '../.env'});

// DB CONFIG
const db = process.env.DATABASE;

// kẾT NỐI TỚI CSDL MONGODB
mongoose.connect( db, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Kết nối thành công đến MongoDB!\n");
    }).catch(err => console.log("ERROR! :(\n", err));

const fakeData = async () => {
    console.log("Đang fake dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU VỀ CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  
    console.log("Khởi tạo dữ liệu công ty!");
    var xyz = await Company.create({
        name: 'Công ty TNHH XYZ',
        short_name: 'xys',
        description: 'Công ty TNHH XYZ'
    });
    console.log(`Xong! Công ty [${xyz.name}] đã được tạo.`);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC TÀI KHOẢN NGƯỜI DÙNG CHO CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log(`Khởi tạo các tài khoản cho công ty [${xyz.name}]`);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User.insertMany([
        {
            name: 'Super Admin công ty xyz',
            email: 'super.admin.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Nguyễn Văn A',
            email: 'nva.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Trần Văn B',
            email: 'tvb.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Vũ Thị C',
            email: 'vtc.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Nguyễn Văn D',
            email: 'nvd.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Trần Thị E',
            email: 'tte.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Phạm Đình F',
            email: 'pdf.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }]);
    console.log("Xong! Đã thêm tài khoản:", users);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC ROLE MẶC ĐỊNH CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo role mặc định của công ty...");
    const roleAbstract = await RoleType.findOne({ name: 'abstract' });

    const roles = await Role.insertMany([
        {
            name: "Super Admin",
            company: xyz._id,
            type: roleAbstract._id
        },{
            name: "Admin",
            company: xyz._id,
            type: roleAbstract._id
        },{
            name: "Dean",
            company: xyz._id,
            type: roleAbstract._id
        },{
            name: "Vice Dean",
            company: xyz._id,
            type: roleAbstract._id
        },{
            name: "Employee",
            company: xyz._id,
            type: roleAbstract._id
        }
    ]);
    console.log("Đã tạo xong các role mặc định của công ty: ", roles);
    //END
    await UserRole.create({ //gán tài khoản super.admin.xyz có role là Super Admin của công ty xyz
        userId: users[0]._id,
        roleId: roles[0]._id
    });

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo link cho các trang web của công ty...");
    const links = await Link.insertMany([{
            url: '/',
            description: `Trang chủ công ty ${xyz.name}`,
            company: xyz._id
        },{
            url: '/manage-department',
            description: 'Quản lý cơ cấu tổ chức',
            company: xyz._id
        },{
            url: '/manage-user',
            description: 'Quản lý người dùng',
            company: xyz._id
        },{
            url: '/manage-role',
            description: 'Quản lý phân quyền',
            company: xyz._id
        },{
            url: '/manage-link',
            description: 'Quản lý trang web của công ty',
            company: xyz._id
        },{
            url: '/manage-component',
            description: 'Quản lý các thành phần UI trên trang web của công ty',
            company: xyz._id
        },{
            url: '/manage-form-document',
            description: 'Quản lý tài liệu biểu mẫu',
            company: xyz._id
        },{
            url: '/manage-Employee',
            description: 'Quản lý nhân sự',
            company: xyz._id
        },
        {
            url: '/add-employee',
            description: 'Thêm mới nhân viên',
            company: xyz._id
        },
        {
            url: '/list-employee',
            description: 'Danh sách nhân viên',
            company: xyz._id
        },
        {
            url: '/update-employee',
            description: 'Cập nhật thông tin cá nhân của nhân viên',
            company: xyz._id
        },
        {
            url: '/detail-employee',
            description: 'Thông tin cá nhân của nhân viên',
            company: xyz._id
        },
        {
            url: '/salary-employee',
            description: 'Quản lý lương nhân viên',
            company: xyz._id
        },
        {
            url: '/sabbatical',
            description: 'Quản lý nghỉ phép của nhân viên',
            company: xyz._id
        },
        {
            url: '/discipline',
            description: 'Quản lý khen thưởng, kỷ luật',
            company: xyz._id
        },
        {
            url: '/dashboard-employee',
            description: 'Dashboard nhân sự',
            company: xyz._id
        },
        {
            url: '/time-keeping',
            description: 'Quản lý chấm công',
            company: xyz._id
        },
        {
            url: '/trainning-course',
            description: 'Quản lý đào tạo',
            company: xyz._id
        },
        {
            url: '/account',
            description: 'Thông tin tài khoản ',
            company: xyz._id
        },
        {
            url: '/training-plan',
            description: 'Kế hoạch đào tạo',
            company: xyz._id
        },
        {
            url: '/list-course',
            description: 'Chương trình đào tạo bắt buộc',
            company: xyz._id
        }
    ]);
    console.log("Xong! Đã tạo links: ", links);
    //END
    const privileges = await Privilege.insertMany([
        //gán 7 link trên cho super admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        },{
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },{
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },{
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },{
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },{
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },{
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },{
            resourceId: links[7]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[8]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[9]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[10]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[11]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[12]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[13]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[14]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[15]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[16]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[17]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[18]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[19]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        {
            resourceId: links[20]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        //end
        //gán 7 link trên cho admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[1]._id
        },{
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },{
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },{
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },{
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },{
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },{
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },//end
        //gán quyền vào trang home '/' cho role Dean, Vice Dean và Employee
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[2]._id //Dean
        },{
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[3]._id._id //Vice Dean
        },{
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[4]._id._id //Employee
        }
        
    ]);
    console.log("Gán quyền cho các role: ", privileges);
} 

//Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
fakeData()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });