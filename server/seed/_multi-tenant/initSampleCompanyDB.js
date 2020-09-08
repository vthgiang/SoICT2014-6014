const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('../terms');

const {
    Component,
    RoleType,
    Role,
    Company,
    OrganizationalUnit,
    Link,
    Privilege,
    User,
    UserRole,
    Employee,
    AnnualLeave,
    Discipline,
    Commendation,
    EducationProgram,
    Course,

    Asset,
    AssetType,
    RecommendProcure,
    RecommendDistribute,

    Document,
    DocumentArchive,
    DocumentDomain,
    DocumentCategory,
    Material,

    CrmCustomer,
    CrmLocation,
    CrmGroup,
    CrmCare
} = require('../../models/_multi-tenant');

require('dotenv').config();

const initSampleCompanyDB = async() => {
    console.log("Init sample company database, ...");

    /**
     * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
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
    if(!systemDB) throw('DB system cannot connect');
    console.log("DB system connected");
    
    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
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
    if(!systemDB) throw('DB vnist cannot connect');
	console.log("DB vnist connected");


	/**
	 * 2. Xóa dữ liệu db cũ của công ty vnist
	 */
    vnistDB.dropDatabase(); 


    /**
     * 3. Khởi tạo dữ liệu về công ty VNIST trong database của hệ thống
     */
    const vnist = await Company(systemDB).create({
        name: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
        shortName: 'vnist',
        description: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam'
    });
    console.log(`Xong! Công ty [${vnist.name}] đã được tạo.`);


    /**
     * 4. Tạo các tài khoản người dùng trong csdl của công ty VNIST
     */
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User(vnistDB).insertMany([{
        name: 'Super Admin VNIST',
        email: 'super.admin.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Admin VNIST',
        email: 'admin.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Nguyễn Văn An',
        email: 'nva.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Trần Văn Bình',
        email: 'tvb.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Vũ Thị Cúc',
        email: 'vtc.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Nguyễn Văn Danh',
        email: 'nvd.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Trần Thị Én',
        email: 'tte.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Phạm Đình Phúc',
        email: 'pdp.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Trần Minh Đức',
        email: 'tmd.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Nguyễn Việt Anh',
        email: 'nguyenvietanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Nguyễn Viết Thái',
        email: 'nguyenvietthai.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Trần Mỹ Hạnh',
        email: 'tranmyhanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Nguyễn Minh Thành',
        email: 'nguyenminhthanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Nguyễn Gia Huy',
        email: 'nguyengiahuy.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },{
        name: 'Trần Minh Anh',
        email: 'tranminhanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    }]);
    console.log("Dữ liệu tài khoản người dùng cho công ty VNIST", users);


    /**
     * 5. Tạo các role mặc định cho công ty vnist
     */
    const roleAbstract = await RoleType(systemDB).findOne({
        name: Terms.ROLE_TYPES.ROOT
    });
    const roleChucDanh = await RoleType(systemDB).findOne({
        name: Terms.ROLE_TYPES.POSITION
    });
    const roleAdmin = await Role(vnistDB).create({
        name: Terms.ROOT_ROLES.ADMIN.name,
        type: roleAbstract._id,
    });
    const roleSuperAdmin = await Role(vnistDB).create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
        type: roleAbstract._id,
        parents: [roleAdmin._id]
    });
    const roleDean = await Role(vnistDB).create({
        name: Terms.ROOT_ROLES.DEAN.name,
        type: roleAbstract._id,
    });
    const roleViceDean = await Role(vnistDB).create({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
        type: roleAbstract._id,
    });
    const roleEmployee = await Role(vnistDB).create({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
        type: roleAbstract._id,
    });

    const thanhVienBGĐ = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Thành viên ban giám đốc",
        type: roleChucDanh._id
    });
    const phoGiamDoc = await Role(vnistDB).create({
        parents: [roleViceDean._id, thanhVienBGĐ._id],
        name: "Phó giám đốc",
        type: roleChucDanh._id
    });
    const giamDoc = await Role(vnistDB).create({
        parents: [roleDean._id, thanhVienBGĐ._id, phoGiamDoc._id],
        name: "Giám đốc",
        type: roleChucDanh._id
    });
    const nvPhongHC = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kinh doanh",
        type: roleChucDanh._id
    });
    const phoPhongHC = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongHC._id],
        name: "Phó phòng kinh doanh",
        type: roleChucDanh._id
    });
    const truongPhongHC = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongHC._id, phoPhongHC._id],
        name: "Trưởng phòng kinh doanh",
        type: roleChucDanh._id
    });
    console.log("Dữ liệu các phân quyền cho công ty VNIST");


    /**
     * 6. Gán phân quyền cho các vị trí trong công ty
     */
    await UserRole(vnistDB).insertMany([{ // Gán tài khoản super.admin.vnist có role là Super Admin của công ty VNIST
        userId: users[0]._id,
        roleId: roleSuperAdmin._id
    },{
        userId: users[1]._id, // Gán tài khoản admin.vnist có role là admin
        roleId: roleAdmin._id
    },
    // Tiếp tục gán chức danh vai trò của phòng ban cho nhân viên:
    { // Giám đốc Nguyễn Văn An
        userId: users[2]._id,
        roleId: giamDoc._id
    },{ // Phó giám đốc Trần Văn Bình
        userId: users[3]._id,
        roleId: phoGiamDoc._id
    },{ // Thành viên ban giám đốc Vũ Thị Cúc
        userId: users[4]._id,
        roleId: thanhVienBGĐ._id
    },{ // Trưởng phòng kinh doanh Nguyễn Văn Danh
        userId: users[5]._id,
        roleId: truongPhongHC._id
    },{ // Nguyễn Văn Danh cũng là thành viên ban giám đốc
        userId: users[5]._id,
        roleId: thanhVienBGĐ._id
    },{ // Phó phòng kinh doanh Trần Thị Én
        userId: users[6]._id,
        roleId: phoPhongHC._id
    },{ // Nhân viên phòng kinh doanh Phạm Đình Phúc
        userId: users[7]._id,
        roleId: nvPhongHC._id
    },{ // Thành viên ban giám đốc Phạm Đình Phúc
        userId: users[7]._id,
        roleId: thanhVienBGĐ._id
    }]);

    /**
     * 7. Tạo dữ liệu các phòng ban cho công ty VNIST
     */
    const Directorate = await OrganizationalUnit(vnistDB).create({ // Khởi tạo ban giám đốc công ty
        name: "Ban giám đốc",
        description: "Ban giám đốc Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [giamDoc._id],
        viceDeans: [phoGiamDoc._id],
        employees: [thanhVienBGĐ._id],
        parent: null
    });
    const departments = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng kinh doanh",
        description: "Phòng kinh doanh Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongHC._id],
        viceDeans: [phoPhongHC._id],
        employees: [nvPhongHC._id],
        parent: Directorate._id
    },]);
    console.log("Đã tạo dữ liệu phòng ban: ", Directorate, departments);

    /**
     * 8. Tạo link cho các trang web của công ty VNIST
     */
    const createCompanyLinks = async (linkArr, roleArr) => {
        let checkIndex = (link, arr) => {
            let resIndex = -1;
            arr.forEach((node, i) => {
                if (node.url === link.url) {
                    resIndex = i;
                }
            });

            return resIndex;
        }

        let allLinks = await SystemLink(systemDB).find()
            .populate({
                path: 'root_roles'
            });;
        let activeLinks = await SystemLink(systemDB).find({ _id: { $in: linkArr } })
            .populate({
                path: 'root_roles'
            });

        let dataLinks = allLinks.map(link => {
            if (checkIndex(link, activeLinks) === -1)
                return {
                    url: link.url,
                    category: link.category,
                    description: link.description
                }
            else return {
                url: link.url,
                category: link.category,
                description: link.description,
                deleteSoft: false
            }
        })

        let links = await Link(vnistDB).insertMany(dataLinks);

        //Thêm phân quyền cho link
        let dataPrivilege = [];
        for (let i = 0; i < links.length; i++) {
            let link = links[i];

            for (let j = 0; j < allLinks.length; j++) {
                let systemLink = allLinks[j];

                if (link.url === systemLink.url) {
                    for (let x = 0; x < systemLink.roles.length; x++) {
                        let rootRole = systemLink.roles[x];

                        for (let y = 0; y < roleArr.length; y++) {
                            let role = roleArr[y];

                            if (role.name === rootRole.name) {
                                dataPrivilege.push({
                                    resourceId: link._id,
                                    resourceType: 'Link',
                                    roleId: role._id
                                });
                            }
                        }
                    }
                }
            }
        }
        await Privilege(vnistDB).insertMany(dataPrivilege);

        return await Link(vnistDB).find()
            .populate({
                path: 'roles',
                populate: {path: 'roleId'}
            });
    }

    const createCompanyComponents = async (linkArr) => {

        let systemLinks = await SystemLink(systemDB).find({_id: {$in: linkArr}});

        let dataSystemComponents = systemLinks.map(link => link.components);
        dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
        dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);
        const systemComponents = await SystemComponent(systemDB)
            .find({ _id: { $in: dataSystemComponents }})
            .populate({ path: 'root_roles' });

        for (let i = 0; i < systemComponents.length; i++) {
            let sysLinks = await SystemLink(systemDB)
            .find({ _id: { $in: systemComponents[i].links }});
            let links = await Link(vnistDB).find({
                url: sysLinks.map(link => link.url)
            });
            // Tạo component
            let component = await Component(vnistDB).create({
                name: systemComponents[i].name,
                description: systemComponents[i].description,
                links: links.map(link => link._id),
                deleteSoft: false
            })
            for (let j = 0; j < links.length; j++) {
                let updateLink = await Link(vnistDB).findById(links[j]._id);
                updateLink.components.push(component._id);
                await updateLink.save();
            }
            // Tạo phân quyền cho components
            for (let k = 0; k < systemComponents.length; k++) {
                let roles = await Role(vnistDB).find({
                    name: {
                        $in: systemComponents[i].roles.map(role => role.name)
                    }
                });
                let dataPrivileges = roles.map(role => {
                    return {
                        resourceId: component._id,
                        resourceType: 'Component',
                        roleId: role._id
                    }
                });
                await Privilege(vnistDB).insertMany(dataPrivileges);
            }
        }

        return await Component(vnistDB).find();
    }
    let linkArrData = await SystemLink(systemDB).find();
    let linkArr = linkArrData.map(link => link._id);
    let roleArr = [roleSuperAdmin, roleAdmin, roleDean, roleViceDean, roleEmployee];
    await createCompanyLinks(linkArr, roleArr);
    await createCompanyComponents(linkArr);

    
    /**
     * Ngắt kết nối db
     */
    systemDB.close();
    vnistDB.close();

    console.log("End init sample company database!");
}

initSampleCompanyDB().catch(err=>{
    console.log(err);
    process.exit(0);
})