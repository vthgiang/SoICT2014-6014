const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('../terms');

const { 
    User, RoleType, Role, Link, Privilege, RootRole, SystemComponent, SystemLink
} = require('../../models/_multi-tenant');

require('dotenv').config();

const initDB = async() => {
    console.log("Init DB");

    /**
     * 1. Tạo kết nối đến cơ sở dữ liệu
     */
    const systemDB = mongoose.createConnection(
        process.env.DATABASE || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`,
        process.env.DB_AUTHENTICATION === 'true' ?
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
    );
    if(!systemDB) throw('DB cannot connect');
	console.log("DB connected");

	/**
	 * 2. Xóa dữ liệu db cũ
	 */
	systemDB.dropDatabase(); 


	/**
	 * 3. Tạo các Role Type
	 */
	const roleType = await RoleType(systemDB).insertMany([
        { name: Terms.ROLE_TYPES.ROOT }, 
        { name: Terms.ROLE_TYPES.POSITION },
        { name: Terms.ROLE_TYPES.COMPANY_DEFINED }
    ]);
    console.log("ROLETYPE:", roleType)
	

	/**
	 * 4. Tạo tài khoản system admin
	 */
	const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(process.env.SYSTEM_ADMIN_PASSWORD, salt);
    const systemAdmin = await User(systemDB).create({
        name: process.env.SYSTEM_ADMIN_NAME,
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: hash
    });
	const roleAbstract = await RoleType(systemDB).findOne({ name: Terms.ROLE_TYPES.ROOT}); 
    const roleSystemAdmin = await Role(systemDB).create({ // Tạo role System Admin
        name: Terms.ROOT_ROLES.SYSTEM_ADMIN.name,
        type: roleAbstract._id
    });
	await UserRole(systemDB).create({ userId: systemAdmin._id, roleId: roleSystemAdmin._id });
	
	/**
	 * 5. Tạo các link và phân quyền truy cập cho system-admin
	 */
	const links = await Link(systemDB).insertMany([
        {
            url: '/',
            description: 'Trang chủ hệ thống quản lý doanh nghiệp',
            deleteSoft: false
        },
        {
            url: '/system/settings',
            description: 'Quản lý thiết lập hệ thống',
            deleteSoft: false
        },
        {
            url: '/system/companies-management',
            description: 'Quản lý các doanh nghiệp đăng ký sử dụng dịch vụ',
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
    await Privilege(systemDB).insertMany([
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


	/**
	 * 6. Tạo các RootRole
	 */
    const roleSuperAdmin = await RootRole(systemDB).create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
        description: Terms.ROOT_ROLES.SUPER_ADMIN.description
    });
    const roleAdmin = await RootRole(systemDB).create({
        name: Terms.ROOT_ROLES.ADMIN.name,
        description: Terms.ROOT_ROLES.ADMIN.description
    });
    const roleDean = await RootRole(systemDB).create({
        name: Terms.ROOT_ROLES.DEAN.name,
        description: Terms.ROOT_ROLES.DEAN.description
    });
    const roleViceDean = await RootRole(systemDB).create({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
        description: Terms.ROOT_ROLES.VICE_DEAN.description
    });
    const roleEmployee = await RootRole(systemDB).create({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
        description: Terms.ROOT_ROLES.EMPLOYEE.description
    });


	/**
	 * 7. Khởi tạo các system-link và system-component
	 */
    const convertRoleNameToRoleId = (roleName) => { // Tạo nhanh hàm tiện ích chuyển đổi tên role thành id role
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

    const convertComponentNameToId = (componentName, systemComponents) => {
        let id = null;
        for (let i = 0; i < systemComponents.length; i++) {
            if(componentName === systemComponents[i].name){
                id = systemComponents[i]._id;
                break;
            }
        }

        return id;
    }

    const getComponentDataByName = (name, componentArr) => {
        let component = null;
        for (let i = 0; i < componentArr.length; i++) {
            if(name === componentArr[i].name){
                component = componentArr[i];
                break;
            }
        }
        return component;
    }

    const convertLinkUrltoLinkId = (linkUrl, systemLinks) => {
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
    const dataSystemComponents = Terms.COMPONENTS.map(component=>{
        return {
            name: component.name,
            roles: component.roles.map(name => convertRoleNameToRoleId(name)),
            description: component.description
        }
    });
    const systemComponents = await SystemComponent(systemDB).insertMany(dataSystemComponents);

    // Tạo các system link
    const dataSystemLinks = Terms.LINKS.map( systemLink => {
        console.log("SYSTEM LINK", systemLink)
        return {
            ...systemLink,
            roles: systemLink.roles.map(name => convertRoleNameToRoleId(name)),
            components: systemLink.components ? systemLink.components.map(name => convertComponentNameToId(name, systemComponents)) : []
        }
    })
    let systemLinks = await SystemLink(systemDB).insertMany(dataSystemLinks);

    // Thêm lại dữ liệu các links cho component
    for (let i = 0; i < systemComponents.length; i++) {
        let curSysComponent = await SystemComponent(systemDB).findById(systemComponents[i]._id);
        let dataComponent = getComponentDataByName(curSysComponent.name, Terms.COMPONENTS);
        curSysComponent.links = dataComponent.links.map(linkUrl => convertLinkUrltoLinkId(linkUrl, systemLinks));
        await curSysComponent.save();
    }


    /**
     * . Đóng kết nối với database
     */
    systemDB.close();

    console.log("End init DB");
}

initDB().catch(err=>{
	console.log(err);
	process.exit(0)
});