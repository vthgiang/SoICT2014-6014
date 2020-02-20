const Log = require('../models/log.model');
const User = require('../models/user.model');
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

const fakeDataEmployee = async () => {
    console.log("Đang fake dữ liệu ...");

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
fakeDataEmployee()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });