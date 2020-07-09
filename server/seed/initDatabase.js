const Log = require('../models/system-admin/log.model');

const { RoleType, Role, RootRole, SystemLink, SystemComponent, Link, Privilege, User, UserRole} = require('../models').schema;

require('dotenv').config({path: '../.env'});

const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// DB Config
const db = process.env.DATABASE;

const seedDatabase = async () => {
    await console.log("Bắt đầu khởi tạo dữ liệu mẫu ...");

    // Step 1: Connect to MongoDB
    await mongoose.connect( db, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Kết nối thành công đến MongoDB!\n");
    }).catch(err => console.log("DB ERROR! :(\n", err));





    // Step 2: Xóa DB cũ
    await mongoose.connection.db.dropDatabase(
        console.log("Khởi tạo lại môi trường để cài đặt dữ liệu mẫu.")
    );


    
    
    // Step 3: Tạo bản ghi trạng thái log
    await Log.create({ name: 'log', status: true });



    
    // Step 4: Tạo các roletype trong hệ thống
    await RoleType.insertMany([
        { name: Terms.ROLE_TYPES.ROOT }, 
        { name: Terms.ROLE_TYPES.POSITION },
        { name: Terms.ROLE_TYPES.COMPANY_DEFINED }
    ]);




    // Step 5: Tạo tài khoản system admin cho hệ thống quản lý công việc
    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(process.env.SYSTEM_ADMIN_PASSWORD, salt);
    var systemAdmin = await User.create({
        name: process.env.SYSTEM_ADMIN_NAME,
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: hash
    });
    var roleAbstract = await RoleType.findOne({ name: Terms.ROLE_TYPES.ROOT}); 
    var roleSystemAdmin = await Role.create({ // Tạo role System Admin
        name: Terms.ROOT_ROLES.SYSTEM_ADMIN.NAME,
        type: roleAbstract._id
    });
    await UserRole.create({ userId: systemAdmin._id, roleId: roleSystemAdmin._id }); // Gán quyền System Admin cho tài khoản systemAdmin của hệ thống





    // Step 6: Tạo các page cho system admin
    var links = await Link.insertMany([
        {
            url: '/',
            description: 'Trang chủ'
        },
        {
            url: '/system/settings',
            description: 'Quản lý thiết lập hệ thống'
        },
        {
            url: '/system/companies-management',
            description: 'Quản lý thông tin doanh nghiệp/công ty'
        },
        {
            url: '/system/links-default-management',
            description: 'Quản lý các trang mặc định khi khởi tạo 1 công ty'
        },
        {
            url: '/system/components-default-management',
            description: 'Quản lý các thành phần UI mặc định khi khởi tạo cho 1 công ty'
        },
        {
            url: '/system/roles-default-management',
            description: 'Thông tin về các role default trong csdl'
        }
    ]);
    await Privilege.insertMany([
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roleSystemAdmin._id
        },{
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
    
    
    
    
    // Step 7: Tạo các role abstract mặc định để khởi tạo cho từng công ty
    let roleSuperAdmin = await RootRole.create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.NAME,
        description: Terms.ROOT_ROLES.SUPER_ADMIN.DESCRIPTION
    });
    let roleAdmin = await RootRole.create({
        name: Terms.ROOT_ROLES.ADMIN.NAME,
        description: Terms.ROOT_ROLES.ADMIN.DESCRIPTION
    });
    let roleDean = await RootRole.create({
        name: Terms.ROOT_ROLES.DEAN.NAME,
        description: Terms.ROOT_ROLES.DEAN.DESCRIPTION
    });
    let roleViceDean = await RootRole.create({
        name: Terms.ROOT_ROLES.VICE_DEAN.NAME,
        description: Terms.ROOT_ROLES.VICE_DEAN.DESCRIPTION
    });
    let roleEmployee = await RootRole.create({
        name: Terms.ROOT_ROLES.EMPLOYEE.NAME,
        description: Terms.ROOT_ROLES.EMPLOYEE.DESCRIPTION
    });






    // Step 8: Khởi tạo các link default để áp dụng cho các công ty sử dụng dịch vụ
    let systemLinks = Terms.LINKS;
    let convertRoleNameToRoleId = (roleName) => { // Tạo nhanh hàm tiện ích chuyển đổi tên role thành id role
        if (roleName === Terms.ROOT_ROLES.SUPER_ADMIN.NAME){
            return roleSuperAdmin._id;
        } else if (roleName === Terms.ROOT_ROLES.ADMIN.NAME){
            return roleAdmin._id;
        } else if (roleName === Terms.ROOT_ROLES.DEAN.NAME){
            return roleDean._id;
        } else if (roleName === Terms.ROOT_ROLES.VICE_DEAN.NAME){
            return roleViceDean._id;
        } else if (roleName === Terms.ROOT_ROLES.EMPLOYEE.NAME){
            return roleEmployee._id;
        }
    }

    let componentLinkMap = {};

    for (let i=0; i<systemLinks.length; ++i) {
        let systemComponents = systemLinks[i].components;
        if (systemComponents && systemComponents.length>0) { // Tạo các components
            systemComponents = systemComponents.map(component => { // Liên kết với role
                component.roles = component.roles.map(role => convertRoleNameToRoleId(role));
                return component;
            })

            let mongodbSystemComponents = await SystemComponent.insertMany(systemComponents);
            systemComponents = mongodbSystemComponents.map(component => component._id);
            systemLinks[i].components = systemComponents;

            mongodbSystemComponents.forEach(mongodbComponent => {
                componentLinkMap[mongodbComponent._id] = i;
            });
        }

        let roles = systemLinks[i].roles;
        if (roles){
            systemLinks[i].roles = roles.map(role => convertRoleNameToRoleId(role));
        }
    }

    const mongodbSystemLinks = await SystemLink.insertMany(systemLinks); // Tạo các links
    
    for (let id in componentLinkMap) { // Thêm liên kết tới link trong bảng component
        let systemComponent = await SystemComponent.findById(id);
        systemComponent.link = mongodbSystemLinks[componentLinkMap[id]]._id;
        await systemComponent.save();
    }

    
    
    
    

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