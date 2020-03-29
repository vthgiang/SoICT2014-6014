const Component = require('../models/component.model');
const RoleType = require('../models/role_type.model');
const Role = require('../models/role.model');
const Company = require('../models/company.model');
const Department = require('../models/department.model')
const Link = require('../models/link.model');
const Privilege = require('../models/privilege.model');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');
const Employee = require('../models/employee.model');
const EmployeeContact = require('../models/employeeContact.model');
const Salary = require('../models/salary.model');
const Sabbatical = require('../models/sabbatical.model');
const Discipline = require('../models/discipline.model');
const Praise = require('../models/praise.model');
const EducationProgram = require('../models/educationProgram.model');
const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config({
    path: '../.env'
});

// DB CONFIG
const db = process.env.DATABASE;

// kẾT NỐI TỚI CSDL MONGODB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Kết nối thành công đến MongoDB!\n");
}).catch(err => console.log("ERROR! :(\n", err));

const sampleCompanyData = async () => {
    console.log("Đang tạo dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU VỀ CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu công ty!");
    var xyz = await Company.create({
        name: 'Công ty TNHH XYZ',
        short_name: 'xyz',
        description: 'Công ty TNHH XYZ'
    });
    console.log(`Xong! Công ty [${xyz.name}] đã được tạo.`);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC TÀI KHOẢN NGƯỜI DÙNG CHO CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log(`Khởi tạo các tài khoản cho công ty [${xyz.name}]`);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User.insertMany([{
            name: 'Super Admin công ty xyz',
            email: 'super.admin.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Admin công ty xyz',
            email: 'admin.xyz@gmail.com',
            password: hash,
            company: xyz._id
        },{
            name: 'Nguyễn Văn A',
            email: 'nva.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Trần Văn B',
            email: 'tvb.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Vũ Thị C',
            email: 'vtc.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Nguyễn Văn D',
            email: 'nvd.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Trần Thị E',
            email: 'tte.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Phạm Đình F',
            email: 'pdf.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Trần Minh Đức',
            email: 'tmd.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Nguyễn Việt Anh',
            email: 'nguyenvietanh.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Nguyễn Viết Thái',
            email: 'nguyenvietthai.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Trần Mỹ Hạnh',
            email: 'tranmyhanh.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Nguyễn Minh Thành',
            email: 'nguyenminhthanh.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Nguyễn Gia Huy',
            email: 'nguyengiahuy.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }, {
            name: 'Trần Minh Anh',
            email: 'tranminhanh.xyz@gmail.com',
            password: hash,
            company: xyz._id
        }
    ]);
    console.log("Xong! Đã thêm tài khoản:", users);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC ROLE MẶC ĐỊNH CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Lấy role mặc định của công ty...");
    const roleAbstract = await RoleType.findOne({
        name: Terms.ROLE_TYPES.ABSTRACT
    });
    const roleChucDanh = await RoleType.findOne({
        name: Terms.ROLE_TYPES.POSITION
    });

    const admin = await Role.create({
        name: Terms.PREDEFINED_ROLES.ADMIN.NAME,
        company: xyz._id,
        type: roleAbstract._id
    });
    const roles = await Role.insertMany([{
        name: Terms.PREDEFINED_ROLES.SUPER_ADMIN.NAME,
        company: xyz._id,
        type: roleAbstract._id,
        parents: [admin._id]
    },  {
        name: Terms.PREDEFINED_ROLES.DEAN.NAME,
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: Terms.PREDEFINED_ROLES.VICE_DEAN.NAME,
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: Terms.PREDEFINED_ROLES.EMPLOYEE.NAME,
        company: xyz._id,
        type: roleAbstract._id
    }]);

    const troLy = await Role.create({
        parents: [roles[3]._id],
        name: "Trợ lý giám đốc",
        company: xyz._id,
        type: roleChucDanh._id
    });
    const phoGiamDoc = await Role.create({
        parents: [roles[2]._id, troLy._id],
        name: "Phó giám đốc",
        company: xyz._id,
        type: roleChucDanh._id
    });
    const giamDoc = await Role.create({
        parents: [roles[1]._id, troLy._id, phoGiamDoc._id],
        name: "Giám đốc",
        company: xyz._id,
        type: roleChucDanh._id
    });
    const nvPhongHC = await Role.create({
        parents: [roles[3]._id],
        name: "Nhân viên phòng hành chính",
        company: xyz._id,
        type: roleChucDanh._id
    });
    const phoPhongHC = await Role.create({
        parents: [roles[2]._id, nvPhongHC._id],
        name: "Phó phòng hành chính",
        company: xyz._id,
        type: roleChucDanh._id
    });
    const truongPhongHC = await Role.create({
        parents: [roles[1]._id, nvPhongHC._id, phoPhongHC._id],
        name: "Trưởng phòng hành chính",
        company: xyz._id,
        type: roleChucDanh._id
    });

    console.log("Đã tạo xong các role mặc định của công ty: ", admin, roles, troLy, phoGiamDoc, giamDoc, nvPhongHC, phoPhongHC, truongPhongHC);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        GÁN QUYỀN CHO NHÂN VIÊN CỦA CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log('Gán quyền cho nhân viên trong công ty');

    await UserRole.insertMany([{ //gán tài khoản super.admin.xyz có role là Super Admin của công ty xyz
        userId: users[0]._id,
        roleId: roles[0]._id
    }, {
        userId: users[1]._id, //gán tài khoản admin.xyz có role là admin
        roleId: admin._id
    },
    // Tiếp tục gán chức danh vai trò của phòng ban cho nhân viên:
    {//Giám đốc Nguyễn Văn A
        userId: users[2]._id,
        roleId: giamDoc._id
    },
    {//Phó giám đốc Trần Văn B
        userId: users[3]._id,
        roleId: phoGiamDoc._id
    },
    {//Trợ lý giám đốc Vũ Thị C
        userId: users[4]._id,
        roleId: troLy._id
    },
    {//Trưởng phòng hành chính Nguyễn Văn D
        userId: users[5]._id,
        roleId: truongPhongHC._id
    },
    {//Phó phòng hành chính Trần Thị E
        userId: users[6]._id,
        roleId: phoPhongHC._id
    },
    {//Nhân viên phòng hành chính Phạm Đình F
        userId: users[7]._id,
        roleId: nvPhongHC._id
    }
    ]);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO PHÒNG BAN CỦA CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log('Tạo Phòng ban cho công ty...');
    const Directorate = await Department.create({// Khởi tạo ban giám đốc công ty
        name: "Ban giám đốc",
        description: "Ban giám đốc của Công ty TNHH XYZ",
        company:  xyz._id,
        dean: giamDoc._id,
        vice_dean: phoGiamDoc._id,
        employee: troLy._id,
        parent: null
    });
    const departments = await Department.insertMany([
        {
            name: "Phòng hành chính",
            description: "Phòng hành chính của Công ty TNHH XYZ",
            company:  xyz._id,
            dean: truongPhongHC._id,
            vice_dean: phoPhongHC._id,
            employee: nvPhongHC._id,
            parent: Directorate._id
        },
    ]);
    console.log('Xong! Đã tạo các phòng ban cho công ty', Directorate, departments);



    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo link cho các trang web của công ty...");
    const links = await Link.insertMany([
        { // 0
            url: '/',
            description: `Trang chủ công ty ${xyz.name}`,
            company: xyz._id
        }, { // 1
            url: '/departments-management',
            description: 'Quản lý cơ cấu tổ chức',
            company: xyz._id
        }, { // 2
            url: '/users-management',
            description: 'Quản lý người dùng',
            company: xyz._id
        }, { // 3
            url: '/roles-management',
            description: 'Quản lý phân quyền',
            company: xyz._id
        }, { // 4
            url: '/links-management',
            description: 'Quản lý trang web của công ty',
            company: xyz._id
        }, { // 5
            url: '/components-management',
            description: 'Quản lý các thành phần UI trên trang web của công ty',
            company: xyz._id
        }, { // 6
            url: '/documents-management',
            description: 'Quản lý tài liệu biểu mẫu',
            company: xyz._id
        }, { // 7
            url: '/hr-manage-holiday',
            description: 'Kế hoạch làm việc',
            company: xyz._id
        },
        { // 8
            url: '/hr-add-employee',
            description: 'Thêm mới nhân viên',
            company: xyz._id
        },
        { // 9
            url: '/hr-list-employee',
            description: 'Danh sách nhân viên',
            company: xyz._id
        },
        { // 10
            url: '/hr-update-employee',
            description: 'Cập nhật thông tin cá nhân của nhân viên',
            company: xyz._id
        },
        { // 11
            url: '/hr-detail-employee',
            description: 'Thông tin cá nhân của nhân viên',
            company: xyz._id
        },
        { // 12
            url: '/hr-salary-employee',
            description: 'Quản lý lương nhân viên',
            company: xyz._id
        },
        { // 13
            url: '/hr-sabbatical',
            description: 'Quản lý nghỉ phép của nhân viên',
            company: xyz._id
        },
        { // 14
            url: '/hr-discipline',
            description: 'Quản lý khen thưởng, kỷ luật',
            company: xyz._id
        },
        { // 15
            url: '/hr-dashboard-employee',
            description: 'Dashboard nhân sự',
            company: xyz._id
        },
        { // 16
            url: '/hr-time-keeping',
            description: 'Quản lý chấm công',
            company: xyz._id
        },
        { // 17
            url: '/hr-trainning-course',
            description: 'Quản lý đào tạo',
            company: xyz._id
        },
        { // 18
            url: '/hr-account',
            description: 'Thông tin tài khoản ',
            company: xyz._id
        },
        { // 19
            url: '/hr-training-plan',
            description: 'Kế hoạch đào tạo',
            company: xyz._id
        },
        { // 20
            url: '/hr-list-course',
            description: 'Chương trình đào tạo bắt buộc',
            company: xyz._id
        },

        //thêm link của quản lý KPI
        { // 21
            url: '/kpi-units/create',
            description: 'Khởi tạo KPI đơn vị',
            company: xyz._id
        },
        { // 22
            url: '/kpi-units/overview',
            description: 'Tổng quan KPI đơn vị',
            company: xyz._id
        },
        { // 23
            url: '/kpi-personals/create',
            description: 'Khởi tạo KPI cá nhân',
            company: xyz._id
        },
        { // 24
            url: '/kpi-personals/overview',
            description: 'Tổng quan KPI cá nhân',
            company: xyz._id
        },
        { // 25
            url: '/notifications',
            description: 'Thông báo',
            company: xyz._id
        },
        { // 26
            url: '/hr-manage-department',
            description: 'Quản lý nhân sự các đơn vị',
            company: xyz._id
        },
        { // 27
            url: '/task-template',
            description: 'Mẫu công việc',
            company: xyz._id
        },
        { // 28
            url: '/kpi-member/overview',
            description: 'Quản lí kpi nhân viên',
            company: xyz._id
        },
        { // 29
            url: '/task-management',
            description: 'Xem danh sách công việc',
            company: xyz._id
        },
        { // 30
            url: '/task-management-dashboard',
            description: 'Dashboard công việc',
            company: xyz._id
        }
    ]);
    console.log("Xong! Đã tạo links: ", links);

    //Thêm component -------------------------------------------------------
    const components = await Component.insertMany([
        {
            name: 'create-notification',
            description: 'Tạo thông báo mới',
            company: xyz._id
        }
    ]);
    const notificationLink = await Link.findById(links[25]._id);
    await notificationLink.components.push(components[0]._id);
    await notificationLink.save();

    //gán quyền tạo thông báo cho admin, superadmin
    var data = [roles[0]._id, admin._id].map( role => {
        return {
            resourceId: components[0]._id,
            resourceType: 'Component',
            roleId: role
        };
    });
    var privileges_component = await Privilege.insertMany(data);
    console.log("privilege component: ", privileges_component);
    //END

    const privileges = await Privilege.insertMany([
        //gán 7 link trên cho super admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        },
        {
            resourceId: links[25]._id, //notifications
            resourceType: 'Link',
            roleId: roles[0]._id
        },
        //end
        
        //Gán quyền vào các trang cho admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[7]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[8]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[9]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[10]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[11]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[12]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[13]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[14]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[15]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[16]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[17]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[18]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[19]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[20]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[26]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        //end
        //gán quyền vào trang home '/' ,trang thông báo /notifications -> cho role Dean, Vice Dean và Employee
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        }, {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        }, {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        }, {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        }, {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },

        // Gán quyền vào trang kpi cho role Dean, Vice Dean và Employee
        {
            resourceId: links[21]._id, // Khởi tạo KPI đơn vị
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[22]._id, // Tổng quan KPI đơn vị
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[22]._id, // Tổng quan KPI đơn vị
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[22]._id, // Tổng quan KPI đơn vị
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[23]._id, // Khởi tạo KPI cá nhân
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[24]._id, // Tổng quan KPI cá nhân
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },

        // Gán quyền mẫu công việc
        {
            resourceId: links[27]._id, // Mẫu công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[27]._id, // Mẫu công việc
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[27]._id, //M ẫu công việc
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },

        // Gán quyền quản lý KPI nhân viên
        {
            resourceId: links[28]._id, // Quản lý KPI nhân viên
            resourceType: 'Link',
            roleId: roles[1]._id  // Dean
        },
        
        // Gán quyền quản lý công việc
        {
            resourceId: links[29]._id, // Quản lý công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[29]._id, //Quản lý công việc
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[29]._id, // Quản lý công việc
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[30]._id, // Dashboard công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[30]._id, // Dashboard công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Vice Dean
        },
        {
            resourceId: links[30]._id, // Dashboard công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Dean
        }

    ]);
    console.log("Gán quyền cho các role: ", privileges);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    var listEmployee = await Employee.insertMany([{
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Vũ Thị C",
        employeeNumber: "MS2015122",
        company:xyz._id,
        MSCC: "123456",
        gender: "male",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "vtc.xyz@gmail.com",
        numberTax: "12658974",
        userTax: "Nguyễn Văn Hưng",
        startTax: "12-08-2019",
        unitTax: "Chi cục thuế Huyện Hải Hậu",
        ATM: "102298653",
        nameBank: "ViettinBank",
        addressBank: "Hai Bà Trưng",
        numberBHYT: "N1236589",
        startDateBHYT: "09-02-2020",
        endDateBHYT: "16-02-2020",
        numberBHXH: "XH1569874",
        BHXH: [{
            unit: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],
        national: "Kinh",
        religion: "Không",
        relationship: "single",
        cultural: "12/12",
        foreignLanguage: "500 Toeic",
        educational: "Đại học",
        experience: [{
            unit: "Vnist",
            startDate: "06-2019",
            endDate: "02-2020",
            position: "Nhân viên"
        }],
        certificate: [{
            nameCertificate: "Bằng tốt nghiệp",
            addressCertificate: "Đại học Bách Khoá",
            yearCertificate: "2020",
            typeCertificate: "Khá",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            startDate : "28-01-2020",
            endDate : "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [],
    }, {
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Trần Văn B",
        employeeNumber: "MS2015124",
        company:xyz._id,
        MSCC: "123456",
        gender: "male",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "tvb.xyz@gmail.com",
        numberTax: "12658974",
        userTax: "Nguyễn Văn Hưng",
        startTax: "12-08-2019",
        unitTax: "Chi cục thuế Huyện Hải Hậu",
        ATM: "102298653",
        nameBank: "ViettinBank",
        addressBank: "Hai Bà Trưng",
        numberBHYT: "N1236589",
        startDateBHYT: "09-02-2020",
        endDateBHYT: "16-02-2020",
        numberBHXH: "XH1569874",
        BHXH: [{
            unit: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],
        national: "Kinh",
        religion: "Không",
        relationship: "single",
        cultural: "12/12",
        foreignLanguage: "500 Toeic",
        educational: "Đại học",
        experience: [{
            unit: "Vnist",
            startDate: "06-2019",
            endDate: "02-2020",
            position: "Nhân viên"
        }],
        certificate: [{
            nameCertificate: "Bằng tốt nghiệp",
            addressCertificate: "Đại học Bách Khoá",
            yearCertificate: "2020",
            typeCertificate: "Khá",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            startDate : "28-01-2020",
            endDate : "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [],
    }])

    await EmployeeContact.insertMany([{
        employee: listEmployee[0]._id,
        phoneNumber: 962586290,
        emailPersonal: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        emailPersonal2: "hungkaratedo03101998@gmail.com",
        phoneNumberAddress: 978590338,
        friendName: "Nguyễn Văn Thái",
        relation: "Em trai",
        friendPhone: 962586278,
        friendEmail: "cuong@gmail.com",
        friendPhoneAddress: 962586789,
        friendAddress: "Hải Phương - Hải Hậu - Nam Định",
        localAddress: "Hải Phương - Hải Hậu - Nam Định",
        localNational: "Việt Nam",
        localCity: "Nam Định",
        localDistrict: "Hải Hậu",
        localCommune: "Hải Phương",
        nowAddress: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        nowNational: "Việt Nam",
        nowCity: "Hà Nội",
        nowDistrict: "Hai Bà Trưng",
        nowCommune: "Bạch Mai",
    }, {
        employee: listEmployee[1]._id,
        phoneNumber: 962586290,
        emailPersonal: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        emailPersonal2: "hungkaratedo03101998@gmail.com",
        phoneNumberAddress: 978590338,
        friendName: "Nguyễn Văn Thái",
        relation: "Em trai",
        friendPhone: 962586278,
        friendEmail: "cuong@gmail.com",
        friendPhoneAddress: 962586789,
        friendAddress: "Hải Phương - Hải Hậu - Nam Định",
        localAddress: "Hải Phương - Hải Hậu - Nam Định",
        localNational: "Việt Nam",
        localCity: "Nam Định",
        localDistrict: "Hải Hậu",
        localCommune: "Hải Phương",
        nowAddress: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        nowNational: "Việt Nam",
        nowCity: "Hà Nội",
        nowDistrict: "Hai Bà Trưng",
        nowCommune: "Bạch Mai",
    }])
    console.log("Khởi tạo dữ liệu nhân viên!");
    var employee = await Employee.create({
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Nguyễn Văn A",
        employeeNumber: "MS2015123",
        company:xyz._id,
        MSCC: "123456",
        gender: "male",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "nva.xyz@gmail.com",
        numberTax: "12658974",
        userTax: "Nguyễn Văn Hưng",
        startTax: "12-08-2019",
        unitTax: "Chi cục thuế Huyện Hải Hậu",
        ATM: "102298653",
        nameBank: "ViettinBank",
        addressBank: "Hai Bà Trưng",
        numberBHYT: "N1236589",
        startDateBHYT: "09-02-2020",
        endDateBHYT: "16-02-2020",
        numberBHXH: "XH1569874",
        BHXH: [{
            unit: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],
        national: "Kinh",
        religion: "Không",
        relationship: "single",
        cultural: "12/12",
        foreignLanguage: "500 Toeic",
        educational: "Đại học",
        experience: [{
            unit: "Vnist",
            startDate: "06-2019",
            endDate: "02-2020",
            position: "Nhân viên"
        }],
        certificate: [{
            nameCertificate: "Bằng tốt nghiệp",
            addressCertificate: "Đại học Bách Khoá",
            yearCertificate: "2020",
            typeCertificate: "Khá",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            startDate : "28-01-2019",
            endDate : "28-02-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [{
            nameFile : "Ảnh",
            discFile : "Ảnh 3x4",
            number : "1",
            status : "Đã nộp",
            file : "3.5.1.PNG",
            urlFile : "lib/fileEmployee/1582212624054-3.5.1.png"
        }],
    });

    var employeeContact = await EmployeeContact.create({
        employee: employee._id,
        phoneNumber: 962586290,
        emailPersonal: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        emailPersonal2: "hungkaratedo03101998@gmail.com",
        phoneNumberAddress: 978590338,
        friendName: "Nguyễn Văn Thái",
        relation: "Em trai",
        friendPhone: 962586278,
        friendEmail: "cuong@gmail.com",
        friendPhoneAddress: 962586789,
        friendAddress: "Hải Phương - Hải Hậu - Nam Định",
        localAddress: "Hải Phương - Hải Hậu - Nam Định",
        localNational: "Việt Nam",
        localCity: "Nam Định",
        localDistrict: "Hải Hậu",
        localCommune: "Hải Phương",
        nowAddress: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        nowNational: "Việt Nam",
        nowCity: "Hà Nội",
        nowDistrict: "Hai Bà Trưng",
        nowCommune: "Bạch Mai",
    })
    console.log(`Xong! Thông tin nhân viên đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NGHỊ PHÉP
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu nghỉ phép!");
    var sabbatical = await Sabbatical.insertMany([{
        employee: employee._id,
        company:xyz._id,
        startDate: "04-02-2020",
        endDate: "08-02-2020",
        status: "Đã chấp nhận",
        reason: "Về quê",
    }, {
        employee: employee._id,
        company:xyz._id,
        startDate: "05-02-2020",
        endDate: "10-02-2020",
        status: "Chờ phê duyệt",
        reason: "Nghỉ tết"
    }])
    console.log(`Xong! Thông tin nghỉ phép đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu lương nhân viên!");
    var salary = await Salary.insertMany([{
        employee: employee._id,
        company:xyz._id,
        month: "02-2020",
        mainSalary: "10000000VND",
        bonus: [{
            nameBonus: "Thưởng dự án",
            number: "1000000"
        }],
    }, {
        employee: employee._id,
        company:xyz._id,
        month: "01-2020",
        mainSalary: "10000000VND",
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
    var praise = await Praise.insertMany([{
        employee: employee._id,
        company:xyz._id,
        number: "123",
        unit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
    }, {
        employee: employee._id,
        company:xyz._id,
        number: "1234",
        unit: "Phòng kinh doanh",
        startDate: "02-02-2020",
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
    var discipline = await Discipline.insertMany([{
        employee: employee._id,
        company:xyz._id,
        number: "1456",
        unit: "Phòng nhân sự",
        startDate: "02-02-2020",
        endDate: "06-02-2020",
        type: "Phạt tiền",
        reason: "Không làm đủ công",
    }, {
        employee: employee._id,
        company:xyz._id,
        number: "1457",
        unit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        endDate: "06-02-2020",
        type: "Phạt tiền",
        reason: "Không đủ doanh số",
    }])
    console.log(`Xong! Thông tin kỷ luật đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KỶ LUẬT NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu khoá đào tạo bắt buộc!");
    var educationProgram = await EducationProgram.insertMany([{
        company:xyz._id,
        unitEducation: [
            "Phòng Kinh doanh"
        ],
        positionEducation: [
            "Trưởng phòng"
        ],
        nameEducation: "An toan lao dong",
        numberEducation: "M123",
    }, {
        company:xyz._id,
        unitEducation: [
            "Phòng Kinh doanh"
        ],
        positionEducation: [
            "Trưởng phòng"
        ],
        nameEducation: "kỹ năng giao tiếp",
        numberEducation: "M1234",
    }])
    console.log(`Xong! Thông tin kỷ luật đã được tạo`);
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