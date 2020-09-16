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

    RootRole,
    SystemLink,
    SystemComponent,

    Employee,
    Salary,
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
     * 1. Tạo kết nối đến csdl của hệ thống và công ty penguin
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
    
    const penguinDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/penguin`,
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
    if(!systemDB) throw('DB penguin cannot connect');
    console.log("DB penguin connected");
    
    /**
     * 1.1 Khởi tạo model cho db
     */
    const initModels = (db) => {
        console.log("models", db.models);
        if(!db.models.User) User(db);
        if(!db.models.Role) Role(db);
        if(!db.models.UserRole) UserRole(db);
        if(!db.models.Link) Link(db);
        if(!db.models.Component) Component(db);
        if(!db.models.OrganizationalUnit) OrganizationalUnit(db);
        if(!db.models.RootRole) RootRole(db);
        console.log("models_list", db.models);
    }
    
    initModels(penguinDB);
    initModels(systemDB);


	/**
	 * 2. Xóa dữ liệu db cũ của công ty penguin
	 */
    penguinDB.dropDatabase(); 



    /**
     * 3. Khởi tạo dữ liệu về công ty penguin trong database của hệ thống
     */
    const penguin = await Company(systemDB).create({
        name: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
        shortName: 'penguin',
        description: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam'
    });
    console.log(`Xong! Công ty [${penguin.name}] đã được tạo.`);


    /**
     * 4. Tạo các tài khoản người dùng trong csdl của công ty penguin
     */
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User(penguinDB).insertMany([{
        name: 'Super Admin penguin',
        email: 'super.admin.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Admin penguin',
        email: 'admin.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Nguyễn Văn An',
        email: 'nva.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Trần Văn Bình',
        email: 'tvb.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Vũ Thị Cúc',
        email: 'vtc.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Nguyễn Văn Danh',
        email: 'nvd.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Trần Thị Én',
        email: 'tte.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Phạm Đình Phúc',
        email: 'pdp.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Trần Minh Đức',
        email: 'tmd.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Nguyễn Việt Anh',
        email: 'nguyenvietanh.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Nguyễn Viết Thái',
        email: 'nguyenvietthai.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Trần Mỹ Hạnh',
        email: 'tranmyhanh.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Nguyễn Minh Thành',
        email: 'nguyenminhthanh.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Nguyễn Gia Huy',
        email: 'nguyengiahuy.penguin@gmail.com',
        password: hash,
        company: penguin._id
    },{
        name: 'Trần Minh Anh',
        email: 'tranminhanh.penguin@gmail.com',
        password: hash,
        company: penguin._id
    }]);
    console.log("Dữ liệu tài khoản người dùng cho công ty penguin", users);


    /**
     * 5. Tạo các role mặc định cho công ty penguin
     */
    await RoleType(penguinDB).insertMany([
        { name: Terms.ROLE_TYPES.ROOT }, 
        { name: Terms.ROLE_TYPES.POSITION },
        { name: Terms.ROLE_TYPES.COMPANY_DEFINED }
    ]);
    const roleAbstract = await RoleType(penguinDB).findOne({
        name: Terms.ROLE_TYPES.ROOT
    });
    const roleChucDanh = await RoleType(penguinDB).findOne({
        name: Terms.ROLE_TYPES.POSITION
    });
    const roleTuDinhNghia = await RoleType(penguinDB).findOne({
        name: Terms.ROLE_TYPES.COMPANY_DEFINED
    });
    const roleAdmin = await Role(penguinDB).create({
        name: Terms.ROOT_ROLES.ADMIN.name,
        type: roleAbstract._id,
    });
    const roleSuperAdmin = await Role(penguinDB).create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
        type: roleAbstract._id,
        parents: [roleAdmin._id]
    });
    const roleDean = await Role(penguinDB).create({
        name: Terms.ROOT_ROLES.DEAN.name,
        type: roleAbstract._id,
    });
    const roleViceDean = await Role(penguinDB).create({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
        type: roleAbstract._id,
    });
    const roleEmployee = await Role(penguinDB).create({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
        type: roleAbstract._id,
    });

    const thanhVienBGĐ = await Role(penguinDB).create({
        parents: [roleEmployee._id],
        name: "Thành viên ban giám đốc",
        type: roleChucDanh._id
    });
    const phoGiamDoc = await Role(penguinDB).create({
        parents: [roleViceDean._id, thanhVienBGĐ._id],
        name: "Phó giám đốc",
        type: roleChucDanh._id
    });
    const giamDoc = await Role(penguinDB).create({
        parents: [roleDean._id, thanhVienBGĐ._id, phoGiamDoc._id],
        name: "Giám đốc",
        type: roleChucDanh._id
    });
    const nvPhongHC = await Role(penguinDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kinh doanh",
        type: roleChucDanh._id
    });
    const phoPhongHC = await Role(penguinDB).create({
        parents: [roleViceDean._id, nvPhongHC._id],
        name: "Phó phòng kinh doanh",
        type: roleChucDanh._id
    });
    const truongPhongHC = await Role(penguinDB).create({
        parents: [roleDean._id, nvPhongHC._id, phoPhongHC._id],
        name: "Trưởng phòng kinh doanh",
        type: roleChucDanh._id
    });
    console.log("Dữ liệu các phân quyền cho công ty penguin");


    /**
     * 6. Gán phân quyền cho các vị trí trong công ty
     */
    await UserRole(penguinDB).insertMany([{ // Gán tài khoản super.admin.penguin có role là Super Admin của công ty penguin
        userId: users[0]._id,
        roleId: roleSuperAdmin._id
    },{
        userId: users[1]._id, // Gán tài khoản admin.penguin có role là admin
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
     * 7. Tạo dữ liệu các phòng ban cho công ty penguin
     */
    const Directorate = await OrganizationalUnit(penguinDB).create({ // Khởi tạo ban giám đốc công ty
        name: "Ban giám đốc",
        description: "Ban giám đốc Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [giamDoc._id],
        viceDeans: [phoGiamDoc._id],
        employees: [thanhVienBGĐ._id],
        parent: null
    });
    const departments = await OrganizationalUnit(penguinDB).insertMany([{
        name: "Phòng kinh doanh",
        description: "Phòng kinh doanh Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongHC._id],
        viceDeans: [phoPhongHC._id],
        employees: [nvPhongHC._id],
        parent: Directorate._id
    },]);
    console.log("Đã tạo dữ liệu phòng ban: ", Directorate, departments);

    /**
     * 8. Tạo link cho các trang web của công ty penguin
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
                path: 'roles'
            });
        let activeLinks = await SystemLink(systemDB).find({ _id: { $in: linkArr } })
            .populate({
                path: 'roles'
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

        let links = await Link(penguinDB).insertMany(dataLinks);

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
        await Privilege(penguinDB).insertMany(dataPrivilege);

        return await Link(penguinDB).find()
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
            .populate({ path: 'roles' });

        for (let i = 0; i < systemComponents.length; i++) {
            let sysLinks = await SystemLink(systemDB)
            .find({ _id: { $in: systemComponents[i].links }});
            let links = await Link(penguinDB).find({
                url: sysLinks.map(link => link.url)
            });
            // Tạo component
            let component = await Component(penguinDB).create({
                name: systemComponents[i].name,
                description: systemComponents[i].description,
                links: links.map(link => link._id),
                deleteSoft: false
            })
            for (let j = 0; j < links.length; j++) {
                let updateLink = await Link(penguinDB).findById(links[j]._id);
                updateLink.components.push(component._id);
                await updateLink.save();
            }
            // Tạo phân quyền cho components
            let roles = await Role(penguinDB).find({
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
            await Privilege(penguinDB).insertMany(dataPrivileges);
        }

        return await Component(penguinDB).find();
    }
    let linkArrData = await SystemLink(systemDB).find();
    let linkArr = linkArrData.map(link => link._id);
    let roleArr = [roleSuperAdmin, roleAdmin, roleDean, roleViceDean, roleEmployee];
    await createCompanyLinks(linkArr, roleArr);
    await createCompanyComponents(linkArr);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    await Employee(penguinDB).insertMany([{
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Vũ Thị Cúc",
        employeeNumber: "MS2015122",
        status: "active",
        company: penguin._id,
        employeeTimesheetId: "123456",
        gender: "female",
        birthdate: new Date("1998-02-17"),
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: new Date("2015-10-20"),
        identityCardAddress: "Nam Định",
        emailInCompany: "vtc.penguin@gmail.com",
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
            company: "penguin",
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
            company: "penguin",
            position: "Nhân viên"
        }],
        contractType: 'Phụ thuộc',
        contractEndDate: new Date("2020-10-25"),
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
        company: penguin._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: new Date("1998-02-17"),
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: new Date("2015-10-20"),
        identityCardAddress: "Nam Định",
        emailInCompany: "tvb.penguin@gmail.com",
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
            company: "penguin",
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
            company: "penguin",
            position: "Nhân viên"
        }],
        contractType: 'Phụ thuộc',
        contractEndDate: new Date("2020-10-25"),
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
    var employee = await Employee(penguinDB).create({
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Nguyễn Văn An",
        employeeNumber: "MS2015123",
        status: "active",
        company: penguin._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: new Date("1988-05-20"),
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: new Date("2015-10-20"),
        identityCardAddress: "Nam Định",
        emailInCompany: "nva.penguin@gmail.com",
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
            company: "penguin",
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
            company: "penguin",
            position: "Nhân viên"
        }],
        contractType: 'Phụ thuộc',
        contractEndDate: new Date("2020-10-25"),
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
    await AnnualLeave(penguinDB).insertMany([{
        employee: employee._id,
        company: penguin._id,
        organizationalUnit: Directorate._id,
        startDate: "2020-02-06",
        endDate: "2020-02-08",
        status: "pass",
        reason: "Về quê",
    }, {
        employee: employee._id,
        company: penguin._id,
        organizationalUnit: Directorate._id,
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
    await Salary(penguinDB).insertMany([{
        employee: employee._id,
        company: penguin._id,
        month: "2020-02",
        organizationalUnit: Directorate._id,
        mainSalary: "10000000",
        unit: 'VND',
        bonus: [{
            nameBonus: "Thưởng dự án",
            number: "1000000"
        }],
    }, {
        employee: employee._id,
        company: penguin._id,
        organizationalUnit: Directorate._id,
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
    await Commendation(penguinDB).insertMany([{
        employee: employee._id,
        company: penguin._id,
        decisionNumber: "123",
        organizationalUnit: departments[0]._id,
        startDate: "2020-02-02",
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
    },
    {
        employee: employee._id,
        company: penguin._id,
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
    await Discipline(penguinDB).insertMany([{
        employee: employee._id,
        company: penguin._id,
        decisionNumber: "1456",
        organizationalUnit: departments[0]._id,
        startDate: "2020-02-07",
        endDate: "2020-02-09",
        type: "Phạt tiền",
        reason: "Không làm đủ công",
    }, {
        employee: employee._id,
        company: penguin._id,
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
    var educationProgram = await EducationProgram(penguinDB).insertMany([{
        company: penguin._id,
        applyForOrganizationalUnits: [
            departments[0]._id
        ],
        applyForPositions: [
            nvPhongHC._id
        ],
        name: "An toan lao dong",
        programId: "M123",
    }, {
        company: penguin._id,
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
    await Course(penguinDB).insertMany([{
        company: penguin._id,
        name: "An toàn lao động 1",
        courseId: "LD1233",
        offeredBy: "penguins",
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
        company: penguin._id,
        name: "An toàn lao động 2",
        courseId: "LD123",
        offeredBy: "penguins",
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


    
    /**
     * Ngắt kết nối db
     */
    systemDB.close();
    penguinDB.close();

    console.log("End init sample company database!");
}

initSampleCompanyDB().catch(err=>{
    console.log(err);
    process.exit(0);
})