const Log = require('../models/log.model');
const RoleType = require('../models/role_type.model');
const Role = require('../models/role.model');
const Company = require('../models/company.model');
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
    console.log("Đang fake dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU VỀ CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu công ty!");
    var xyz = await Company.create({
        name: 'Công ty TNHH XYZ',
        short_name: 'xys',
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
        }
    ]);
    console.log("Xong! Đã thêm tài khoản:", users);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC ROLE MẶC ĐỊNH CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo role mặc định của công ty...");
    const roleAbstract = await RoleType.findOne({
        name: 'abstract'
    });

    const roles = await Role.insertMany([{
        name: "Super Admin",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Admin",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Dean",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Vice Dean",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Employee",
        company: xyz._id,
        type: roleAbstract._id
    }]);
    console.log("Đã tạo xong các role mặc định của công ty: ", roles);
    //END
    await UserRole.insertMany([{ //gán tài khoản super.admin.xyz có role là Super Admin của công ty xyz
        userId: users[0]._id,
        roleId: roles[0]._id
    }, {
        userId: users[1]._id,
        roleId: roles[1]._id
    }]);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo link cho các trang web của công ty...");
    const links = await Link.insertMany([{
            url: '/',
            description: `Trang chủ công ty ${xyz.name}`,
            company: xyz._id
        }, {
            url: '/manage-department',
            description: 'Quản lý cơ cấu tổ chức',
            company: xyz._id
        }, {
            url: '/manage-user',
            description: 'Quản lý người dùng',
            company: xyz._id
        }, {
            url: '/manage-role',
            description: 'Quản lý phân quyền',
            company: xyz._id
        }, {
            url: '/manage-link',
            description: 'Quản lý trang web của công ty',
            company: xyz._id
        }, {
            url: '/manage-component',
            description: 'Quản lý các thành phần UI trên trang web của công ty',
            company: xyz._id
        }, {
            url: '/manage-form-document',
            description: 'Quản lý tài liệu biểu mẫu',
            company: xyz._id
        }, {
            url: '/manage-Employee',
            description: 'Quản lý nhân sự',
            company: xyz._id
        },
        {
            url: '/add-employee',
            description: 'Thêm mới nhân viên',
            company: xyz._id
        },
        {
            url: '/list-employee',
            description: 'Danh sách nhân viên',
            company: xyz._id
        },
        {
            url: '/update-employee',
            description: 'Cập nhật thông tin cá nhân của nhân viên',
            company: xyz._id
        },
        {
            url: '/detail-employee',
            description: 'Thông tin cá nhân của nhân viên',
            company: xyz._id
        },
        {
            url: '/salary-employee',
            description: 'Quản lý lương nhân viên',
            company: xyz._id
        },
        {
            url: '/sabbatical',
            description: 'Quản lý nghỉ phép của nhân viên',
            company: xyz._id
        },
        {
            url: '/discipline',
            description: 'Quản lý khen thưởng, kỷ luật',
            company: xyz._id
        },
        {
            url: '/dashboard-employee',
            description: 'Dashboard nhân sự',
            company: xyz._id
        },
        {
            url: '/time-keeping',
            description: 'Quản lý chấm công',
            company: xyz._id
        },
        {
            url: '/trainning-course',
            description: 'Quản lý đào tạo',
            company: xyz._id
        },
        {
            url: '/account',
            description: 'Thông tin tài khoản ',
            company: xyz._id
        },
        {
            url: '/training-plan',
            description: 'Kế hoạch đào tạo',
            company: xyz._id
        },
        {
            url: '/list-course',
            description: 'Chương trình đào tạo bắt buộc',
            company: xyz._id
        }
    ]);
    console.log("Xong! Đã tạo links: ", links);
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
            roleId: roles[0]._id._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },
        //end
        //gán 7 link trên cho admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[1]._id
        }, {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        }, {
            resourceId: links[7]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[8]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[9]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[10]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[11]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[12]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[13]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[14]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[15]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[16]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[17]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[18]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[19]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        {
            resourceId: links[20]._id,
            resourceType: 'Link',
            roleId: roles[1]._id._id
        },
        //end
        //gán quyền vào trang home '/' cho role Dean, Vice Dean và Employee
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[2]._id //Dean
        }, {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[3]._id._id //Vice Dean
        }, {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[4]._id._id //Employee
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
        fullName: "Nguyễn Văn A",
        employeeNumber: "MS2015122",
        MSCC: "123456",
        gender: "Nam",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "tranhungcuong@gmail.com",
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
        relationship: "Độc thân",
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
            urlFile: "1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [],
    }, {
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Nguyễn Văn B",
        employeeNumber: "MS2015124",
        MSCC: "123456",
        gender: "Nam",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "tranhung@gmail.com",
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
        relationship: "Độc thân",
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
            urlFile: "1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
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
        fullName: "Nguyễn Văn Hưng",
        employeeNumber: "MS2015123",
        MSCC: "123456",
        gender: "Nam",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "tranhungcuong703@gmail.com",
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
        relationship: "Độc thân",
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
            urlFile: "1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [],
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
        startDate: "04-02-2020",
        endDate: "08-02-2020",
        status: "Đã chấp nhận",
        reason: "Về quê",
    }, {
        employee: employee._id,
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
        month: "02-2020",
        mainSalary: "10000000VND",
        bonus: [{
            nameBonus: "Thưởng dự án",
            number: "1000000"
        }],
    }, {
        employee: employee._id,
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
        number: "123",
        unit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
    }, {
        employee: employee._id,
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
        number: "1456",
        unit: "Phòng nhân sự",
        startDate: "02-02-2020",
        endDate: "06-02-2020",
        type: "Phạt tiền",
        reason: "Không làm đủ công",
    }, {
        employee: employee._id,
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
        unitEducation: [
            "Phòng Kinh doanh"
        ],
        positionEducation: [
            "Trưởng phòng"
        ],
        nameEducation: "An toan lao dong",
        numberEducation: "M123",
    }, {
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