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
        { //0
            company: vnist._id,
            typeNumber: "BA",
            typeName: "Bàn",
            timeDepreciation: null,
            parent: null,
            description: "Các loại bàn"
        }, { //1
            company: vnist._id,
            typeNumber: "BC",
            typeName: "Băng chuyền",
            timeDepreciation: null,
            parent: null,
            description: "Các loại băng chuyền"
        }, { //2
            company: vnist._id,
            typeNumber: "BG",
            typeName: "Bảng",
            timeDepreciation: null,
            parent: null,
            description: "Các loại bảng, viết, bảng từ, bảng chỉ dẫn"
        }, { //3
            company: vnist._id,
            typeNumber: "BI",
            typeName: "Bình",
            timeDepreciation: null,
            parent: null,
            description: "Các loại bình chứa: bình nước,..."
        }, { //4
            company: vnist._id,
            typeNumber: "BN",
            typeName: "Bồn",
            timeDepreciation: null,
            parent: null,
            description: "Các loại bồn rửa tay, bồn đựng nước"
        }, { //5
            company: vnist._id,
            typeNumber: "BU",
            typeName: "Bục",
            timeDepreciation: null,
            parent: null,
            description: "Các loại bục để giày dép, để chân, để tượng"
        }, { //6
            company: vnist._id,
            typeNumber: "CA",
            typeName: "Cân",
            timeDepreciation: null,
            parent: null,
            description: "Các loại cân"
        }, { //7
            company: vnist._id,
            typeNumber: "Đèn",
            typeName: "DE",
            timeDepreciation: null,
            parent: null,
            description: "Đèn các loại"
        }, { //8
            company: vnist._id,
            typeNumber: "DH",
            typeName: "Điều hòa",
            timeDepreciation: null,
            parent: null,
            description: "Điều hòa các loại"
        }, { //9
            company: vnist._id,
            typeNumber: "DO",
            typeName: "Đồng hồ",
            timeDepreciation: null,
            parent: null,
            description: "Các loại đồng hồ"
        }, { //10
            company: vnist._id,
            typeNumber: "GH",
            typeName: "Ghế",
            timeDepreciation: null,
            parent: null,
            description: "Ghế các loại"
        }, { //11
            company: vnist._id,
            typeNumber: "GI",
            typeName: "Giá",
            timeDepreciation: null,
            parent: null,
            description: "Giá các chất liệu để tài liệu, trei, vật dụng nhỏ"
        }, { //12
            company: vnist._id,
            typeNumber: "HT",
            typeName: "Hệ thống",
            timeDepreciation: null,
            parent: null,
            description: "Các thiết bị hệ thống"
        }, { //13
            company: vnist._id,
            typeNumber: "KE",
            typeName: "Kệ hòm",
            timeDepreciation: null,
            parent: null,
            description: "Hòm, Kệ các chất liệu để tài liệu, có thể di động, có mặt phẳng"
        }, { //14
            company: vnist._id,
            typeNumber: "QU",
            typeName: "Quạt",
            timeDepreciation: null,
            parent: null,
            description: "Quạt các loại"
        }, { //15
            company: vnist._id,
            typeNumber: "TU",
            typeName: "Tủ đựng tài liệu và chứa các vật phẩm, TB",
            timeDepreciation: null,
            parent: null,
            description: ""
        }, { //16
            company: vnist._id,
            typeNumber: "MV",
            typeName: "Thiết bị máy văn phòng",
            timeDepreciation: null,
            parent: null,
            description: "Tất cả các máy liên quan tới làm việc tại VP, Máy hút bụi, máy giặt, máy hút mùi"
        }, { //17
            company: vnist._id,
            typeNumber: "DX",
            typeName: "Dụng cụ SX",
            timeDepreciation: null,
            parent: null,
            description: "Các vật dụng như thùng các chất liệu để đựng, chứa, pha chế, chia liều cột"
        }, { //18
            company: vnist._id,
            typeNumber: "MK",
            typeName: "Máy cơ khí",
            timeDepreciation: null,
            parent: null,
            description: "Các máy liên quan tới hỗ trọ SX trực tiếp, sửa chữa, xây dựng"
        }, { //19
            company: vnist._id,
            typeNumber: "TM",
            typeName: "Máy vi tính và thiết bị mạng",
            timeDepreciation: null,
            parent: null,
            description: "Máy vi tính các loại + phụ kiện + các thiết bị mạng"
        }, { //20
            company: vnist._id,
            typeNumber: "AA",
            typeName: "Thiết bị âm thanh, hình ảnh",
            timeDepreciation: null,
            parent: null,
            description: "Các thiết bị điện tử riêng biệt liên quan tới âm thanh, hình ảnh"
        }, { //21
            company: vnist._id,
            typeNumber: "NB",
            typeName: "Các vật dụng liên quan tới nhà bếp",
            timeDepreciation: null,
            parent: null,
            description: "Bếp, bình ga, nồi, chảo..."
        }, { //22
            company: vnist._id,
            typeNumber: "PC",
            typeName: "Các thiết bị PCCC",
            timeDepreciation: null,
            parent: null,
            description: ""
        }, { //23
            company: vnist._id,
            typeNumber: "XE",
            typeName: "Xe các loại",
            timeDepreciation: null,
            parent: null,
            description: ""
        }, { //24
            company: vnist._id,
            typeNumber: "KH",
            typeName: "Khác",
            timeDepreciation: null,
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
    var listRecommendProcure = await RecommendProcure.insertMany([
        {
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
        }
    ])
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
        code: "VVTM02.001",
        company: vnist._id,
        serial: "00001",
        assetType: listAssetType[19]._id,
        purchaseDate: new Date("2020-06-20"),
        warrantyExpirationDate: new Date("2022-06-20"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PKD",
        status: "Sẵn sàng sử dụng",
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
        disposalDate: null,
        disposalType: '',
        disposalCost: null,
        disposalDesc: '',
        //tài liệu đính kèm
        archivedRecordNumber: "PKD001",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Điều hòa Panasonic 9.000BTU",
        code: "VVDH01.017",
        company: vnist._id,
        serial: "00002",
        assetType: listAssetType[8]._id,
        purchaseDate: new Date("2020-05-20"),
        warrantyExpirationDate: new Date("2022-05-20"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PKD",
        status: "Sẵn sàng sử dụng",
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
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PKD002",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy tính cây",
        code: "VVMV18.001",
        company: vnist._id,
        serial: "00003",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-25"),
        warrantyExpirationDate: new Date("2022-05-25"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PCN",
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
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy in HP M402D",
        code: "VVMV18.002",
        company: vnist._id,
        serial: "00004",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-26"),
        warrantyExpirationDate: new Date("2022-05-26"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PCN",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy in HP M402D",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 35000000,
        residualValue: 4000000,
        startDepreciation: new Date("2020-05-26"), // thời gian bắt đầu trích khấu hao
        usefulLife: 18, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN004",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy in màu epson L805",
        code: "VVMV13.001",
        company: vnist._id,
        serial: "00005",
        assetType: listAssetType[16]._id,
        purchaseDate: new Date("2020-05-25"),
        warrantyExpirationDate: new Date("2022-05-25"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PCN",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy in màu epson L805",
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
        usefulLife: 18, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN005",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Lap top DELL Vostro 3568",
        code: "VVTM02.004",
        company: vnist._id,
        serial: "00006",
        assetType: listAssetType[19]._id,
        purchaseDate: new Date("2020-05-20"),
        warrantyExpirationDate: new Date("2022-05-20"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PCN",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Lap top DELL Vostro 3568",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 35000000,
        residualValue: 5000000,
        startDepreciation: new Date("2020-05-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 20, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PCN006",
        files: [],
    }, {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy chủ IBM (01 máy chủ + 01 bàn phím + 01 chuột)",
        code: "VVTM04.001",
        company: vnist._id,
        serial: "00007",
        assetType: listAssetType[19]._id,
        purchaseDate: new Date("2020-04-20"),
        warrantyExpirationDate: new Date("2022-04-20"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "PKT",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy chủ IBM (01 máy chủ + 01 bàn phím + 01 chuột)",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 60000000,
        residualValue: 15000000,
        startDepreciation: new Date("2020-04-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 30, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "PKT007",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy bơm áp",
        code: "VVMK02.003",
        company: vnist._id,
        serial: "00008",
        assetType: listAssetType[18]._id,
        purchaseDate: new Date("2020-04-25"),
        warrantyExpirationDate: new Date("2022-04-25"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "VP xưởng",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy bơm áp",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 40000000,
        residualValue: 15000000,
        startDepreciation: new Date("2020-04-25"), // thời gian bắt đầu trích khấu hao
        usefulLife: 15, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "VPX008",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy nén khí công nghiệp 22kw",
        code: "VVMK09.001",
        company: vnist._id,
        serial: "00009",
        assetType: listAssetType[18]._id,
        purchaseDate: new Date("2020-04-30"),
        warrantyExpirationDate: new Date("2022-04-30"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "VP xưởng",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: true,
        description: "Máy nén khí công nghiệp 22kw",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 60000000,
        residualValue: 20000000,
        startDepreciation: new Date("2020-04-30"), // thời gian bắt đầu trích khấu hao
        usefulLife: 30, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "VPX009",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Máy phát điện Misumisi 25kw",
        code: "VVMK10.001",
        company: vnist._id,
        serial: "00009",
        assetType: listAssetType[18]._id,
        purchaseDate: new Date("2020-03-30"),
        warrantyExpirationDate: new Date("2022-03-30"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "VP xưởng",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: false,
        description: "Máy phát điện Misumisi 25kw",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 60000000,
        residualValue: 25000000,
        startDepreciation: new Date("2020-03-30"), // thời gian bắt đầu trích khấu hao
        usefulLife: 30, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "VPX010",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Laptop Dell XPS",
        code: "VVTM02.004",
        company: vnist._id,
        serial: "00010",
        assetType: listAssetType[19]._id,
        purchaseDate: new Date("2020-05-30"),
        warrantyExpirationDate: new Date("2022-05-30"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "VPGĐ",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: false,
        description: "Laptop Dell XPS",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 60000000,
        residualValue: 25000000,
        startDepreciation: new Date("2020-05-30"), // thời gian bắt đầu trích khấu hao
        usefulLife: 30, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "VPX011",
        files: [],
    },
    {
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Hệ thống báo cháy AED Đèn + chuông",
        code: "VVPC04.002",
        company: vnist._id,
        serial: "00011",
        assetType: listAssetType[22]._id,
        purchaseDate: new Date("2020-04-30"),
        warrantyExpirationDate: new Date("2022-04-30"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "Xưởng TN",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: false,
        description: "Hệ thống báo cháy AED Đèn + chuông",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 60000000,
        residualValue: 25000000,
        startDepreciation: new Date("2020-04-30"), // thời gian bắt đầu trích khấu hao
        usefulLife: 25, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "XTN012",
        files: [],
    }


    ])
    console.log("Khởi tạo dữ liệu tài sản!");
    var asset = await Asset.create({
        avatar: "/upload/asset/pictures/picture5.png",
        assetName: "Xe đẩy hàng (0.8m x 0.6m x 0.85m)",
        code: "VVXE01.003",
        company: vnist._id,
        serial: "00012",
        assetType: listAssetType[23]._id,
        purchaseDate: new Date("2020-04-20"),
        warrantyExpirationDate: new Date("2022-04-20"),
        managedBy: users[1]._id,
        assignedTo: null,
        handoverFromDate: null,
        handoverToDate: null,
        location: "Xưởng TN",
        status: "Sẵn sàng sử dụng",
        canRegisterForUse: false,
        description: "Xe đẩy hàng (0.8m x 0.6m x 0.85m)",
        detailInfo: [],

        usageLogs: [],
        // bảo trì thiết bị
        maintainanceLogs: [],
        //sự cố
        incidentLogs: [],
        //khấu hao
        cost: 60000000,
        residualValue: 25000000,
        startDepreciation: new Date("2020-04-20"), // thời gian bắt đầu trích khấu hao
        usefulLife: 26, // thời gian trích khấu hao
        depreciationType: "Đường thẳng", // thời gian trích khấu hao
        //thanh lý
        disposalDate: null,
        disposalType: "",
        disposalCost: null,
        disposalDesc: "",
        //tài liệu đính kèm
        archivedRecordNumber: "XTN013",
        files: [],
    });
    console.log(`Xong! Thông tin tài sản đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU ĐĂNG KÝ SỬ DỤNG TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu đăng ký sử dụng tài sản!");
    var recommmenddistribute = await RecommendDistribute.insertMany([{
        asset: asset._id,
        company: vnist._id,
        recommendNumber: "CP0001",
        dateCreate: "19-05-2020",
        proponent: users[4]._id,
        reqContent: "Đăng ký sử dụng tài sản",
        dateStartUse: "20-05-2020",
        dateEndUse: "20-06-2020",
        approver: null,
        note: "",
        status: "Chờ phê duyệt",
    }])
    console.log(`Xong! Thông tin đăng ký sử dụng tài sản đã được tạo`);
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