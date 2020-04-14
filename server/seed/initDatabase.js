const Log = require('../models/log.model');
const RoleType = require('../models/role_type.model');
const Role = require('../models/role.model');
const RoleDefault = require('../models/roleDefault.model');
const LinkDefault = require('../models/linkDefault.model');
const Link = require('../models/link.model');
const Privilege = require('../models/privilege.model');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');
const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config({path: '../.env'});

// DB Config
const db = process.env.DATABASE;

const seedDatabase = async () => {
    // Connect to MongoDB
    await mongoose.connect( db, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Kết nối thành công đến MongoDB!\n");
    }).catch(err => console.log("ERROR! :(\n", err));

    await mongoose.connection.db.dropDatabase(
        console.log("Khởi tạo lại môi trường để cài đặt dữ liệu mẫu.")
    );
    await console.log("Đang khởi tạo dữ liệu mẫu ...");
    // Tạo bản ghi trạng thái log
    await Log.create({ name: 'log', status: true });

    // Tạo các roletype trong hệ thống
    await RoleType.insertMany([
        { name: Terms.ROLE_TYPES.ABSTRACT }, 
        { name: Terms.ROLE_TYPES.POSITION },
        { name: Terms.ROLE_TYPES.COMPANY_DEFINED }
    ]);

    //Tạo tài khoản systemadmin cho hệ thống quản lý công việc
    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(process.env.SYSTEM_ADMIN_PASSWORD, salt);
    var systemAdmin = await User.create({
        name: process.env.SYSTEM_ADMIN_NAME,
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: hash
    });

    // Tạo role System Admin 
    var roleAbstract = await RoleType.findOne({ name: Terms.ROLE_TYPES.ABSTRACT});
    var roleSystemAdmin = await Role.create({
        name: Terms.PREDEFINED_ROLES.SYSTEM_ADMIN.NAME,
        type: roleAbstract._id
    });

    // Gán quyền System Admin cho tài khoản systemAdmin của hệ thống
    await UserRole.create({ userId: systemAdmin._id, roleId: roleSystemAdmin._id });

    // Tạo link cho system 
    var links = await Link.insertMany([{
            url: '/',
            description: 'Trang chủ'
        },{
            url: '/system/settings',
            description: 'Quản lý thiết lập hệ thống'
        },{
            url: '/system/companies-management',
            description: 'Quản lý thông tin doanh nghiệp/công ty'
        },{
            url: '/system/links-default-management',
            description: 'Quản lý các trang mặc định khi khởi tạo 1 công ty'
        },{
            url: '/system/components-default-management',
            description: 'Quản lý các thành phần UI mặc định khi khởi tạo cho 1 công ty'
        },{
            url: '/system/roles-default-management',
            description: 'Thông tin về các role default trong csdl'
        }
    ]);

    // Tạo các role abstract mặc định để khởi tạo cho từng công ty
    var roleAbstracts = await RoleDefault.insertMany([
        {
            name: Terms.PREDEFINED_ROLES.SUPER_ADMIN.NAME,
            description: Terms.PREDEFINED_ROLES.SUPER_ADMIN.DESCRIPTION
        },{
            name: Terms.PREDEFINED_ROLES.ADMIN.NAME,
            description: Terms.PREDEFINED_ROLES.ADMIN.DESCRIPTION
        },{
            name: Terms.PREDEFINED_ROLES.DEAN.NAME,
            description: Terms.PREDEFINED_ROLES.DEAN.DESCRIPTION
        },{
            name: Terms.PREDEFINED_ROLES.VICE_DEAN.NAME,
            description: Terms.PREDEFINED_ROLES.VICE_DEAN.DESCRIPTION
        },{
            name: Terms.PREDEFINED_ROLES.EMPLOYEE.NAME,
            description: Terms.PREDEFINED_ROLES.EMPLOYEE.DESCRIPTION
        }
    ])
    // Khởi tạo các link default để áp dụng cho các công ty sử dụng dịch vụ
    // index: 0-super admin, 1-admin, 2-dean, 3-vice dean, 4-employee
    const linkDefaults = await LinkDefault.insertMany([

        // Common
        {
            url: '/',
            description: 'Trang chủ',
            category: Terms.CATEGORY_LINKS[0].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id, roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id ]
        },{
            url: '/notifications',
            description: 'Thông báo',
            category: Terms.CATEGORY_LINKS[0].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id, roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id ] // tất cả 
        },

        // RBAC
        {
            url: '/users-management',
            description: 'Quản lý người dùng',
            category: Terms.CATEGORY_LINKS[1].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id ]
        },{
            url: '/roles-management',
            description: 'Quản lý phân quyền',
            category: Terms.CATEGORY_LINKS[1].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id ]
        },{
            url: '/departments-management',
            description: 'Quản lý cơ cấu tổ chức',
            category: Terms.CATEGORY_LINKS[1].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id ]
        },{
            url: '/links-management',
            description: 'Quản lý trang',
            category: Terms.CATEGORY_LINKS[1].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id ]
        }
        ,{
            url: '/components-management',
            description: 'Quản lý thành phần UI',
            category: Terms.CATEGORY_LINKS[1].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id ]
        },

        // KPI
        {
            url: '/kpi-units/create',
            description: 'Khởi tạo Kpi đơn vị',
            category: Terms.CATEGORY_LINKS[2].name,
            roles: [ roleAbstracts[2]._id]
        },{
            url: '/kpi-units/overview',
            description: 'Tổng quan Kpi đơn vị',
            category: Terms.CATEGORY_LINKS[2].name,
            roles: [roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/kpi-personals/create',
            description: 'Khởi tạo Kpi cá nhân',
            category: Terms.CATEGORY_LINKS[2].name,
            roles: [roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/kpi-personals/overview',
            description:'Tổng quan Kpi cá nhân',
            category: Terms.CATEGORY_LINKS[2].name,
            roles:[roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/kpi-member/overview',
            description: 'Quản lí kpi nhân viên',
            category: Terms.CATEGORY_LINKS[2].name,
            roles:[roleAbstracts[2]._id]
        },

        // EMPLOYEE
        {
            url: '/hr-manage-holiday',
            description: 'Kế hoạch làm việc',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-add-employee',
            description: 'Thêm mới nhân viên',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-list-employee',
            description: 'Danh sách nhân viên',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-update-employee',
            description: 'Cập nhật thông tin cá nhân của nhân viên',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-detail-employee',
            description: 'Thông tin cá nhân nhân viên',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-salary-employee',
            description: 'Quản lý lương nhân viên',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-sabbatical',
            description: 'Quản lý nghỉ phép của nhân viên',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-discipline',
            description: 'Quản lý khen thưởng, kỷ luật',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-dashboard-employee',
            description: 'Dashboard nhân sự',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-time-keeping',
            description: 'Quản lý chấm công',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-account',
            description: 'Thông tin tài khoản',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-manage-management',
            description: 'Quản lý nhân sự các đơn vị',
            category: Terms.CATEGORY_LINKS[4].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },

        // EDUCATION
        {
            url: '/hr-trainning-plan',
            description: 'Kế hoạch đào tạo',
            category: Terms.CATEGORY_LINKS[5].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-list-education',
            description: 'Chương trình đào tạo bắt buộc',
            category: Terms.CATEGORY_LINKS[5].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/hr-trainning-course',
            description: 'Quản lý đào tạo',
            category: Terms.CATEGORY_LINKS[5].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },

        // TASK
        {
            url:'/task-management',
            description:'Xem danh sáng công việc',
            category: Terms.CATEGORY_LINKS[3].name,
            roles: [roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },{
            url: '/task-management-dashboard',
            description: 'Dashboard công việc',
            category: Terms.CATEGORY_LINKS[3].name,
            roles: [ roleAbstracts[4]._id, roleAbstracts[3]._id, roleAbstracts[2]._id]
        },{
            url: '/task-template',
            description: 'Mẫu công việc',
            category: Terms.CATEGORY_LINKS[3].name,
            roles: [ roleAbstracts[0]._id, roleAbstracts[1]._id,  roleAbstracts[2]._id, roleAbstracts[3]._id, roleAbstracts[4]._id]
        },

        // DOCUMENT
        {
            url: '/documents-management',
            description: 'Quản lý tài liệu biểu mẫu',
            category: Terms.CATEGORY_LINKS[6].name,
            roles: [ roleAbstracts[2]._id, roleAbstracts[3]._id ] //trưởng và phó 
        },

        // PROCESS
        
    ]);
    console.log("link defaults: ", linkDefaults);

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
        },{
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        }
    ]);

    // Kết thúc việc khởi tạo dữ liệu mẫu
    await console.log("Đã tạo xong dữ liệu mẫu");
} 

// Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
seedDatabase()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });