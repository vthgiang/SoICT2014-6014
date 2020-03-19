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

// DB Config
const db = process.env.DATABASE;

// Connect to MongoDB
mongoose.connect( db, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Kết nối thành công đến MongoDB!\n");
    }).catch(err => console.log("ERROR! :(\n", err));

const seedDatabase = async () => {
    await console.log("Đang khởi tạo dữ liệu mẫu ...");
    //Tạo bản ghi trạng thái log
    await Log.create({ name: 'log', status: true });

    //Tạo các roletype trong hệ thống
    await RoleType.insertMany([
        { name: 'abstract' }, 
        { name: 'chucdanh' },
        { name: 'tutao' }
    ]);

    //Tạo dữ liệu về hệ thống quản lý công việc cho system admin
    var qlcv = await Company.create({
        name: 'Quản lý công việc',
        short_name: 'qlcv',
        customer: false,
        description: 'Hệ thống quản lý công việc cho các doanh nghiệp/công ty'
    });

    //Tạo tài khoản systemadmin cho hệ thống quản lý công việc
    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(process.env.SYSTEM_ADMIN_PASSWORD, salt);
    var systemAdmin = await User.create({
        name: process.env.SYSTEM_ADMIN_NAME,
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: hash,
        company: qlcv._id
    });

    //Tạo role System Admin 
    var roleAbstract = await RoleType.findOne({ name: 'abstract' });
    var roleSystemAdmin = await Role.create({
        name: 'System Admin',
        company: qlcv._id,
        type: roleAbstract._id
    });

    //Gán quyền System Admin cho tài khoản systemAdmin của hệ thống
    await UserRole.create({ userId: systemAdmin._id, roleId: roleSystemAdmin._id });

    //Tạo link của trang quản lý system và thông tin các công ty và gán quyền cho role System Admin
    var links = await Link.insertMany([{
            url: '/',
            description: 'Trang chủ',
            company: qlcv._id
        },{
            url: '/system/settings',
            description: 'Quản lý thiết lập hệ thống',
            type: 'system',
            company: qlcv._id
        },{
            url: '/system/companies-management',
            description: 'Quản lý thông tin doanh nghiệp/công ty',
            type: 'system',
            company: qlcv._id
        },{
            url: '/system/links-default-management',
            description: 'Quản lý các trang mặc định khi khởi tạo 1 công ty',
            type: 'system',
            company: qlcv._id
        },{
            url: '/system/components-default-management',
            description: 'Quản lý các thành phần UI mặc định khi khởi tạo cho 1 công ty',
            type: 'system',
            company: qlcv._id
        },{
            url: '/users-management',
            description: 'Quản lý người dùng',
            company: qlcv._id
        },{
            url: '/roles-management',
            description: 'Quản lý phân quyền',
            company: qlcv._id
        },{
            url: '/departments-management',
            description: 'Quản lý cơ cấu tổ chức',
            company: qlcv._id
        },{
            url: '/links-management',
            description: 'Quản lý trang',
            company: qlcv._id
        }
        ,{
            url: '/components-management',
            description: 'Quản lý thành phần UI',
            company: qlcv._id
        },{
            url: '/documents-management',
            description: 'Quản lý tài liệu biểu mẫu',
            company: qlcv._id
        },{
            url: '/notifications',
            description: 'Thông báo',
            company: qlcv._id
        }
    ]);

    await Privilege.insertMany([
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        },
        {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        },{
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        },{
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        },{
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        }
    ]);

    //Kết thúc việc khởi tạo dữ liệu mẫu
    await console.log("Đã tạo xong dữ liệu mẫu");
} 

//Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
seedDatabase()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });