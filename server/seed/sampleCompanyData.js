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
} = require('../models').schema;

const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


require('dotenv').config({
    path: '../.env'
});

// DB CONFIG
const db = process.env.DATABASE || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`;
const optionDatabase = process.env.DB_AUTHENTICATION === 'true' ?
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD
    } : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }

// KẾT NỐI TỚI CSDL MONGODB
mongoose.connect(db, optionDatabase).then(() => {
    console.log("Kết nối thành công đến MongoDB!\n");
}).catch(err => console.log("ERROR! :(\n", err));

const sampleCompanyData = async () => {
    console.log("Bắt đầu tạo dữ liệu ...");






    // Step 1: TẠO DỮ LIỆU VỀ CÔNG TY VNIST
    console.log("Khởi tạo dữ liệu công ty!");
    var vnist = await Company.create({
        name: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
        shortName: 'VNIST',
        description: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam'
    });
    console.log(`Xong! Công ty [${vnist.name}] đã được tạo.`);

    let vnist_info = await Company.findById(vnist._id);




    // Step 2: TẠO CÁC TÀI KHOẢN NGƯỜI DÙNG CHO CÔNG TY VNIST
    console.log(`Khởi tạo các tài khoản cho công ty [${vnist.name}]`);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User.insertMany([{
        name: 'Super Admin VNIST',
        email: 'super.admin.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Admin VNIST',
        email: 'admin.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Nguyễn Văn An',
        email: 'nva.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Trần Văn Bình',
        email: 'tvb.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Vũ Thị Cúc',
        email: 'vtc.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Nguyễn Văn Danh',
        email: 'nvd.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Trần Thị Én',
        email: 'tte.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Phạm Đình Phúc',
        email: 'pdp.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Trần Minh Đức',
        email: 'tmd.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Nguyễn Việt Anh',
        email: 'nguyenvietanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Nguyễn Viết Thái',
        email: 'nguyenvietthai.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Trần Mỹ Hạnh',
        email: 'tranmyhanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Nguyễn Minh Thành',
        email: 'nguyenminhthanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Nguyễn Gia Huy',
        email: 'nguyengiahuy.vnist@gmail.com',
        password: hash,
        company: vnist._id
    },
    {
        name: 'Trần Minh Anh',
        email: 'tranminhanh.vnist@gmail.com',
        password: hash,
        company: vnist._id
    }
    ]);
    console.log("Xong! Đã thêm tài khoản:", users);

    vnist_info.superAdmin = users[0]._id;
    await vnist_info.save();





    // Step 3: TẠO CÁC ROLE MẶC ĐỊNH CỦA CÔNG TY
    console.log("Lấy role mặc định của công ty...");
    const roleAbstract = await RoleType.findOne({
        name: Terms.ROLE_TYPES.ROOT
    });
    const roleChucDanh = await RoleType.findOne({
        name: Terms.ROLE_TYPES.POSITION
    });
    const roleAdmin = await Role.create({
        name: Terms.ROOT_ROLES.ADMIN.name,
        company: vnist._id,
        type: roleAbstract._id,
    });
    const roleSuperAdmin = await Role.create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
        company: vnist._id,
        type: roleAbstract._id,
        parents: [roleAdmin._id]
    });
    const roleDean = await Role.create({
        name: Terms.ROOT_ROLES.DEAN.name,
        company: vnist._id,
        type: roleAbstract._id,
    });
    const roleViceDean = await Role.create({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
        company: vnist._id,
        type: roleAbstract._id,
    });
    const roleEmployee = await Role.create({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
        company: vnist._id,
        type: roleAbstract._id,
    });

    const thanhVienBGĐ = await Role.create({
        parents: [roleEmployee._id],
        name: "Thành viên ban giám đốc",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const phoGiamDoc = await Role.create({
        parents: [roleViceDean._id, thanhVienBGĐ._id],
        name: "Phó giám đốc",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const giamDoc = await Role.create({
        parents: [roleDean._id, thanhVienBGĐ._id, phoGiamDoc._id],
        name: "Giám đốc",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const nvPhongHC = await Role.create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kinh doanh",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const phoPhongHC = await Role.create({
        parents: [roleViceDean._id, nvPhongHC._id],
        name: "Phó phòng kinh doanh",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const truongPhongHC = await Role.create({
        parents: [roleDean._id, nvPhongHC._id, phoPhongHC._id],
        name: "Trưởng phòng kinh doanh",
        company: vnist._id,
        type: roleChucDanh._id
    });

    console.log("Đã tạo xong các role mặc định của công ty!");







    // Step 4: GÁN QUYỀN CHO NHÂN VIÊN CỦA CỦA CÔNG TY
    console.log('Gán quyền cho nhân viên trong công ty ...');
    await UserRole.insertMany([{ // Gán tài khoản super.admin.vnist có role là Super Admin của công ty VNIST
        userId: users[0]._id,
        roleId: roleSuperAdmin._id
    }, {
        userId: users[1]._id, // Gán tài khoản admin.vnist có role là admin
        roleId: roleAdmin._id
    },
    // Tiếp tục gán chức danh vai trò của phòng ban cho nhân viên:
    { // Giám đốc Nguyễn Văn An
        userId: users[2]._id,
        roleId: giamDoc._id
    },
    { // Phó giám đốc Trần Văn Bình
        userId: users[3]._id,
        roleId: phoGiamDoc._id
    },
    { // Thành viên ban giám đốc Vũ Thị Cúc
        userId: users[4]._id,
        roleId: thanhVienBGĐ._id
    },
    { // Trưởng phòng kinh doanh Nguyễn Văn Danh
        userId: users[5]._id,
        roleId: truongPhongHC._id
    },
    { // Nguyễn Văn Danh cũng là thành viên ban giám đốc
        userId: users[5]._id,
        roleId: thanhVienBGĐ._id
    },
    { // Phó phòng kinh doanh Trần Thị Én
        userId: users[6]._id,
        roleId: phoPhongHC._id
    },
    { // Nhân viên phòng kinh doanh Phạm Đình Phúc
        userId: users[7]._id,
        roleId: nvPhongHC._id
    },
    { // Thành viên ban giám đốc Phạm Đình Phúc
        userId: users[7]._id,
        roleId: thanhVienBGĐ._id
    }
    ]);







    // Step 5: TẠO PHÒNG BAN CỦA CỦA CÔNG TY
    console.log('Tạo Phòng ban cho công ty...');
    const Directorate = await OrganizationalUnit.create({ // Khởi tạo ban giám đốc công ty
        name: "Ban giám đốc",
        description: "Ban giám đốc Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        company: vnist._id,
        deans: [giamDoc._id],
        viceDeans: [phoGiamDoc._id],
        employees: [thanhVienBGĐ._id],
        parent: null
    });
    const departments = await OrganizationalUnit.insertMany([{
        name: "Phòng kinh doanh",
        description: "Phòng kinh doanh Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        company: vnist._id,
        deans: [truongPhongHC._id],
        viceDeans: [phoPhongHC._id],
        employees: [nvPhongHC._id],
        parent: Directorate._id
    },]);
    console.log('Xong! Đã tạo các phòng ban cho công ty', Directorate, departments);









    // Step 6: TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY
    console.log("Tạo link cho các trang web của công ty...");

    const createCompanyLinks = async (companyId, linkArr, roleArr) => {
        let checkIndex = (link, arr) => {
            let resIndex = -1;
            arr.forEach((node, i) => {
                if (node.url === link.url) {
                    resIndex = i;
                }
            });

            return resIndex;
        }

        let allLinks = await SystemLink.find()
            .populate({ path: 'roles', model: RootRole });;
        let activeLinks = await SystemLink.find({ _id: { $in: linkArr } })
            .populate({ path: 'roles', model: RootRole });

        let dataLinks = allLinks.map(link => {
            if (checkIndex(link, activeLinks) === -1)
                return {
                    url: link.url,
                    category: link.category,
                    description: link.description,
                    company: companyId
                }
            else return {
                url: link.url,
                category: link.category,
                description: link.description,
                company: companyId,
                deleteSoft: false
            }
        })

        let links = await Link.insertMany(dataLinks);

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
        await Privilege.insertMany(dataPrivilege);

        return await Link.find({ company: companyId })
            .populate({ path: 'roles', model: Privilege, populate: { path: 'roleId', model: Role } });
    }

    const createCompanyComponents = async (companyId, linkArr) => {

        let systemLinks = await SystemLink.find({ _id: { $in: linkArr } });

        let dataSystemComponents = systemLinks.map(link => link.components);
        dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
        dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);
        const systemComponents = await SystemComponent
            .find({ _id: { $in: dataSystemComponents } })
            .populate({ path: 'roles', model: RootRole });

        for (let i = 0; i < systemComponents.length; i++) {
            let sysLinks = await SystemLink.find({ _id: { $in: systemComponents[i].links } });
            let links = await Link.find({ company: companyId, url: sysLinks.map(link => link.url) });
            // Tạo component
            let component = await Component.create({
                name: systemComponents[i].name,
                description: systemComponents[i].description,
                links: links.map(link => link._id),
                company: companyId,
                deleteSoft: false
            })
            for (let j = 0; j < links.length; j++) {
                let updateLink = await Link.findById(links[j]._id);
                updateLink.components.push(component._id);
                await updateLink.save();
            }
            // Tạo phân quyền cho components
            for (let k = 0; k < systemComponents.length; k++) {
                let roles = await Role.find({
                    company: companyId,
                    name: { $in: systemComponents[i].roles.map(role => role.name) }
                });
                let dataPrivileges = roles.map(role => {
                    return {
                        resourceId: component._id,
                        resourceType: 'Component',
                        roleId: role._id
                    }
                });
                await Privilege.insertMany(dataPrivileges);
            }
        }

        return await Component.find({ company: companyId });
    }
    let linkArrData = await SystemLink.find();
    let linkArr = linkArrData.map(link => link._id);
    let roleArr = [roleSuperAdmin, roleAdmin, roleDean, roleViceDean, roleEmployee];
    await createCompanyLinks(vnist._id, linkArr, roleArr);
    await createCompanyComponents(vnist._id, linkArr);

    // let links = Terms.LINKS.map(link  => {
    //     return {
    //         ...link,
    //         company: vnist._id,
    //         deleteSoft: false
    //     }
    // });
    // let convertRoleNameToRoleId = (roleName) => { // Tạo nhanh hàm tiện ích chuyển đổi tên role thành id role
    //     if (roleName === Terms.ROOT_ROLES.SUPER_ADMIN.name) {
    //         return roleSuperAdmin._id;
    //     } else if (roleName === Terms.ROOT_ROLES.ADMIN.name) {
    //         return roleAdmin._id;
    //     } else if (roleName === Terms.ROOT_ROLES.DEAN.name) {
    //         return roleDean._id;
    //     } else if (roleName === Terms.ROOT_ROLES.VICE_DEAN.name) {
    //         return roleViceDean._id;
    //     } else if (roleName === Terms.ROOT_ROLES.EMPLOYEE.name) {
    //         return roleEmployee._id;
    //     }
    // }

    // let componentLinkMap = {};

    // for (let i = 0; i < links.length; ++i) {
    //     let components = links[i].components;
    //     if (components && components.length > 0) { // Tạo các components
    //         components = components.map(component => { // Liên kết với role
    //             component.roles = component.roles.map(role => convertRoleNameToRoleId(role));
    //             component.company = vnist._id;
    //             component.deleteSoft = false;
    //             return component;
    //         })

    //         let mongodbComponents = await Component.insertMany(components);
    //         components = mongodbComponents.map(component => component._id);
    //         links[i].components = components;

    //         // Phân quyền cho component trong Privilege
    //         let privileges_component = [];
    //         mongodbComponents.forEach(mongodbComponent => {
    //             if (mongodbComponent.roles) {
    //                 mongodbComponent.roles.forEach(role => {
    //                     privileges_component.push({
    //                         resourceId: mongodbComponent._id,
    //                         resourceType: 'Component',
    //                         roleId: role._id
    //                     })
    //                 });
    //             }
    //             componentLinkMap[mongodbComponent._id] = i;
    //         });
    //         await Privilege.insertMany(privileges_component);
    //     }

    //     let roles = links[i].roles;
    //     if (roles) {
    //         links[i].roles = roles.map(role => convertRoleNameToRoleId(role));
    //     }
    // }

    // const mongodbLinks = await Link.insertMany(links); // Tạo các links

    // for (let id in componentLinkMap) { // Thêm liên kết tới link trong bảng component
    //     let component = await Component.findById(id);
    //     component.link = mongodbLinks[componentLinkMap[id]]._id;
    //     await component.save();
    // }






    // // Step 7: Phân quyền cho các trang
    // let privileges_links = [];
    // mongodbLinks.forEach(mongodbSystemLink => {
    //     if (mongodbSystemLink.roles) {
    //         mongodbSystemLink.roles.forEach(role => {
    //             privileges_links.push({
    //                 resourceId: mongodbSystemLink._id,
    //                 resourceType: 'Link',
    //                 roleId: role._id
    //             })
    //         });
    //     }
    // });
    // let privileges = await Privilege.insertMany(privileges_links);
    // console.log("Gán quyền cho các role: ", privileges);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    await Employee.insertMany([{
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Vũ Thị Cúc",
        employeeNumber: "MS2015122",
        status: "active",
        company: vnist._id,
        employeeTimesheetId: "123456",
        gender: "female",
        birthdate: new Date("1998-02-17"),
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: new Date("2015-10-20"),
        identityCardAddress: "Nam Định",
        emailInCompany: "vtc.vnist@gmail.com",
        nationality: "Việt Nam",
        atmNumber: "102298653",
        bankName: "ViettinBank",
        bankAddress: "Hai Bà Trưng",
        ethnic: "Kinh",
        religion: "Không",
        maritalStatus: "single",
        phoneNumber: 962586290,
        personalEmail: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        personalEmail2: "hungkaratedo03101998@gmail.com",
        homePhone: 978590338,
        emergencyContactPerson: "Nguyễn Văn Thái",
        relationWithEmergencyContactPerson: "Em trai",
        emergencyContactPersonPhoneNumber: 962586278,
        emergencyContactPersonEmail: "cuong@gmail.com",
        emergencyContactPersonHomePhone: 962586789,
        emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidenceCountry: "Việt Nam",
        permanentResidenceCity: "Nam Định",
        permanentResidenceDistrict: "Hải Hậu",
        permanentResidenceWard: "Hải Phương",
        temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        temporaryResidenceCountry: "Việt Nam",
        temporaryResidenceCity: "Hà Nội",
        temporaryResidenceDistrict: "Hai Bà Trưng",
        temporaryResidenceWard: "Bạch Mai",
        educationalLevel: "12/12",
        foreignLanguage: "500 Toeic",
        professionalSkill: 'university',
        healthInsuranceNumber: "N1236589",
        healthInsuranceStartDate: new Date("2019-01-25"),
        healthInsuranceEndDate: new Date("2020-02-16"),
        socialInsuranceNumber: "XH1569874",
        socialInsuranceDetails: [{
            company: "Vnist",
            position: "Nhân viên",
            startDate: new Date("2020-01"),
            endDate: new Date("2020-05")
        }],
        taxNumber: "12658974",
        taxRepresentative: "Nguyễn Văn Hưng",
        taxDateOfIssue: new Date("12/08/2019"),
        taxAuthority: "Chi cục thuế Huyện Hải Hậu",
        degrees: [{
            name: "Bằng tốt nghiệp",
            issuedBy: "Đại học Bách Khoa",
            year: "2020",
            degreeType: "good",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificates: [{
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: new Date("2019-10-25"),
            endDate: new Date("2020-10-25"),
            urlFile: "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        experiences: [{
            startDate: new Date("2019-06"),
            endDate: new Date("2020-02"),
            company: "Vnist",
            position: "Nhân viên"
        }],
        contracts: [{
            name: "Thực tập",
            contractType: "Phụ thuộc",
            startDate: new Date("2019-10-25"),
            endDate: new Date("2020-10-25"),
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        archivedRecordNumber: "T3 - 123698",
        files: [],
    }, {
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Trần Văn Bình",
        employeeNumber: "MS2015124",
        status: "active",
        company: vnist._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: new Date("1998-02-17"),
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: new Date("2015-10-20"),
        identityCardAddress: "Nam Định",
        emailInCompany: "tvb.vnist@gmail.com",
        nationality: "Việt Nam",
        atmNumber: "102298653",
        bankName: "ViettinBank",
        bankAddress: "Hai Bà Trưng",
        ethnic: "Kinh",
        religion: "Không",
        maritalStatus: "single",
        phoneNumber: 962586290,
        personalEmail: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        personalEmail2: "hungkaratedo03101998@gmail.com",
        homePhone: 978590338,
        emergencyContactPerson: "Nguyễn Văn Thái",
        relationWithEmergencyContactPerson: "Em trai",
        emergencyContactPersonPhoneNumber: 962586278,
        emergencyContactPersonEmail: "cuong@gmail.com",
        emergencyContactPersonHomePhone: 962586789,
        emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidenceCountry: "Việt Nam",
        permanentResidenceCity: "Nam Định",
        permanentResidenceDistrict: "Hải Hậu",
        permanentResidenceWard: "Hải Phương",
        temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        temporaryResidenceCountry: "Việt Nam",
        temporaryResidenceCity: "Hà Nội",
        temporaryResidenceDistrict: "Hai Bà Trưng",
        temporaryResidenceWard: "Bạch Mai",
        educationalLevel: "12/12",
        foreignLanguage: "500 Toeic",
        professionalSkill: 'university',
        healthInsuranceNumber: "N1236589",
        healthInsuranceStartDate: new Date("2019-01-25"),
        healthInsuranceEndDate: new Date("2020-02-16"),
        socialInsuranceNumber: "XH1569874",
        socialInsuranceDetails: [{
            company: "Vnist",
            position: "Nhân viên",
            startDate: new Date("2020-01"),
            endDate: new Date("2020-05")
        }],
        taxNumber: "12658974",
        taxRepresentative: "Nguyễn Văn Hưng",
        taxDateOfIssue: new Date("12/08/2019"),
        taxAuthority: "Chi cục thuế Huyện Hải Hậu",
        degrees: [{
            name: "Bằng tốt nghiệp",
            issuedBy: "Đại học Bách Khoa",
            year: "2020",
            degreeType: "good",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificates: [{
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: new Date("2019-10-25"),
            endDate: new Date("2020-10-25"),
            urlFile: "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        experiences: [{
            startDate: new Date("2019-06"),
            endDate: new Date("2020-02"),
            company: "Vnist",
            position: "Nhân viên"
        }],
        contracts: [{
            name: "Thực tập",
            contractType: "Phụ thuộc",
            startDate: new Date("2019-10-25"),
            endDate: new Date("2020-10-25"),
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        archivedRecordNumber: "T3 - 123698",
        files: [],
    }])
    console.log("Khởi tạo dữ liệu nhân viên!");
    var employee = await Employee.create({
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Nguyễn Văn An",
        employeeNumber: "MS2015123",
        status: "active",
        company: vnist._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: new Date("1988-05-20"),
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: new Date("2015-10-20"),
        identityCardAddress: "Nam Định",
        emailInCompany: "nva.vnist@gmail.com",
        nationality: "Việt Nam",
        atmNumber: "102298653",
        bankName: "ViettinBank",
        bankAddress: "Hai Bà Trưng",
        ethnic: "Kinh",
        religion: "Không",
        maritalStatus: "single",
        phoneNumber: 962586290,
        personalEmail: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        personalEmail2: "hungkaratedo03101998@gmail.com",
        homePhone: 978590338,
        emergencyContactPerson: "Nguyễn Văn Thái",
        relationWithEmergencyContactPerson: "Em trai",
        emergencyContactPersonPhoneNumber: 962586278,
        emergencyContactPersonEmail: "cuong@gmail.com",
        emergencyContactPersonHomePhone: 962586789,
        emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidenceCountry: "Việt Nam",
        permanentResidenceCity: "Nam Định",
        permanentResidenceDistrict: "Hải Hậu",
        permanentResidenceWard: "Hải Phương",
        temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        temporaryResidenceCountry: "Việt Nam",
        temporaryResidenceCity: "Hà Nội",
        temporaryResidenceDistrict: "Hai Bà Trưng",
        temporaryResidenceWard: "Bạch Mai",
        educationalLevel: "12/12",
        foreignLanguage: "500 Toeic",
        professionalSkill: 'university',
        healthInsuranceNumber: "N1236589",
        healthInsuranceStartDate: new Date("2019-01-25"),
        healthInsuranceEndDate: new Date("2020-02-16"),
        socialInsuranceNumber: "XH1569874",
        socialInsuranceDetails: [{
            company: "Vnist",
            position: "Nhân viên",
            startDate: new Date("2020-01"),
            endDate: new Date("2020-05")
        }],
        taxNumber: "12658974",
        taxRepresentative: "Nguyễn Văn Hưng",
        taxDateOfIssue: new Date("12/08/2019"),
        taxAuthority: "Chi cục thuế Huyện Hải Hậu",
        degrees: [{
            name: "Bằng tốt nghiệp",
            issuedBy: "Đại học Bách Khoa",
            year: "2020",
            degreeType: "good",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificates: [{
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: new Date("2019-10-25"),
            endDate: new Date("2020-10-25"),
            urlFile: "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        experiences: [{
            startDate: new Date("2019-06"),
            endDate: new Date("2020-02"),
            company: "Vnist",
            position: "Nhân viên"
        }],
        contracts: [{
            name: "Thực tập",
            contractType: "Phụ thuộc",
            startDate: new Date("2019-10-25"),
            endDate: new Date("2020-10-25"),
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        archivedRecordNumber: "T3 - 123698",
        files: [{
            name: "Ảnh",
            description: "Ảnh 3x4",
            number: "1",
            status: "submitted",
            urlFile: "lib/fileEmployee/1582212624054-3.5.1.png"
        }],
    });
    console.log(`Xong! Thông tin nhân viên đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NGHỊ PHÉP
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu nghỉ phép!");
    await AnnualLeave.insertMany([{
        employee: employee._id,
        company: vnist._id,
        startDate: "2020-02-06",
        endDate: "2020-02-08",
        status: "pass",
        reason: "Về quê",
    }, {
        employee: employee._id,
        company: vnist._id,
        startDate: "2020-02-05",
        endDate: "2020-02-10",
        status: "process",
        reason: "Nghỉ tết"
    }])
    console.log(`Xong! Thông tin nghỉ phép đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu lương nhân viên!");
    await Salary.insertMany([{
        employee: employee._id,
        company: vnist._id,
        month: "2020-02",
        mainSalary: "10000000",
        unit: 'VND',
        bonus: [{
            nameBonus: "Thưởng dự án",
            number: "1000000"
        }],
    }, {
        employee: employee._id,
        company: vnist._id,
        month: "2020-01",
        mainSalary: "10000000",
        unit: 'VND',
        bonus: [{
            nameBonus: "Thưởng tháng 1",
            number: "1000000"
        }],
    }])
    console.log(`Xong! Thông tin lương nhân viên đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHEN THƯỞNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu khen thưởng!");
    await Commendation.insertMany([{
        employee: employee._id,
        company: vnist._id,
        decisionNumber: "123",
        organizationalUnit: departments[0]._id,
        startDate: "2020-02-02",
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
    },
    {
        employee: employee._id,
        company: vnist._id,
        decisionNumber: "1234",
        organizationalUnit: departments[0]._id,
        startDate: "2020-02-02",
        type: "Thưởng tiền",
        reason: "Vượt doanh số 500 triệu",
    }
    ])
    console.log(`Xong! Thông tin khen thưởng đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KỶ LUẬT NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu kỷ luật!");
    await Discipline.insertMany([{
        employee: employee._id,
        company: vnist._id,
        decisionNumber: "1456",
        organizationalUnit: departments[0]._id,
        startDate: "2020-02-07",
        endDate: "2020-02-09",
        type: "Phạt tiền",
        reason: "Không làm đủ công",
    }, {
        employee: employee._id,
        company: vnist._id,
        decisionNumber: "1457",
        organizationalUnit: departments[0]._id,
        startDate: "2020-02-07",
        endDate: "2020-02-09",
        type: "Phạt tiền",
        reason: "Không đủ doanh số",
    }])
    console.log(`Xong! Thông tin kỷ luật đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CHƯƠNG TRÌNH ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu chương trình đào tạo bắt buộc!");
    var educationProgram = await EducationProgram.insertMany([{
        company: vnist._id,
        applyForOrganizationalUnits: [
            departments[0]._id
        ],
        applyForPositions: [
            nvPhongHC._id
        ],
        name: "An toan lao dong",
        programId: "M123",
    }, {
        company: vnist._id,
        applyForOrganizationalUnits: [
            departments[0]._id
        ],
        applyForPositions: [
            nvPhongHC._id
        ],
        name: "kỹ năng giao tiếp",
        programId: "M1234",
    }])
    console.log(`Xong! Thông tin chương trình đào tạo  đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHOÁ ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu khoá đào tạo bắt buộc!");
    await Course.insertMany([{
        company: vnist._id,
        name: "An toàn lao động 1",
        courseId: "LD1233",
        offeredBy: "Vnists",
        coursePlace: "P9.01",
        startDate: "2020-02-16",
        endDate: "2020-03-21",
        cost: {
            number: "1200000",
            unit: 'VND'
        },
        lecturer: "Nguyễn B",
        type: "external",
        educationProgram: educationProgram[0]._id,
        employeeCommitmentTime: "6",
    }, {
        company: vnist._id,
        name: "An toàn lao động 2",
        courseId: "LD123",
        offeredBy: "Vnists",
        coursePlace: "P9.01",
        startDate: "2020-02-16",
        endDate: "2020-03-21",
        cost: {
            number: "1200000",
            unit: 'VND'
        },
        lecturer: "Nguyễn Văn B",
        type: "internal",
        educationProgram: educationProgram[1]._id,
        employeeCommitmentTime: "6",
    }])
    console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);


    const domains = await DocumentDomain.insertMany([{
        name: "Tài liệu lữu trữ bắt buộc",
        company: vnist,
        description: 'Tài liệu lữu trữ bắt buộc'
    }, {
        name: "Hồ sơ lữu trữ bắt buộc",
        company: vnist,
        description: 'Hồ sơ lữu trữ bắt buộc'
    },]);

    const domanins2 = await DocumentDomain.insertMany([
        //tài liệu bắt buộc
        {
            name: "Điều lệ công ty",
            company: vnist,
            description: 'Điều lệ công ty',
            parent: domains[0]._id
        }, {
            name: "Quy chế quản lý nội bộ công ty",
            company: vnist,
            description: 'Quy chế quản lý nội bộ công ty',
            parent: domains[0]._id
        }, {
            name: "Sổ đăng ký thành viên hoặc sổ đăng ký cổ đông",
            company: vnist,
            description: 'Sổ đăng ký thành viên hoặc sổ đăng ký cổ đông',
            parent: domains[0]._id
        }, {
            name: "Văn bằng bảo hộ quyền sở hữu công nghiệp",
            company: vnist,
            description: 'Văn bằng bảo hộ quyền sở hữu công nghiệp',
            parent: domains[0]._id
        }, {
            name: "Giấy chứng nhận đăng ký chất lượng sản phẩm",
            company: vnist,
            description: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
            parent: domains[0]._id
        }, {
            name: "Giấy phép và giấy chứng nhận khác",
            company: vnist,
            description: 'Giấy phép và giấy chứng nhận khác',
            parent: domains[0]._id
        }, {
            name: "Tài liệu, giấy tờ xác nhận quyền sở hữu tài sản của công ty",
            company: vnist,
            description: 'Tài liệu, giấy tờ xác nhận quyền sở hữu tài sản của công ty',
            parent: domains[0]._id
        }, {
            name: "Biên bản họp hội đồng thành viên",
            company: vnist,
            description: 'Biên bản họp hội đồng thành viên, đại hội đồng cổ đông, hội đồng quản trị, các quyết định của doanh nghiệp',
            parent: domains[0]._id
        }, {
            name: "Bản cáo bạch để phát hành chứng khoán",
            company: vnist,
            description: 'Bản cáo bạch để phát hành chứng khoán',
            parent: domains[0]._id
        }, {
            name: "Báo cáo của ban kiểm soát",
            company: vnist,
            description: 'Báo cáo của ban kiểm soát, kết luận của cơ quan thanh tra, kết luận của tổ chức kiểm toán',
            parent: domains[0]._id
        }, {
            name: "Sổ kế toán, chứng từ kế toán, báo cáo tài chính hằng năm",
            company: vnist,
            description: 'Sổ kế toán, chứng từ kế toán, báo cáo tài chính hằng năm',
            parent: domains[0]._id
        },

        //hồ sơ
        {
            name: "Hồ sơ thống kê kết quả thực hiện mục tiêu chất lượng",
            company: vnist,
            description: 'Hồ sơ thống kê kết quả thực hiện mục tiêu chất lượng của từng phòng ban và của tổ chức',
            parent: domains[1]._id
        },
        {
            name: "Hồ sơ xem xét của lãnh đạo",
            company: vnist,
            description: 'Hồ sơ xem xét của lãnh đạo',
            parent: domains[1]._id
        }, {
            name: "Hồ sơ về các hoạt động giáo dục, đào tạo, huấn luyện kỹ năng",
            company: vnist,
            description: 'Hồ sơ về các hoạt động giáo dục, đào tạo, huấn luyện kỹ năng',
            parent: domains[1]._id
        }, {
            name: "Hồ sơ về kinh nghiệm làm việc của nhân viên",
            company: vnist,
            description: 'Hồ sơ về kinh nghiệm làm việc của nhân viên',
            parent: domains[1]._id
        },
        {
            name: "Hồ sơ yêu cầu của các đơn đặt hàng từ khách hàng",
            company: vnist,
            description: 'Hồ sơ thống kê kết quả thực hiện mục tiêu chất lượng của từng phòng ban và của tổ chức',
            parent: domains[1]._id
        },
        {
            name: "Các hồ sơ cung cấp thông tin đầu vào",
            company: vnist,
            description: 'Các hồ sơ cung cấp thông tin đầu vào phục vụ cho thiết kế sản phẩm',
            parent: domains[1]._id
        }, {
            name: "Hồ sơ tài liệu quản lý chất lượng ISO 9001",
            company: vnist,
            description: 'Hồ sơ tài liệu quản lý chất lượng ISO 9001',
            parent: domains[1]._id
        }, {
            name: "Hồ sơ ghi nhận hoạt động xem xét thiết kế sản phẩm",
            company: vnist,
            description: 'Hồ sơ ghi nhận hoạt động xem xét thiết kế sản phẩm',
            parent: domains[1]._id
        },
        {
            name: "Hồ sơ kết quả xác nhận giá trị sử dụng của thiết kế sản phẩm",
            company: vnist,
            description: 'Hồ sơ kết quả xác nhận giá trị sử dụng của thiết kế sản phẩm',
            parent: domains[1]._id
        },
    ]);
    const archives = await DocumentArchive.insertMany([{
        name: "Văn phòng B1",
        company: vnist,
        description: "Văn phòng B1",
        path: "Văn phòng B1",
    }, {
        name: "Văn phòng B2",
        company: vnist,
        description: "Văn phòng B2",
        path: "Văn phòng B2",
    }, {
        name: "Văn phòng B3",
        company: vnist,
        description: "Văn phòng B3",
        path: "Văn phòng B3",
    },
    ]);
    const archives2 = await DocumentArchive.insertMany([{
        name: "Phòng 201",
        company: vnist,
        description: "Phòng  lưu trữ tầng 2",
        path: "Văn phòng B1 - Phòng 201",
        parent: archives[0],
    }, {
        name: "Phòng 202",
        company: vnist,
        description: "Phòng giám đốc",
        path: "Văn phòng B1 - Phòng 202",
        parent: archives[0],
    }, {
        name: "Phòng 301",
        company: vnist,
        path: "Văn phòng B2 - Phòng 301",
        parent: archives[1],
    }, {
        name: "Phòng 302",
        company: vnist,
        path: "Văn phòng B2 - Phòng 302",
        parent: archives[1],
    }, {
        name: "Phòng 403",
        company: vnist,
        path: "Văn phòng B3 - Phòng 403",
        parent: archives[2],
    }, {
        name: "Phòng 404",
        company: vnist,
        path: "Văn phòng B3 - Phòng 404",
        parent: archives[2],
    },

    ]);
    const archives3 = await DocumentArchive.insertMany([{
        name: "Tủ 1",
        company: vnist,
        path: "Văn phòng B1 - Phòng 201 - Tủ 1",
        parent: archives2[0],
    }, {
        name: "Tủ 2",
        company: vnist,
        path: "Văn phòng B1 - Phòng 201 - Tủ 2",
        parent: archives2[0],
    }, {
        name: "Tủ 1",
        company: vnist,
        path: "Văn phòng B1 - Phòng 202 - Tủ 1",
        parent: archives2[1],
    }, {
        name: "Tủ A",
        company: vnist,
        path: "Văn phòng B2 - Phòng 301 - Tủ A",
        parent: archives2[2],
    }, {
        name: "Tủ B",
        company: vnist,
        path: "Văn phòng B2 - Phòng 301 - Tủ B",
        parent: archives2[2],
    }, {
        name: "Tủ to",
        company: vnist,
        path: "Văn phòng B3 - Phòng 403 - Tủ to",
        parent: archives2[4],
    }, {
        name: "Tủ nhỏ",
        company: vnist,
        path: "Văn phòng B3 - Phòng 403 - Tủ nhỏ",
        parent: archives2[4],
    }, {
        name: "Tủ trung bình",
        company: vnist,
        path: "Văn phòng B3 - Phòng 403 - Tủ trung bình",
        parent: archives2[4],
    },

    ]);
    const archives4 = await DocumentArchive.insertMany([{
        name: "Ngăn đầu",
        company: vnist,
        path: "Văn phòng B1 - Phòng 201 - Tủ 1 - Ngăn đầu",
        parent: archives3[0],
    },

    ])
    const categories = await DocumentCategory.insertMany([{
        company: vnist._id,
        name: "Văn bản",
        description: 'Văn bản'
    }, {
        company: vnist._id,
        name: "Biểu mẫu",
        description: 'Biểu mẫu'
    }, {
        company: vnist._id,
        name: "Công văn",
        description: 'Công văn'
    }, {
        company: vnist._id,
        name: "Hồ sơ",
        description: 'Hồ sơ'
    }, {
        company: vnist._id,
        name: "Biên bản",
        description: 'Biên bản'
    }, {
        company: vnist._id,
        name: "Tài liệu khác",
        description: 'Tài liệu khác'
    },]);

    const documents = await Document.insertMany([{
        name: 'Đi chơi',
        category: categories[0],
        domains: [domanins2[1]],
        archives: [archives4[0]],
        company: vnist._id,
        versions: [{
            versionName: "Đi chơi",
            issuingDate: "2020-08-16",
            effectiveDate: "2020-08-16",
            expiredDate: "2020-08-16",
        }]
    }, {
        name: 'Điều lệ công ty',
        category: categories[2],
        domains: [domanins2[0]],
        archives: [archives3[3]],
        company: vnist._id,
        versions: [{
            versionName: 'Điều lệ công ty',
            issuingDate: "2020-08-16",
            effectiveDate: "2020-08-16",
            expiredDate: "2020-08-16",
        }]
    }, {
        name: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
        category: categories[3],
        domains: [domanins2[4]],
        archives: [archives3[3]],
        company: vnist._id,
        versions: [{
            versionName: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
            issuingDate: "2020-08-16",
            effectiveDate: "2020-08-16",
            expiredDate: "2020-08-16",
        }]
    }, {
        name: 'Giấy chứng nhận đăng ký chất lượng hàng nhập',
        category: categories[4],
        domains: [domanins2[12]],
        archives: [archives3[4]],
        company: vnist._id,
        versions: [{
            versionName: 'Giấy chứng nhận đăng ký chất lượng hàng nhập',
            issuingDate: "2020-08-16",
            effectiveDate: "2020-08-16",
            expiredDate: "2020-08-16",
        }]
    }, {
        name: 'Kết quả khảo sát định kỳ',
        category: categories[5],
        domains: [domanins2[1]],
        archives: [archives4[0]],
        company: vnist._id,
        versions: [{
            versionName: 'Kết quả khảo sát định kỳ',
            issuingDate: "2020-08-16",
            effectiveDate: "2020-08-16",
            expiredDate: "2020-08-16",
        }]
    }, {
        name: 'Giấy chứng nhận đăng ký chất lượng thực phẩm',
        category: categories[3],
        domains: [domanins2[4]],
        archives: [archives3[3]],
        company: vnist._id,
        versions: [{
            versionName: 'Giấy chứng nhận đăng ký chất lượng thực phẩm',
            issuingDate: "2020-08-16",
            effectiveDate: "2020-08-16",
            expiredDate: "2020-08-16",
        }]
    },
    ])

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU lOẠI TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu loại tài sản");
    var listAssetType = await AssetType.insertMany([
        { //0
            company: vnist._id,
            typeNumber: "BA",
            typeName: "Bàn",
            parent: null,
            description: "Các loại bàn"
        }, { //1
            company: vnist._id,
            typeNumber: "BC",
            typeName: "Băng chuyền",
            parent: null,
            description: "Các loại băng chuyền"
        }, { //2
            company: vnist._id,
            typeNumber: "BG",
            typeName: "Bảng",
            parent: null,
            description: "Các loại bảng, viết, bảng từ, bảng chỉ dẫn"
        }, { //3
            company: vnist._id,
            typeNumber: "BI",
            typeName: "Bình",
            parent: null,
            description: "Các loại bình chứa: bình nước,..."
        }, { //4
            company: vnist._id,
            typeNumber: "BN",
            typeName: "Bồn",
            parent: null,
            description: "Các loại bồn rửa tay, bồn đựng nước"
        }, { //5
            company: vnist._id,
            typeNumber: "BU",
            typeName: "Bục",
            parent: null,
            description: "Các loại bục để giày dép, để chân, để tượng"
        }, { //6
            company: vnist._id,
            typeNumber: "CA",
            typeName: "Cân",
            parent: null,
            description: "Các loại cân"
        }, { //7
            company: vnist._id,
            typeNumber: "Đèn",
            typeName: "DE",
            parent: null,
            description: "Đèn các loại"
        }, { //8
            company: vnist._id,
            typeNumber: "DH",
            typeName: "Điều hòa",
            parent: null,
            description: "Điều hòa các loại"
        }, { //9
            company: vnist._id,
            typeNumber: "DO",
            typeName: "Đồng hồ",
            parent: null,
            description: "Các loại đồng hồ"
        }, { //10
            company: vnist._id,
            typeNumber: "GH",
            typeName: "Ghế",
            parent: null,
            description: "Ghế các loại"
        }, { //11
            company: vnist._id,
            typeNumber: "GI",
            typeName: "Giá",
            parent: null,
            description: "Giá các chất liệu để tài liệu, trei, vật dụng nhỏ"
        }, { //12
            company: vnist._id,
            typeNumber: "HT",
            typeName: "Hệ thống",
            parent: null,
            description: "Các thiết bị hệ thống"
        }, { //13
            company: vnist._id,
            typeNumber: "KE",
            typeName: "Kệ hòm",
            parent: null,
            description: "Hòm, Kệ các chất liệu để tài liệu, có thể di động, có mặt phẳng"
        }, { //14
            company: vnist._id,
            typeNumber: "QU",
            typeName: "Quạt",
            parent: null,
            description: "Quạt các loại"
        }, { //15
            company: vnist._id,
            typeNumber: "TU",
            typeName: "Tủ đựng tài liệu và chứa các vật phẩm, TB",
            parent: null,
            description: ""
        }, { //16
            company: vnist._id,
            typeNumber: "MV",
            typeName: "Thiết bị máy văn phòng",
            parent: null,
            description: "Tất cả các máy liên quan tới làm việc tại VP, Máy hút bụi, máy giặt, máy hút mùi"
        }, { //17
            company: vnist._id,
            typeNumber: "DX",
            typeName: "Dụng cụ SX",
            parent: null,
            description: "Các vật dụng như thùng các chất liệu để đựng, chứa, pha chế, chia liều cột"
        }, { //18
            company: vnist._id,
            typeNumber: "MK",
            typeName: "Máy cơ khí",
            parent: null,
            description: "Các máy liên quan tới hỗ trọ SX trực tiếp, sửa chữa, xây dựng"
        }, { //19
            company: vnist._id,
            typeNumber: "TM",
            typeName: "Máy vi tính và thiết bị mạng",
            parent: null,
            description: "Máy vi tính các loại + phụ kiện + các thiết bị mạng"
        }, { //20
            company: vnist._id,
            typeNumber: "AA",
            typeName: "Thiết bị âm thanh, hình ảnh",
            parent: null,
            description: "Các thiết bị điện tử riêng biệt liên quan tới âm thanh, hình ảnh"
        }, { //21
            company: vnist._id,
            typeNumber: "NB",
            typeName: "Các vật dụng liên quan tới nhà bếp",
            parent: null,
            description: "Bếp, bình ga, nồi, chảo..."
        }, { //22
            company: vnist._id,
            typeNumber: "PC",
            typeName: "Các thiết bị PCCC",
            parent: null,
            description: ""
        }, { //23
            company: vnist._id,
            typeNumber: "XE",
            typeName: "Xe các loại",
            parent: null,
            description: ""
        }, { //24
            company: vnist._id,
            typeNumber: "KH",
            typeName: "Khác",
            parent: null,
            description: ""
        }, { //25
            company: vnist._id,
            typeNumber: "MB",
            typeName: "Mặt bằng",
            parent: null,
            description: ""
        }
    ])
    console.log(`Xong! Thông tin loại tài sản đã được tạo`);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU PHIẾU ĐĂNG KÝ MUA SẮM TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu phiếu đăng ký mua sắm tài sản");
    var listRecommendProcure = await RecommendProcure.insertMany([{
        company: vnist._id,
        recommendNumber: "MS0001",
        dateCreate: "20-04-2020",
        proponent: users[4]._id,
        equipment: "đề nghị mua Laptop DELL 5559",
        supplier: "HanoiComputer",
        total: "1",
        unit: "cái",
        estimatePrice: "30000000",
        note: "",
        approver: null,
        status: "Chờ phê duyệt"
    }, {
        company: vnist._id,
        recommendNumber: "MS0002",
        dateCreate: "20-06-2020",
        proponent: users[5]._id,
        equipment: "đề nghị mua Laptop DELL XPS",
        supplier: "Phong Vũ",
        total: "1",
        unit: "cái",
        estimatePrice: "50000000",
        note: "",
        approver: null,
        status: "Chờ phê duyệt"
    }, {
        company: vnist._id,
        recommendNumber: "MS0003",
        dateCreate: "20-04-2020",
        proponent: users[7]._id,
        equipment: "đề nghị mua máy photocopy",
        supplier: "HanoiComputer",
        total: "1",
        unit: "cái",
        estimatePrice: "25000000",
        note: "",
        approver: null,
        status: "Chờ phê duyệt"
    }, {
        company: vnist._id,
        recommendNumber: "MS0004",
        dateCreate: "20-05-2020",
        proponent: users[4]._id,
        equipment: "đề nghị mua ô tô",
        supplier: "Toyota Thanh Xuân",
        total: "1",
        unit: "cái",
        estimatePrice: "500000000",
        note: "",
        approver: null,
        status: "Chờ phê duyệt"
    }])
    console.log(`Xong! Thông tin phiếu đăng ký mua sắm tài sản đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu tài sản");
    var listAsset = await Asset.insertMany([{
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Laptop Sony Vaio",
        group: "Machine",
        usefulLife: "12",
        unitsProducedDuringTheYears: [{
            month: new Date("2020-06-20"),
            unitsProducedDuringTheYear: 10
        }
        ],
        estimatedTotalProduction: 1000,
        code: "VVTM02.001",
        company: vnist._id,
        serial: "00001",
        assetType: listAssetType[19]._id,
        purchaseDate: new Date("2020-06-20"),
        warrantyExpirationDate: new Date("2022-06-20"),
        managedBy: users[1]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,
        status: "Thanh lý",
        canRegisterForUse: true,
        description: "Laptop Sony Vaio",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 50000000,
        residualValue: 10000000,
        startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 20, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: new Date("2020-06-20"),
        disposalType: '',
        disposalCost: 20000000,
        disposalDesc: '',
        //tài liệu đính kèm
        archivedRecordNumber: "PKD001",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Điều hòa Panasonic 9.000BTU",
        code: "VVDH01.017",
        company: vnist._id,
        group: "Machine",
        usefulLife: "15",
        unitsProducedDuringTheYears: [{
            month: new Date("2015-06-20"),
            unitsProducedDuringTheYear: 4
        }
        ],
        estimatedTotalProduction: 50,
        serial: "00002",
        assetType: listAssetType[8]._id,
        purchaseDate: new Date("2020-05-20"),
        warrantyExpirationDate: new Date("2022-05-20"),
        managedBy: users[1]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,
        status: "Thanh lý",
        canRegisterForUse: true,
        description: "Điều hòa Panasonic 9.000BTU",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 40000000,
        residualValue: 5000000,
        startDepreciation: new Date("2020-05-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 18, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: new Date("2020-05-20"),
        disposalType: "2",
        disposalCost: 10000000,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PKD002",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy tính cây",
        code: "VVMV18.001",
        company: vnist._id,
        group: "Other",
        usefulLife: "20",
        unitsProducedDuringTheYears: [{
            month: new Date("2017-06-20"),
            unitsProducedDuringTheYear: 20
        }
        ],
        estimatedTotalProduction: 500,
        serial: "00003",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-25"),
        warrantyExpirationDate: new Date("2022-05-25"),
        managedBy: users[5]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy tính cây",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 30000000,
        residualValue: 5000000,
        startDepreciation: new Date("2020-05-25"), // thời gian bắt đầu trích khấu hao
        usefulLife: 16, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN003",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy tính cây",
        code: "VVMV18.028",
        company: vnist._id,
        group: "Other",
        usefulLife: "20",
        unitsProducedDuringTheYears: [{
            month: new Date("2017-06-20"),
            unitsProducedDuringTheYear: 20
        }
        ],
        estimatedTotalProduction: 500,
        serial: "00003",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-25"),
        warrantyExpirationDate: new Date("2022-05-25"),
        managedBy: users[5]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy tính cây",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 30000000,
        residualValue: 5000000,
        startDepreciation: new Date("2020-05-25"), // thời gian bắt đầu trích khấu hao
        usefulLife: 16, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN003",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Iphone XS Max",
        code: "VVMV18.027",
        company: vnist._id,
        group: "Other",
        usefulLife: "20",
        unitsProducedDuringTheYears: [{
            month: new Date("2017-06-20"),
            unitsProducedDuringTheYear: 20
        }
        ],
        estimatedTotalProduction: 500,
        serial: "00003",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-25"),
        warrantyExpirationDate: new Date("2022-05-25"),
        managedBy: users[1]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy tính cây",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 50000000,
        residualValue: 5000000,
        startDepreciation: new Date("2020-05-25"), // thời gian bắt đầu trích khấu hao
        usefulLife: 16, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN003",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Card GTX 2050Ti",
        code: "VVMV18.0026",
        company: vnist._id,
        group: "Other",
        usefulLife: "20",
        unitsProducedDuringTheYears: [{
            month: new Date("2017-06-20"),
            unitsProducedDuringTheYear: 20
        }
        ],
        estimatedTotalProduction: 500,
        serial: "00003",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-25"),
        warrantyExpirationDate: new Date("2022-05-25"),
        managedBy: users[4]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy tính cây",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [
            {
                createdAt: new Date("2000-05-20"),
                dateOfIncident: new Date("2000-05-20"),
                description: "aaaaaa",
                incidentCode: "icd03",
                statusIncident: "Chờ xử lý",
                type: "Hỏng hóc",
                updatedAt: new Date("2000-05-20"),
            }
        ],
        //khấu hao
        cost: 30000000,
        residualValue: 5000000,
        startDepreciation: new Date("2020-05-25"), // thời gian bắt đầu trích khấu hao
        usefulLife: 16, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN003",
        files: [],
    }

    ])

    var asset = await Asset.create({
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "HUST",
        group: "Building",
        usefulLife: "40",
        unitsProducedDuringTheYears: [{
            month: new Date("2020-05-20"),
            unitsProducedDuringTheYear: 40
        }
        ],
        estimatedTotalProduction: 500,
        code: "VVTM02.000",
        company: vnist._id,
        serial: "00000",
        assetType: listAssetType[25]._id,
        purchaseDate: new Date("1956-06-20"),
        warrantyExpirationDate: new Date("2099-06-20"),
        managedBy: users[1]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,

        location: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "BK",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 50000000,
        residualValue: 10000000,
        startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 20, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: '',
        disposalCost: null,
        disposalDesc: '',
        //tài liệu đính kèm
        archivedRecordNumber: "PKD000",
        files: [],
    })
    var assetManagedByEmployee2 = await Asset.create({
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Phòng họp 02",
        group: "Building",
        usefulLife: "40",
        unitsProducedDuringTheYears: [{
            month: new Date("2020-05-20"),
            unitsProducedDuringTheYear: 40
        }
        ],
        estimatedTotalProduction: 500,
        code: "PH02.000",
        company: vnist._id,
        serial: "000002",
        assetType: listAssetType[25]._id,
        purchaseDate: new Date("1956-06-20"),
        warrantyExpirationDate: new Date("2099-06-20"),
        managedBy: users[5]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,

        location: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Phòng họp",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [
            {
                createdAt: new Date("2000-05-20"),
                dateOfIncident: new Date("2000-05-20"),
                description: "aaaaaa",
                incidentCode: "icd04",
                statusIncident: "Chờ xử lý",
                type: "Hỏng quạt",
                updatedAt: new Date("2000-05-20"),
            }
        ],
        //khấu hao
        cost: 50000000,
        residualValue: 10000000,
        startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 20, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: '',
        disposalCost: null,
        disposalDesc: '',
        //tài liệu đính kèm
        archivedRecordNumber: "PKD000",
        files: [],
    })
    var assetManagedByEmployee1 = await Asset.create({
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Phòng họp 01",
        group: "Building",
        usefulLife: "40",
        unitsProducedDuringTheYears: [{
            month: new Date("2020-05-20"),
            unitsProducedDuringTheYear: 40
        }
        ],
        estimatedTotalProduction: 500,
        code: "PH02.000",
        company: vnist._id,
        serial: "000002",
        assetType: listAssetType[25]._id,
        purchaseDate: new Date("1956-06-20"),
        warrantyExpirationDate: new Date("2099-06-20"),
        managedBy: users[5]._id,
        assignedToUser: null,
        assignedToOrganizaitonalUnit: null,

        location: null,
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Phòng họp",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [
            {
                createdAt: new Date("2000-05-20"),
                dateOfIncident: new Date("2000-05-20"),
                description: "aaaaaa",
                incidentCode: "icd04",
                statusIncident: "Chờ xử lý",
                type: "Hỏng quạt",
                updatedAt: new Date("2000-05-20"),
            }
        ],
        //khấu hao
        cost: 50000000,
        residualValue: 10000000,
        startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 20, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: '',
        disposalCost: null,
        disposalDesc: '',
        //tài liệu đính kèm
        archivedRecordNumber: "PKD000",
        files: [],
    })
    var listAsset1 = await Asset.insertMany([

        {//1 B1
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "B1",
            group: "Building",
            usefulLife: "32",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-05-20"),
                unitsProducedDuringTheYear: 10
            }
            ],
            estimatedTotalProduction: 500,
            code: "VVTM02.001",
            company: vnist._id,
            serial: "00001",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2000-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[1]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: asset._id,
            status: "Sẵn sàng sử dụng",
            canRegisterForUse: true,
            description: "B1",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: null,
            disposalType: '',
            disposalCost: null,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD001",
            documents: [],
        },
        { //2 TQB
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "TV TQB",
            group: "Building",
            usefulLife: "50",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-05-20"),
                unitsProducedDuringTheYear: 50
            }
            ],
            estimatedTotalProduction: 1000,
            code: "VVTM02.002",
            company: vnist._id,
            serial: "00002",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2005-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[1]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: asset._id,
            status: "Sẵn sàng sử dụng",
            canRegisterForUse: true,
            description: "TV",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: null,
            disposalType: '',
            disposalCost: null,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD002",
            documents: [],
        }]);

    var listAsset2 = await Asset.insertMany([
        {//3 B1 101
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "B1-101",
            group: "Building",
            code: "VVTM02.003",
            usefulLife: "12",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-06-20"),
                unitsProducedDuringTheYear: 10
            }
            ],
            estimatedTotalProduction: 1000,
            company: vnist._id,
            serial: "00003",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2000-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[1]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: listAsset1[0]._id,
            status: "Thanh lý",
            canRegisterForUse: true,
            description: "B1-101",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: new Date("2020-07-20"),
            disposalType: '',
            disposalCost: 12000000,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD003",
            documents: [],
        },
        {//04
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "B1-202",
            group: "Building",
            usefulLife: "22",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-05-20"),
                unitsProducedDuringTheYear: 3
            }
            ],
            estimatedTotalProduction: 100,
            code: "VVTM02.004",
            company: vnist._id,
            serial: "00004",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2000-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[1]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: listAsset1[0]._id,
            status: "Thanh lý",
            canRegisterForUse: true,
            description: "B1-202",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: new Date("2020-07-20"),
            disposalType: '',
            disposalCost: 35000000,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD004",
            documents: [],
        },
        {// 05
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "D3-101",
            group: "Building",
            usefulLife: "18",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-05-20"),
                unitsProducedDuringTheYear: 5
            }
            ],
            estimatedTotalProduction: 112,
            code: "VVTM02.005",
            company: vnist._id,
            serial: "00005",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2000-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[1]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: listAsset1[1]._id,
            status: "Sẵn sàng sử dụng",
            canRegisterForUse: true,
            description: "d3-101",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: null,
            disposalType: '',
            disposalCost: null,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD005",
            documents: [],
        },
        {// 06
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "D3-102",
            group: "Building",
            usefulLife: "20",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-05-20"),
                unitsProducedDuringTheYear: 10
            }
            ],
            estimatedTotalProduction: 300,
            code: "VVTM02.006",
            company: vnist._id,
            serial: "00006",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2000-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[5]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: listAsset1[1]._id,
            status: "Sẵn sàng sử dụng",
            canRegisterForUse: true,
            description: "d3-102",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [
                {
                    createdAt: new Date("2000-05-20"),
                    dateOfIncident: new Date("2000-05-20"),
                    description: "hỏng hóc",
                    incidentCode: "icd01",
                    statusIncident: "Chờ xử lý",
                    type: "Hỏng hóc",
                    updatedAt: new Date("2000-05-20"),
                },
                {
                    createdAt: new Date("2000-08-20"),
                    dateOfIncident: new Date("2000-08-20"),
                    description: "cháy",
                    incidentCode: "icd01",
                    statusIncident: "Chờ xử lý",
                    type: "Hỏng hóc",
                    updatedAt: new Date("2000-08-20"),
                }
            ],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: null,
            disposalType: '',
            disposalCost: null,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD006",
            documents: [],
        },
        {// 07
            avatar: "/upload/asset/pictures/picture5.png",
            assetName: "D3-103",
            group: "Building",
            usefulLife: "12",
            unitsProducedDuringTheYears: [{
                month: new Date("2020-05-20"),
                unitsProducedDuringTheYear: 80
            }
            ],
            estimatedTotalProduction: 1000,
            code: "VVTM02.007",
            company: vnist._id,
            serial: "00007",
            assetType: listAssetType[25]._id,
            purchaseDate: new Date("2000-05-20"),
            warrantyExpirationDate: new Date("2077-06-20"),
            managedBy: users[1]._id,
            assignedToUser: null,
            assignedToOrganizaitonalUnit: null,

            location: listAsset1[1]._id,
            status: "Sẵn sàng sử dụng",
            canRegisterForUse: true,
            description: "d3-103",
            detailInfo: [],

            usageLogs: [],
            // bảo trì thiết bị
            maintainanceLogs: [],
            //sự cố
            incidentLogs: [],
            //khấu hao
            cost: 50000000,
            residualValue: 10000000,
            startDepreciation: new Date("2020-06-20"), // thời gian bắt đầu trích khấu hao
            usefulLife: 20, // thời gian trích khấu hao
            depreciationType: "Đường thẳng", // thời gian trích khấu hao
            //thanh lý
            disposalDate: null,
            disposalType: '',
            disposalCost: null,
            disposalDesc: '',
            //tài liệu đính kèm
            archivedRecordNumber: "PKD007",
            documents: [],
        }
    ])


    console.log(`Xong! Thông tin tài sản đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU ĐĂNG KÝ SỬ DỤNG TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu đăng ký sử dụng tài sản!");
    var recommmenddistribute = await RecommendDistribute.insertMany([
        {
            asset: asset._id,
            company: vnist._id,
            recommendNumber: "CP0001",
            dateCreate: "19-05-2020",
            proponent: users[4]._id,
            reqContent: "Đăng ký sử dụng tài sản",
            dateStartUse: "20-05-2020",
            dateEndUse: "20-06-2020",
            approver: users[1]._id,
            note: "",
            status: "Chờ phê duyệt",
        },
        {
            asset: assetManagedByEmployee1._id,
            company: vnist._id,
            recommendNumber: "CP0002",
            dateCreate: "19-05-2020",
            proponent: users[4]._id,
            reqContent: "Đăng ký sử dụng tài sản",
            dateStartUse: "20-05-2020",
            dateEndUse: "20-06-2020",
            approver: users[5]._id,
            note: "",
            status: "Chờ phê duyệt",
        },
        {
            asset: assetManagedByEmployee2._id,
            company: vnist._id,
            recommendNumber: "CP0003",
            dateCreate: "19-05-2020",
            proponent: users[4]._id,
            reqContent: "Đăng ký sử dụng tài sản",
            dateStartUse: "20-05-2020",
            dateEndUse: "20-06-2020",
            approver: users[5]._id,
            note: "",
            status: "Chờ phê duyệt",
        },
    ])
    console.log(`Xong! Thông tin đăng ký sử dụng tài sản đã được tạo`);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU vật tư
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu vật tư");
    var listMaterial = await Material.insertMany([{
        materialName: "Laptop Sony Vaio",
        code: "VVTM02.001",
        serial: "00001",
        materialType: "Máy tính",
        purchaseDate: new Date("2020-06-20"),
        location: "PKD",
        description: "Laptop Sony Vaio",
        cost: 50000000,
    },
    {
        materialName: "Bàn học",
        code: "VVTM02.002",
        serial: "00002",
        materialType: "Bàn",
        purchaseDate: new Date("2020-06-21"),
        location: "PKD",
        description: "Bàn học",
        cost: 10000000,
    }
    ]);
    console.log("Khởi tạo xong danh sách vật tư");

    console.log("Tạo mẫu dữ liệu khách hàng");

    const customerGroupData = [
        {
            name: "Khách bán buôn",
            code: 'KBB',
            company: vnist._id
        }, {
            name: "Sỉ lẻ",
            code: "SL",
            company: vnist._id
        }, {
            name: "Nhà cung cấp Anh Đức",
            code: "CCAD",
            company: vnist._id
        }, {
            name: "Đại lý Việt Anh",
            code: "ĐLVA",
            company: vnist._id
        }
    ];
    const customerGroup = await CrmGroup.insertMany(customerGroupData);

    const customerData = [
        {
            name: 'Nguyễn Thị Phương',
            code: 'HN1101',
            phone: '0396629958',
            address: '123 xã Đàn, Phương Liên, Đống Đa',
            location: "Hà Nội",
            email: 'ntphuong@gmail.com',
            group: customerGroup[0]._id,
            birth: '2/10/1995',
            gender: 'Nữ',
            loyal: true,
            company: vnist._id
        }, {
            name: 'Trần Mỹ Hạnh',
            code: 'HN2497',
            phone: '0396629919',
            address: '223 Đê La Thành',
            location: "Hà Nội",
            email: 'ntphuong@gmail.com',
            group: customerGroup[2]._id,
            birth: '2/10/1995',
            gender: 'Nữ',
            loyal: true,
            company: vnist._id
        }, {
            name: 'Nguyễn Văn Thành',
            code: 'HN1111',
            phone: '0396627758',
            address: '123 Cầu Giấy',
            location: "Hà Nội",
            email: 'nvthanh@gmail.com',
            group: customerGroup[0]._id,
            birth: '03/10/1991',
            gender: 'Nam',
            loyal: true,
            company: vnist._id
        }, {
            name: 'Lê Công Vinh',
            code: 'HN1169',
            phone: '0395223919',
            address: '12 Phạm Ngọc Thạch',
            location: "Hà Nội",
            email: 'lcvinh@gmail.com',
            group: customerGroup[1]._id,
            birth: '11/11/1985',
            gender: 'Nam',
            loyal: true,
            company: vnist._id
        }, {
            name: 'Nguyễn Thị Lê',
            code: 'HN1256',
            phone: '03977733214',
            address: '11 phố Huế',
            location: "Hà Nội",
            email: 'ntle@gmail.com',
            group: customerGroup[0]._id,
            birth: '7/9/1993',
            gender: 'Nam',
            loyal: true,
            company: vnist._id
        }, {
            name: 'Nguyễn Việt Anh',
            code: 'HN1995',
            phone: '0396113259',
            address: '110 Lê Đại Hành',
            location: "Hà Nội",
            email: 'nvanh@gmail.com',
            group: customerGroup[2]._id,
            birth: '2/10/1992',
            gender: 'Nam',
            loyal: true,
            company: vnist._id
        }, {
            name: 'Nguyễn Thị Hà',
            code: 'HN1998',
            phone: '0396112548',
            address: '123 Khâm Thiên, Đống Đa',
            location: "Hà Nội",
            email: 'ntha@gmail.com',
            group: customerGroup[0]._id,
            birth: '2/7/2000',
            gender: 'Nữ',
            loyal: true,
            company: vnist._id
        }
    ];
    const customers = await CrmCustomer.insertMany(customerData);

    const customerLiabilities = await CrmLiability.insertMany([
        {
            code: 'PT0001',
            customer: customers[0]._id,
            creator: users[2]._id,
            description: 'Công nợ khách hàng 6/2020',
            total: 1200000,
            company: vnist._id
        }, {
            code: 'PT0002',
            customer: customers[0]._id,
            creator: users[2]._id,
            description: 'Công nợ khách hàng 7/2020',
            total: 530000,
            company: vnist._id
        }, {
            code: 'PT0003',
            customer: customers[0]._id,
            creator: users[2]._id,
            description: 'Công nợ khách hàng 8/2020',
            total: 210000,
            company: vnist._id
        }, {
            code: 'PT0004',
            customer: customers[0]._id,
            creator: users[4]._id,
            description: 'Công nợ khách hàng 9/2020',
            total: 880000,
            company: vnist._id
        },
    ])
    const ltphuong = await CrmCustomer.findById(customers[0]._id);
    ltphuong.liabilities = customerLiabilities.map(lia => lia._id);
    console.log("Xong! Đã tạo mẫu dữ liệu khách hàng")
}



//Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
sampleCompanyData()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });