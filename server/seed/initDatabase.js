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

    //Tạo dữ liệu cho công ty vnist
    var vnist = await Company.create({
        name: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
        short_name: 'vnist',
        description: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam'
    });

    //Tạo tài khoản systemadmin cho hệ thống quản lý công việc
    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(process.env.SYSTEM_ADMIN_PASSWORD, salt);
    var systemAdmin = await User.create({
        name: process.env.SYSTEM_ADMIN_NAME,
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: hash,
        company: vnist._id
    });

    //Tạo role System Admin 
    var roleAbstract = await RoleType.findOne({ name: 'abstract' });
    var roleSystemAdmin = await Role.create({
        name: 'System Admin',
        company: vnist._id,
        type: roleAbstract._id
    });

    //Gán quyền System Admin cho tài khoản systemAdmin của hệ thống
    await UserRole.create({ userId: systemAdmin._id, roleId: roleSystemAdmin._id });

    //Tạo link của trang quản lý system và thông tin các công ty và gán quyền cho role System Admin
    var links = await Link.insertMany([{
            url: '/system',
            description: 'System Management',
            company: vnist._id
        },{
            url: '/manage-company',
            description: 'Manage companies information',
            company: vnist._id
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