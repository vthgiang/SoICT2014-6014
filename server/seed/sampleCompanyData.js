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

    //asset
    Asset,
    AssetType,
    AssetCrash,
    RecommendProcure,
    RecommendDistribute,
    RepairUpgrade,
    DistributeTransfer,

    DocumentDomain,
    DocumentCategory
} = require('../models').schema;

const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


require('dotenv').config({
    path: '../.env'
});

// DB CONFIG
const db = process.env.DATABASE;

// KẾT NỐI TỚI CSDL MONGODB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
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
    







    // Step 2: TẠO CÁC TÀI KHOẢN NGƯỜI DÙNG CHO CÔNG TY VNIST

    console.log(`Khởi tạo các tài khoản cho công ty [${vnist.name}]`);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User.insertMany([
        {
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

    await UserRole.insertMany([{ //gán tài khoản super.admin.vnist có role là Super Admin của công ty VNIST
            userId: users[0]._id,
            roleId: roleSuperAdmin._id
        }, {
            userId: users[1]._id, //gán tài khoản admin.vnist có role là admin
            roleId: roleAdmin._id
        },
        // Tiếp tục gán chức danh vai trò của phòng ban cho nhân viên:
        { //Giám đốc Nguyễn Văn An
            userId: users[2]._id,
            roleId: giamDoc._id
        },
        { //Phó giám đốc Trần Văn Bình
            userId: users[3]._id,
            roleId: phoGiamDoc._id
        },
        { //Thành viên ban giám đốc Vũ Thị Cúc
            userId: users[4]._id,
            roleId: thanhVienBGĐ._id
        },
        { //Trưởng phòng kinh doanh Nguyễn Văn Danh
            userId: users[5]._id,
            roleId: truongPhongHC._id
        },
        { //Nguyễn Văn Danh cũng là thành viên ban giám đốc
            userId: users[5]._id,
            roleId: thanhVienBGĐ._id
        },
        { //Phó phòng kinh doanh Trần Thị Én
            userId: users[6]._id,
            roleId: phoPhongHC._id
        },
        { //Nhân viên phòng kinh doanh Phạm Đình Phúc
            userId: users[7]._id,
            roleId: nvPhongHC._id
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
    }, ]);
    console.log('Xong! Đã tạo các phòng ban cho công ty', Directorate, departments);









    // Step 6: TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY 

    console.log("Tạo link cho các trang web của công ty...");
    let links = Terms.LINKS;
    for (let i=0; i<links.length; ++i){
        links[i].company = vnist._id;
    }
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

    let componentLinkMap = {};

    for (let i=0; i<links.length; ++i) {
        let components = links[i].components;
        if (components && components.length>0) { // Tạo các components
            components = components.map(component => { // Liên kết với role
                component.roles = component.roles.map(role => convertRoleNameToRoleId(role));
                component.company = vnist._id;
                return component;
            })

            let mongodbComponents = await Component.insertMany(components);
            components = mongodbComponents.map(component => component._id);
            links[i].components = components;

            // Phân quyền cho component trong Privilege
            let privileges_component = [];
            mongodbComponents.forEach(mongodbComponent => {
                if (mongodbComponent.roles) {
                    mongodbComponent.roles.forEach(role => {
                        privileges_component.push({
                            resourceId: mongodbComponent._id,
                            resourceType: 'Component',
                            roleId: role._id
                        })
                    });
                }
                componentLinkMap[mongodbComponent._id] = i;
            });
            await Privilege.insertMany(privileges_component);
        }

        let roles = links[i].roles;
        if (roles){
            links[i].roles = roles.map(role => convertRoleNameToRoleId(role));
        }
    }

    const mongodbLinks = await Link.insertMany(links); // Tạo các links
    
    for (let id in componentLinkMap) { // Thêm liên kết tới link trong bảng component
        let component = await Component.findById(id);
        component.link = mongodbLinks[componentLinkMap[id]]._id;
        await component.save();
    }





    
    // Step 7: Phân quyền cho các trang
    let privileges_links = [];
    mongodbLinks.forEach(mongodbSystemLink => {
        if (mongodbSystemLink.roles) {
            mongodbSystemLink.roles.forEach(role => {
                privileges_links.push({
                    resourceId: mongodbSystemLink._id,
                    resourceType: 'Link',
                    roleId: role._id
                })
            });
        }
    });
    let privileges = await Privilege.insertMany(privileges_links);
    console.log("Gán quyền cho các role: ", privileges);

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
    }])
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
        cost:{
            number:"1200000",
            unit:'VND'
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
        cost:{
            number:"1200000",
            unit:'VND'
        },
        lecturer: "Nguyễn Văn B",
        type: "internal",
        educationProgram: educationProgram[1]._id,
        employeeCommitmentTime: "6",
    }])
    console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);


    const domains = await DocumentDomain.insertMany([ 
        {
            name: "Tài liệu lữu trữ bắt buộc",
            company: vnist,
            description: 'Tài liệu lữu trữ bắt buộc'
        },{
            name: "Hồ sơ lữu trữ bắt buộc",
            company: vnist,
            description: 'Hồ sơ lữu trữ bắt buộc'
        },
    ]);

    const domanins2 = await DocumentDomain.insertMany([
        //tài liệu bắt buộc
        {
            name: "Điều lệ công ty",
            company: vnist,
            description: 'Điều lệ công ty',
            parent: domains[0]._id
        },{
            name: "Quy chế quản lý nội bộ công ty",
            company: vnist,
            description: 'Quy chế quản lý nội bộ công ty',
            parent: domains[0]._id
        },{
            name: "Sổ đăng ký thành viên hoặc sổ đăng ký cổ đông",
            company: vnist,
            description: 'Sổ đăng ký thành viên hoặc sổ đăng ký cổ đông',
            parent: domains[0]._id
        },{
            name: "Văn bằng bảo hộ quyền sở hữu công nghiệp",
            company: vnist,
            description: 'Văn bằng bảo hộ quyền sở hữu công nghiệp',
            parent: domains[0]._id
        },{
            name: "Giấy chứng nhận đăng ký chất lượng sản phẩm",
            company: vnist,
            description: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
            parent: domains[0]._id
        },{
            name: "Giấy phép và giấy chứng nhận khác",
            company: vnist,
            description: 'Giấy phép và giấy chứng nhận khác',
            parent: domains[0]._id
        },{
            name: "Tài liệu, giấy tờ xác nhận quyền sở hữu tài sản của công ty",
            company: vnist,
            description: 'Tài liệu, giấy tờ xác nhận quyền sở hữu tài sản của công ty',
            parent: domains[0]._id
        },{
            name: "Biên bản họp hội đồng thành viên",
            company: vnist,
            description: 'Biên bản họp hội đồng thành viên, đại hội đồng cổ đông, hội đồng quản trị, các quyết định của doanh nghiệp',
            parent: domains[0]._id
        },{
            name: "Bản cáo bạch để phát hành chứng khoán",
            company: vnist,
            description: 'Bản cáo bạch để phát hành chứng khoán',
            parent: domains[0]._id
        },{
            name: "Báo cáo của ban kiểm soát",
            company: vnist,
            description: 'Báo cáo của ban kiểm soát, kết luận của cơ quan thanh tra, kết luận của tổ chức kiểm toán',
            parent: domains[0]._id
        },{
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
        },{
            name: "Hồ sơ về các hoạt động giáo dục, đào tạo, huấn luyện kỹ năng",
            company: vnist,
            description: 'Hồ sơ về các hoạt động giáo dục, đào tạo, huấn luyện kỹ năng',
            parent: domains[1]._id
        },{
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
        },{
            name: "Hồ sơ tài liệu quản lý chất lượng ISO 9001",
            company: vnist,
            description: 'Hồ sơ tài liệu quản lý chất lượng ISO 9001',
            parent: domains[1]._id
        },{
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

    const categories = await DocumentCategory.insertMany([
        {
            company: vnist._id,
            name: "Văn bản",
            description: 'Văn bản'
        },{
            company: vnist._id,
            name: "Biểu mẫu",
            description: 'Biểu mẫu'
        },{
            company: vnist._id,
            name: "Công văn",
            description: 'Công văn'
        },{
            company: vnist._id,
            name: "Tài liệu",
            description: 'Tài liệu'
        },{
            company: vnist._id,
            name: "Hồ sơ",
            description: 'Hồ sơ'
        },{
            company: vnist._id,
            name: "Biên bản",
            description: 'Biên bản'
        },
    ]);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU lOẠI TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu loại tài sản");
    var listAssetType = await AssetType.insertMany([
        {
            company: vnist._id,
            typeNumber: "10",
            typeName: "Tài sản hữu hình",
            timeDepreciation: null,
            parent: null,
            description: "Tài sản hữu hình"
        },{
            company: vnist._id,
            typeNumber: "101",
            typeName: "Nhà cửa, vật kiến trúc",
            timeDepreciation: 12,
            parent: null,
            description: "Nhà cửa, vật kiến trúc"
        },{
            company: vnist._id,
            typeNumber: "10101",
            typeName: "Tòa nhà làm việc",
            timeDepreciation: 12,
            parent: null,
            description: "Tòa nhà làm việc"
        },{
            company: vnist._id,
            typeNumber: "10102",
            typeName: "Nhà xưởng",
            timeDepreciation: 12,
            parent: null,
            description: "Nhà xưởng"
        },{
            company: vnist._id,
            typeNumber: "10103",
            typeName: "Nhà kho",
            timeDepreciation: 12,
            parent: null,
            description: "Nhà kho"
        },{
            company: vnist._id,
            typeNumber: "102",
            typeName: "Máy móc, thiết bị",
            timeDepreciation: 12,
            parent: null,
            description: "Máy móc, thiết bị"
        },{
            company: vnist._id,
            typeNumber: "10201",
            typeName: "Thiết bị phát điện, máy biến áp và nguồn điện khác",
            timeDepreciation: 10,
            parent: null,
            description: "Thiết bị phát điện, máy biến áp và nguồn điện khác "
        },{
            company: vnist._id,
            typeNumber: "10202",
            typeName: "Thiết bị an ninh",
            timeDepreciation: 10,
            parent: null,
            description: "Thiết bị an ninh"
        },{
            company: vnist._id,
            typeNumber: "103",
            typeName: "Phương tiện vận tải, truyền dẫn",
            timeDepreciation: 10,
            parent: null,
            description: "Phương tiện vận tải, truyền dẫn"
        },{
            company: vnist._id,
            typeNumber: "10301",
            typeName: "Ô tô",
            timeDepreciation: 14,
            parent: null,
            description: "Ô tô"
        },{
            company: vnist._id,
            typeNumber: "10302",
            typeName: "Xe máy",
            timeDepreciation: null,
            parent: null,
            description: "Xe máy"
        },{
            company: vnist._id,
            typeNumber: "10303",
            typeName: "Thang máy",
            timeDepreciation: 14,
            parent: null,
            description: "Thang máy"
        },{
            company: vnist._id,
            typeNumber: "10304",
            typeName: "Tổng đài điện thoại",
            timeDepreciation: 24,
            parent: null,
            description: "Tổng đài điện thoại"
        },{
            company: vnist._id,
            typeNumber: "104",
            typeName: "Thiết bị, dụng cụ quản lý",
            timeDepreciation: 24,
            parent: null,
            description: "Thiết bị, dụng cụ quản lý"
        },{
            company: vnist._id,
            typeNumber: "10401",
            typeName: "Máy chủ",
            timeDepreciation: 20,
            parent: null,
            description: "Máy chủ"
        },{
            company: vnist._id,
            typeNumber: "10402",
            typeName: "Máy tính để bàn",
            timeDepreciation: 20,
            parent: null,
            description: "Máy tính để bàn"
        },{
            company: vnist._id,
            typeNumber: "10403",
            typeName: "Máy tính xách tay",
            timeDepreciation: 10,
            parent: null,
            description: "Máy tính xách tay"
        },{
            company: vnist._id,
            typeNumber: "10404",
            typeName: "Máy in",
            timeDepreciation: 8,
            parent: null,
            description: "Máy in"
        },
    ])
        console.log(`Xong! Thông tin loại tài sản đã được tạo`);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU PHIẾU ĐỀ NGHỊ MUA SẮM THIẾT BỊ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu phiếu đề nghị mua sắm thiết bị");
    var listRecommendProcure = await RecommendProcure.insertMany([
        {
            company: vnist._id,
            recommendNumber: "MS0001",
            dateCreate: "20-02-2020",
            proponent: users[7]._id,
            equipment: "đề nghị mua Laptop DELL 5559",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "60000000",
            note: "",
            approver: null,
            status: "Chờ phê duyệt"
        },{
            company: vnist._id,
            recommendNumber: "MS0002",
            dateCreate: "20-03-2020",
            proponent: users[5]._id,
            equipment: "đề nghị mua Laptop DELL XPS",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "70000000",
            note: "",
            approver: users[1]._id,
            status: "Đã chấp nhận"
        },{
            company: vnist._id,
            recommendNumber: "MS0003",
            dateCreate: "20-04-2020",
            proponent: users[6]._id,
            equipment: "đề nghị mua máy photocopy",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "50000000",
            note: "",
            approver: users[1]._id,
            status: "Không chấp nhận"
        },{
            company: vnist._id,
            recommendNumber: "MS0004",
            dateCreate: "20-05-2020",
            proponent: users[7]._id,
            equipment: "đề nghị mua PC",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "40000000",
            note: "",
            approver: null,
            status: "Chờ phê duyệt"
        }
    ])
        console.log(`Xong! Thông tin phiếu đề nghị mua sắm thiết bị đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu tài sản");    
    var listAsset = await Asset.insertMany([{
        avatar: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg",
        assetName: "Laptop Dell 5559",
        code: "TS0001",
        company:vnist._id,
        serial: "123456789",
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        warrantyExpirationDate: "20-02-2022",
        manager: users[1]._id,
        person: users[4]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "20-03-2020",
        location: "P104",
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "500GB",
        }],
        cost: 50000000,
        residualValue: 10000000,
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDepreciation: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [{
            nameFile: "Tài liệu hướng dẫn",
            discFile: "Tài liệu hướng dẫn sử dụng kèm theo 1",
            number: "1",
            urlFile: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg"
        }],
    }, {
        avatar: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg",
        assetName: "Laptop Dell XPS",
        code: "TS0002",
        company:vnist._id,
        serial: "123456789",
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        warrantyExpirationDate: "20-02-2022",
        manager: users[1]._id,
        person: users[5]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "20-04-2020",
        location: "P105",
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "256GB",
        }],
        cost: 60000000,
        residualValue: 15000000,
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDepreciation: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [{
            nameFile: "Tài liệu hướng dẫn",
            discFile: "Tài liệu hướng dẫn sử dụng kèm theo 2",
            number: "1",
            urlFile: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg"
        }],
    },{
        avatar: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg",
        assetName: "Laptop Lenovo",
        code: "TS0003",
        company:vnist._id,
        serial: "987654321",
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        warrantyExpirationDate: "20-02-2022",
        manager: users[1]._id,
        person: users[6]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "20-04-2020",
        location: "P104",
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "240GB",
        }],
        cost: 60000000,
        residualValue: 15000000,
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDepreciation: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [{
            nameFile: "Tài liệu hướng dẫn",
            discFile: "Tài liệu hướng dẫn sử dụng kèm theo 3",
            number: "1",
            urlFile: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg"
        }],
    },{
        avatar: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg",
        assetName: "Laptop HP",
        code: "TS0004",
        company:vnist._id,
        serial: "111111111",
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        warrantyExpirationDate: "20-02-2022",
        manager: users[1]._id,
        person: users[4]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "20-04-2020",
        location: "P104",
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "120GB",
        }],
        cost: 60000000,
        residualValue: 15000000,
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDepreciation: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [{
            nameFile: "Tài liệu hướng dẫn",
            discFile: "Tài liệu hướng dẫn sử dụng kèm theo 4",
            number: "1",
            urlFile: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg"
        }],
    }])
    console.log("Khởi tạo dữ liệu tài sản!");
    var asset = await Asset.create({
        avatar: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg",
        assetName: "Laptop Dell XPS",
        code: "TS0005",
        company:vnist._id,
        serial: "111111111",
        assetType: listAssetType[16]._id,
        datePurchase: "25-02-2020",
        warrantyExpirationDate: "20-02-2022",
        manager: users[1]._id,
        person: users[4]._id,
        dateStartUse: "20-03-2020",
        dateEndUse: "20-04-2020",
        location: "P105",
        status: "Đang sử dụng",
        description: "Macbook Pro",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "256GB",
        }],
        cost: 60000000,
        residualValue: 15000000,
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDepreciation: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [{
            nameFile: "Tài liệu hướng dẫn",
            discFile: "Tài liệu hướng dẫn sử dụng kèm theo 5",
            number: "1",
            urlFile: "http://res.cloudinary.com/moto-com/image/upload/v1590394753/ws90ppssxv3dzox7kdxn.jpg"
        }],
    });
    console.log(`Xong! Thông tin tài sản đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU SỬA CHỮA, THAY THẾ, NÂNG CẤP
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu sửa chữa, thay thế, nâng cấp!");
    var repairupgrade = await RepairUpgrade.insertMany([{
        asset: asset._id,
        company:vnist._id,
        repairNumber: "SC0001",
        type: "Sửa chữa",
        dateCreate: "20-02-2020",
        reason: "Sửa chữa hỏng hóc thiết bị",
        repairDate: "20-02-2020",
        completeDate: "22-02-2020",
        cost: "10000000",
        status: "Đang thực hiện"
    }, {
        asset: asset._id,
        company:vnist._id,
        repairNumber: "SC0002",
        type: "Thay thế",
        dateCreate: "20-02-2020",
        reason: "Thay thế thiết bị",
        repairDate: "20-02-2020",
        completeDate: "22-02-2020",
        cost: "10000000",
        status: "Đã thực hiện"
    },{
        asset: asset._id,
        company:vnist._id,
        repairNumber: "SC0003",
        type: "Nâng cấp",
        dateCreate: "20-02-2020",
        reason: "Nâng cấp thiết bị",
        repairDate: "20-02-2020",
        completeDate: "22-02-2020",
        cost: "10000000",
        status: "Chưa thực hiện"
    }])
    console.log(`Xong! Thông tin sửa chữa - thay thế - nâng cấp đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CẤP PHÁT - ĐIỀU CHUYỂN - THAY THẾ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu cấp phát - điều chuyển - thay thế!");
    var distributetransfer = await DistributeTransfer.insertMany([{
        asset: asset._id,
        company:vnist._id,
        distributeNumber: "CP0001",
        type: "Cấp phát",
        dateCreate: "20-02-2020",
        place: "Phòng 104",
        manager : users[1]._id,
        handoverMan : users[2]._id,
        receiver : users[7]._id,
        nowLocation : "P104",
        nextLocation : "P105",
        dateStartUse : "10-05-2020",
        dateEndUse : "12-05-2020",
        reason: "Cấp phát thiết bị",
    },{
        asset: asset._id,
        company:vnist._id,
        distributeNumber: "DC0001",
        type: "Điều chuyển",
        dateCreate: "01-04-2020",
        place: "Phòng 103",
        manager : users[1]._id,
        handoverMan : users[2]._id,
        receiver : users[7]._id,
        nowLocation : "P104",
        nextLocation : "P103",
        dateStartUse : "10-05-2020",
        dateEndUse : "12-05-2020",
        reason: "Điều chuyển thiết bị",
    }
    ])
    console.log(`Xong! Thông tin cấp phát - điều chuyển - thu hồi đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU SỰ CỐ TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu sự cố tài sản!");
    var assetcrash = await AssetCrash.insertMany([{
        asset: asset._id,
        company:vnist._id,
        type: "Hỏng hóc", //phân loại
        annunciator: users[4]._id, //người báo cáo
        reportDate: "20-02-2020", // ngày báo cáo
        detectionDate: "20-02-2020", // ngày phát hiện
        reason: "Hỏng hóc thiết bị",
    },
    {
        asset: asset._id,
        company:vnist._id,
        type: "Mất", //phân loại
        annunciator: users[4]._id, // người báo cáo
        reportDate: "20-02-2020", // ngày báo cáo
        detectionDate: "20-02-2020", // ngày phát hiện
        reason: "Mất thiết bị",
    }])
    console.log(`Xong! Thông tin sự cố tài sản đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU ĐỀ NGHỊ CẤP PHÁT SỬ DỤNG
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu đăng ký cấp phát-sử dụng thiết bị!");
    var recommmenddistribute = await RecommendDistribute.insertMany([{
        asset: asset._id,
        company:vnist._id,
        recommendNumber: "CP0001",
        dateCreate: "20-02-2020",
        proponent: users[4]._id,
        reqContent: "Đề nghị cấp phát sử dụng laptop dell xps",
        dateStartUse: "11-05-2020",
        dateEndUse: "11-06-2020",
        approver : null,
        note : "",
        status : "Chờ phê duyệt",
    }])
    console.log(`Xong! Thông tin đăng ký cấp phát sử dụng đã được tạo`);
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