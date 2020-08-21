const { RoleType, Role, RootRole, SystemLink, SystemComponent, Link, Privilege, User, UserRole, Configuration} = require('../models').schema;
const Term = require('./terms');
require('dotenv').config({path: '../.env'});

const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {DATA} = require("./locations");

// DB Config
const db = process.env.DATABASE || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`;

const seedDatabase = async () => {
    await console.log("Bắt đầu khởi tạo dữ liệu mẫu ...");

    const optionDatabase = process.env.DB_AUTHENTICATION === 'true' ?
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD
    }:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }

    // Step 1: Connect to MongoDB
    await mongoose.connect(db, optionDatabase).then(() => {
        console.log("Kết nối thành công đến MongoDB!\n");
    }).catch(err => console.log("DB ERROR! :(\n", err));

    // Step 2: Xóa database cũ
    mongoose.connection.db.dropDatabase(
        console.log(`Dữ liệu cũ của ${mongoose.connection.db.databaseName} đã được xóa.`)
    );

    await Configuration.create({
        database: process.env.DB_NAME,
        backup: {
            limit: 10
        }
    });
    
    // Step 3: Tạo các roletype trong hệ thống
    const roleType = await RoleType.insertMany([
        { name: Terms.ROLE_TYPES.ROOT }, 
        { name: Terms.ROLE_TYPES.POSITION },
        { name: Terms.ROLE_TYPES.COMPANY_DEFINED }
    ]);
    console.log("ROLETYPE:", roleType)



    // Step 4: Tạo tài khoản system admin cho hệ thống quản lý công việc
    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(process.env.SYSTEM_ADMIN_PASSWORD, salt);
    var systemAdmin = await User.create({
        name: process.env.SYSTEM_ADMIN_NAME,
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: hash
    });
    var roleAbstract = await RoleType.findOne({ name: Terms.ROLE_TYPES.ROOT}); 
    var roleSystemAdmin = await Role.create({ // Tạo role System Admin
        name: Terms.ROOT_ROLES.SYSTEM_ADMIN.name,
        type: roleAbstract._id
    });
    await UserRole.create({ userId: systemAdmin._id, roleId: roleSystemAdmin._id }); // Gán quyền System Admin cho tài khoản systemAdmin của hệ thống





    // Step 5: Tạo các page cho system admin
    var links = await Link.insertMany([
        {
            url: '/',
            description: 'Trang chủ',
            deleteSoft: false
        },
        {
            url: '/system/settings',
            description: 'Quản lý thiết lập hệ thống',
            deleteSoft: false
        },
        {
            url: '/system/companies-management',
            description: 'Quản lý thông tin doanh nghiệp/công ty',
            deleteSoft: false
        },
        {
            url: '/system/links-default-management',
            description: 'Quản lý các trang mặc định khi khởi tạo 1 công ty',
            deleteSoft: false
        },
        {
            url: '/system/components-default-management',
            description: 'Quản lý các thành phần UI mặc định khi khởi tạo cho 1 công ty',
            deleteSoft: false
        },
        {
            url: '/system/roles-default-management',
            description: 'Thông tin về các role default trong csdl',
            deleteSoft: false
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
    
    
    
    
    // Step 6: Tạo các role abstract mặc định để khởi tạo cho từng công ty
    let roleSuperAdmin = await RootRole.create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
        description: Terms.ROOT_ROLES.SUPER_ADMIN.description
    });
    let roleAdmin = await RootRole.create({
        name: Terms.ROOT_ROLES.ADMIN.name,
        description: Terms.ROOT_ROLES.ADMIN.description
    });
    let roleDean = await RootRole.create({
        name: Terms.ROOT_ROLES.DEAN.name,
        description: Terms.ROOT_ROLES.DEAN.description
    });
    let roleViceDean = await RootRole.create({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
        description: Terms.ROOT_ROLES.VICE_DEAN.description
    });
    let roleEmployee = await RootRole.create({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
        description: Terms.ROOT_ROLES.EMPLOYEE.description
    });






    // Step 7: Khởi tạo các system link để áp dụng cho các công ty sử dụng dịch vụ
    // let systemLinks = Terms.LINKS;
    let convertRoleNameToRoleId = (roleName) => { // Tạo nhanh hàm tiện ích chuyển đổi tên role thành id role
        if (roleName === Terms.ROOT_ROLES.SUPER_ADMIN.name){
            return roleSuperAdmin._id;
        } else if (roleName === Terms.ROOT_ROLES.ADMIN.name){
            return roleAdmin._id;
        } else if (roleName === Terms.ROOT_ROLES.DEAN.name){
            return roleDean._id;
        } else if (roleName === Terms.ROOT_ROLES.VICE_DEAN.name){
            return roleViceDean._id;
        } else if (roleName === Terms.ROOT_ROLES.EMPLOYEE.name){
            return roleEmployee._id;
        }
    }

    let convertComponentNameToId = (componentName, systemComponents) => {
        let id = null;
        for (let i = 0; i < systemComponents.length; i++) {
            if(componentName === systemComponents[i].name){
                id = systemComponents[i]._id;
                break;
            }
        }

        return id;
    }

    let getComponentDataByName = (name, componentArr) => {
        let component = null;
        for (let i = 0; i < componentArr.length; i++) {
            if(name === componentArr[i].name){
                component = componentArr[i];
                break;
            }
        }
        return component;
    }

    let convertLinkUrltoLinkId = (linkUrl, systemLinks) => {
        let id = null;
        for (let i = 0; i < systemLinks.length; i++) {
            if(linkUrl === systemLinks[i].url){
                id = systemLinks[i]._id;
                break;
            }
        }

        return id;
    }

    // Tạo các system component
    let dataSystemComponents = Term.COMPONENTS.map(component=>{
        return {
            name: component.name,
            roles: component.roles.map(name => convertRoleNameToRoleId(name)),
            description: component.description
        }
    });
    let systemComponents = await SystemComponent.insertMany(dataSystemComponents);

    // Tạo các system link
    let dataSystemLinks = Terms.LINKS.map( systemLink => {
        console.log("SYSTEM LINK", systemLink)
        return {
            ...systemLink,
            roles: systemLink.roles.map(name => convertRoleNameToRoleId(name)),
            components: systemLink.components ? systemLink.components.map(name => convertComponentNameToId(name, systemComponents)) : []
        }
    })
    let systemLinks = await SystemLink.insertMany(dataSystemLinks);

    // Thêm lại dữ liệu các links cho component
    for (let i = 0; i < systemComponents.length; i++) {
        let curSysComponent = await SystemComponent.findById(systemComponents[i]._id);
        let dataComponent = getComponentDataByName(curSysComponent.name, Term.COMPONENTS);
        curSysComponent.links = dataComponent.links.map(linkUrl => convertLinkUrltoLinkId(linkUrl, systemLinks));
        await curSysComponent.save();
    }




    // Thêm dữ liệu khu vực 
    await Location.insertMany(DATA);
    
    

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
