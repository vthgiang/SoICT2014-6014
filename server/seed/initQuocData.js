const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require("../helpers/config");

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
    ModuleConfiguration,

    RootRole,
    SystemLink,
    SystemComponent,

    Employee,
    Salary,
    Field,
    AnnualLeave,
    Discipline,
    Commendation,
    Timesheet,
    EducationProgram,
    Course,

    EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet,
    Task,
    Project,
} = require("../models");
const { job } = require("cron");

require("dotenv").config();

const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
];
const days = [
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
];
function randomDateOld() {
    let date = `${Math.floor(Math.random() * 40) + 1960}-${months[Math.floor(Math.random() * 12)]
        }-${days[Math.floor(Math.random() * 19)]}`;
    return date;
}
function randomDateNew() {
    let date = `${Math.floor(Math.random() * 20) + 2000}-${months[Math.floor(Math.random() * 12)]
        }-${days[Math.floor(Math.random() * 19)]}`;
    return date;
}

const surnames = [
    "Trần",
    "Nguyễn",
    "Vũ",
    "Mai",
    "Ngô",
    "Kim",
    "Lê",
    "Đỗ",
    "Đào",
    "Dương",
    "Bùi",
    "Lưu",
    "Hoàng",
];
const middleNamesMale = [
    "Văn",
    "Thống",
    "Viết",
    "Tri",
    "Quang",
    "Lương",
    "Hoàng",
];
const namesMale = [
    "Nam",
    "Thái",
    "Cường",
    "Thành",
    "An",
    "Anh",
    "Hải",
    "Thuận",
    "Tuấn",
    "Thuấn",
    "Khẩn",
    "Thảo",
    "Danh",
];
function randomDateNameMale() {
    let name = `${surnames[Math.floor(Math.random() * 13)]} ${middleNamesMale[Math.floor(Math.random() * 7)]
        } ${namesMale[Math.floor(Math.random() * 13)]}`;
    return name;
}

const middleNamesFemale = ["Thị", "Thanh", "Thu", "Thuỳ"];
const namesFemale = [
    "Anh",
    "Lan",
    "Cúc",
    "Oanh",
    "Linh",
    "Duyên",
    "Hằng",
    "Thu",
    "Ngân",
    "Phương",
    "Phượng",
    "Huệ",
    "Mai",
    "Ngọc",
];

const currentYear = new Date().getFullYear()
const beforCurrentYear = new Date().getFullYear() - 1
function randomDateNameFemale() {
    let name = `${surnames[Math.floor(Math.random() * 13)]} ${middleNamesFemale[Math.floor(Math.random() * 4)]
        } ${namesFemale[Math.floor(Math.random() * 14)]}`;
    return name;
}
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        " "
    );
    return str;
}


const professionalSkill = [
    "intermediate_degree",
    "colleges",
    "university",
    "master_degree",
    "engineer",
    "bachelor",
    "phd",
    "unavailable",
];
const foreignLanguage = [600, 650, 700, 750, 800, 850, 900];
const maritalStatus = ["single", "married"];

const initHumanResourceForProjectData = async () => {
    /**
     * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
     */
    let connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
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
            useFindAndModify: false
        }
    const systemDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`, connectOptions);

    let connectVNISTOptions = process.env.DB_AUTHENTICATION === 'true' ?
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
            useFindAndModify: false
        }
    const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/vnist`, connectVNISTOptions);

    if (!systemDB) throw "DB vnist cannot connect";
    console.log("DB vnist connected");

    if (!vnistDB) throw "DB vnist cannot connect";
    console.log("DB vnist connected");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         1 KHỞI TẠO MODEL CHO DB
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const initModels = (db) => {
        if (!db.models.Component) Component(db);
        if (!db.models.RoleType) RoleType(db);
        if (!db.models.Role) Role(db);
        if (!db.models.Company) Company(db);
        if (!db.models.OrganizationalUnit) OrganizationalUnit(db);
        if (!db.models.Link) Link(db);
        if (!db.models.Privilege) Privilege(db);
        if (!db.models.User) User(db);
        if (!db.models.UserRole) UserRole(db);
        if (!db.models.ModuleConfiguration) ModuleConfiguration(db);

        if (!db.models.RootRole) RootRole(db);
        if (!db.models.SystemLink) SystemLink(db);
        if (!db.models.SystemComponent) SystemComponent(db);

        if (!db.models.Employee) Employee(db);
        if (!db.models.Salary) Salary(db);
        if (!db.models.AnnualLeave) AnnualLeave(db);
        if (!db.models.Discipline) Discipline(db);
        if (!db.models.Commendation) Commendation(db);
        if (!db.models.Timesheet) Timesheet(db);
        if (!db.models.EducationProgram) EducationProgram(db);
        if (!db.models.Course) Course(db);

        if (!db.models.EmployeeKpi) EmployeeKpi(db);
        if (!db.models.EmployeeKpiSet) EmployeeKpiSet(db);
        if (!db.models.OrganizationalUnitKpi) OrganizationalUnitKpi(db);
        if (!db.models.OrganizationalUnitKpiSet) OrganizationalUnitKpiSet(db);
        if (!db.models.Task) Task(db);
        if (!db.models.Project) Project(db);
    };
    initModels(vnistDB);
    initModels(systemDB);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         2 LẤY DỮ LIỆU VỀ CÔNG TY VNIST TRONG DATABASE CỦA HỆ THỐNG
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const vnist = await Company(systemDB).findOne({
        shortName: "vnist",
    });

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         5. TẠO THÊM CÁC ROLE MẶC ĐỊNH CHO VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const roleChucDanh = await RoleType(vnistDB).findOne({
        name: Terms.ROLE_TYPES.POSITION,
    });
    const roleManager = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.MANAGER.name,
    });
    const roleDeputyManager = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.DEPUTY_MANAGER.name,
    });
    const roleEmployee = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
    });

    const nvPhongMaketing = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng Marketing & NCPT sản phẩm",
        type: roleChucDanh._id,
    });
    const phoPhongMaketing = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongMaketing._id],
        name: "Phó phòng Marketing & NCPT sản phẩm",
        type: roleChucDanh._id,
    });
    const truongPhongMaketing = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongMaketing._id, phoPhongMaketing._id],
        name: "Trưởng phòng Marketing & NCPT sản phẩm",
        type: roleChucDanh._id,
    });

    const nvPhongKS = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kiểm soát nội bộ",
        type: roleChucDanh._id,
    });
    const phoPhongKS = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongKS._id],
        name: "Phó phòng kiểm soát nội bộ",
        type: roleChucDanh._id,
    });
    const truongPhongKS = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongKS._id, phoPhongKS._id],
        name: "Trưởng phòng kiểm soát nội bộ",
        type: roleChucDanh._id,
    });

    const nvPhongQTNS = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng quản trị nhân sự",
        type: roleChucDanh._id,
    });
    const phoPhongQTNS = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongQTNS._id],
        name: "Phó phòng quản trị nhân sự",
        type: roleChucDanh._id,
    });
    const truongPhongQTNS = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongQTNS._id, phoPhongQTNS._id],
        name: "Trưởng phòng quản trị nhân sự",
        type: roleChucDanh._id,
    });

    const nvPhongQTMT = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng quản trị mục tiêu",
        type: roleChucDanh._id,
    });
    const phoPhongQTMT = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongQTMT._id],
        name: "Phó phòng quản trị mục tiêu",
        type: roleChucDanh._id,
    });
    const truongPhongQTMT = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongQTMT._id, phoPhongQTMT._id],
        name: "Trưởng phòng quản trị mục tiêu",
        type: roleChucDanh._id,
    });

    const nvPhongQTHCNS = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng quản trị hành chính nhân sự",
        type: roleChucDanh._id,
    });
    const phoPhongQTHCNS = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongQTHCNS._id],
        name: "Phó phòng quản trị hành chính nhân sự",
        type: roleChucDanh._id,
    });
    const truongPhongQTHCNS = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongQTHCNS._id, phoPhongQTHCNS._id],
        name: "Trưởng phòng quản trị hành chính nhân sự",
        type: roleChucDanh._id,
    });

    const nvPhongHCHT = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng hậu cần - tư vấn",
        type: roleChucDanh._id,
    });
    const phoPhongHCHT = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongHCHT._id],
        name: "Phó phòng hậu cần - tư vấn",
        type: roleChucDanh._id,
    });
    const truongPhongHCHT = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongHCHT._id, phoPhongHCHT._id],
        name: "Trưởng phòng hậu cần - tư vấn",
        type: roleChucDanh._id,
    });

    const nvPhongTCKT = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng tài chính kế toán",
        type: roleChucDanh._id,
    });
    const phoPhongTCKT = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongTCKT._id],
        name: "Phó phòng tài chính kế toán",
        type: roleChucDanh._id,
    });
    const truongPhongTCKT = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongTCKT._id, phoPhongTCKT._id],
        name: "Trưởng phòng tài chính kế toán",
        type: roleChucDanh._id,
    });

    const nvPhongKTDN = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kế toán doanh nghiệp",
        type: roleChucDanh._id,
    });
    const phoPhongKTDN = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongKTDN._id],
        name: "Phó phòng kế toán doanh nghiệp",
        type: roleChucDanh._id,
    });
    const truongPhongKTDN = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongKTDN._id, phoPhongKTDN._id],
        name: "Trưởng phòng kế toán doanh nghiệp",
        type: roleChucDanh._id,
    });

    const nvPhongKTBH = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kế toán bán hàng",
        type: roleChucDanh._id,
    });
    const phoPhongKTBH = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongKTBH._id],
        name: "Phó phòng kế toán bán hàng",
        type: roleChucDanh._id,
    });
    const truongPhongKTBH = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongKTBH._id, phoPhongKTBH._id],
        name: "Trưởng phòng kế toán bán hàng",
        type: roleChucDanh._id,
    });

    // Tìm các role đã có sẵn trong db VNIST
    const nvKinhDoanh247 = await Role(vnistDB).findOne({
        name: "Nhân viên phòng kinh doanh 247",
    });
    const truongPhongKinhDoanh247 = await Role(vnistDB).findOne({
        name: "Trưởng phòng kinh doanh 247",
    });
    const nvKinhDoanh123 = await Role(vnistDB).findOne({
        name: "Nhân viên phòng kinh doanh 123",
    });
    const truongPhongKinhDoanh123 = await Role(vnistDB).findOne({
        name: "Trưởng phòng kinh doanh 123",
    });
    const keToanVien = await Role(vnistDB).findOne({
        name: "Kế toán viên",
    });
    const keToanTruong = await Role(vnistDB).findOne({
        name: "Kế toán trưởng",
    });
    const nvSalesAdmin = await Role(vnistDB).findOne({
        name: "Nhân viên qản lý bán hàng",
    });
    const truongPhongSalesAdmin = await Role(vnistDB).findOne({
        name: "Trưởng phòng quản lý bán hàng",
    });


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         3. TẠO THÊM DỮ LIỆU CÁC PHÒNG BAN CHO CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const Directorate = await OrganizationalUnit(vnistDB).findOne({
        name: "Ban giám đốc",
    });
    const boPhanKinhDoanh = await OrganizationalUnit(vnistDB).findOne({
        name: "Bộ phận kinh doanh",
    });

    const phongKinhDoanh247 = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng kinh doanh 247",
            description:
                "Phòng kinh doanh 247",
            managers: [truongPhongKinhDoanh247._id],
            employees: [nvKinhDoanh247._id],
            parent: boPhanKinhDoanh._id,
        },
    ]);

    const phongKinhDoanh123 = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng kinh doanh 123",
            description:
                "Phòng kinh doanh 123",
            managers: [truongPhongKinhDoanh123._id],
            employees: [nvKinhDoanh123._id],
            parent: boPhanKinhDoanh._id,
        },
    ]);

    const phongMaketing = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng Marketing & NCPT sản phẩm",
            description:
                "Phòng Marketing & NCPT sản phẩm Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongMaketing._id],
            deputyManagers: [phoPhongMaketing._id],
            employees: [nvPhongMaketing._id],
            parent: Directorate._id,
        },
    ]);

    const phongKS = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng kiểm soát nội bộ",
            description:
                "Phòng kinh kiểm soát nội bộ Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongKS._id],
            deputyManagers: [phoPhongKS._id],
            employees: [nvPhongKS._id],
            parent: Directorate._id,
        },
    ]);

    const phongQTNS = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng quản trị nhân sự",
            description:
                "Phòng quản trị nhân sự Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongQTNS._id],
            deputyManagers: [phoPhongQTNS._id],
            employees: [nvPhongQTNS._id],
            parent: Directorate._id,
        },
    ]);

    const phongQTMT = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng quản trị mục tiêu",
            description:
                "Phòng quản trị mục tiêu Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongQTMT._id],
            deputyManagers: [phoPhongQTMT._id],
            employees: [nvPhongQTMT._id],
            parent: phongQTNS[0]._id,
        },
    ]);

    const phongQTHCNS = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng hành chính nhân sự",
            description:
                "Phòng hành chính nhân sự Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongQTHCNS._id],
            deputyManagers: [phoPhongQTHCNS._id],
            employees: [nvPhongQTHCNS._id],
            parent: phongQTNS[0]._id,
        },
    ]);

    const phongHCHT = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng hậu cần - tư vấn",
            description:
                "Phòng hậu cần - tư vấn Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongHCHT._id],
            deputyManagers: [phoPhongHCHT._id],
            employees: [nvPhongHCHT._id],
            parent: phongQTNS[0]._id,
        },
    ]);

    const phongTCKT = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng tài chính kế toán",
            description:
                "Phòng tài chính kế toán Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongTCKT._id],
            deputyManagers: [phoPhongTCKT._id],
            employees: [nvPhongTCKT._id],
            parent: Directorate._id,
        },
    ]);

    const phongKTDN = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng kế toán doanh nghiệp",
            description:
                "Phòng kế toán doanh nghiệp Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongKTDN._id],
            deputyManagers: [phoPhongKTDN._id],
            employees: [nvPhongKTDN._id],
            parent: phongTCKT[0]._id,
        },
    ]);

    const phongKTBH = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Phòng kế toán bán hàng",
            description:
                "Phòng kế toán bán hàng Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            managers: [truongPhongKTBH._id],
            deputyManagers: [phoPhongKTBH._id],
            employees: [nvPhongKTBH._id],
            parent: phongTCKT[0]._id,
        },
    ]);

    const boPhanKeToan = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Bộ phận kế toán",
            description:
                "Bộ phận kế toán",
            managers: [keToanTruong._id],
            employees: [keToanVien._id],
            parent: boPhanKinhDoanh._id,
        },
    ]);

    const boPhanSalesAdmin = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Bộ phận Sales Admin",
            description:
                "Bộ phận Sales Admin",
            managers: [truongPhongSalesAdmin._id],
            employees: [nvSalesAdmin._id],
            parent: boPhanKinhDoanh._id,
        },
    ]);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         3. LẤY CÁC TÀI KHOẢN ĐÃ CÓ CỦA VNIST ĐỂ TẠO NHÂN VIÊN TRƯỚC
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    // const units = [
    //     boPhanKinhDoanh,
    //     phongKinhDoanh123,
    //     phongKinhDoanh247,
    //     phongMaketing,
    //     phongKS,
    //     phongQTNS,
    //     phongQTMT,
    //     phongQTHCNS,
    //     phongHCHT,
    //     phongTCKT,
    //     phongKTDN,
    //     phongKTBH,
    // ];
    const fields = await Field(vnistDB).insertMany([
        {
            // 0
            name: "Công nghệ thực phẩm",
            description: "Ngành công nghệ thực phẩm",
            company: vnist._id,
        },
        {
            // 1
            name: "Kiến trúc",
            description: "Ngành kiến trúc",
            company: vnist._id,
        },
        {
            // 2
            name: "Công nghệ thông tin",
            description: "Ngành công nghệ thông tin",
            company: vnist._id,
        },
        {
            // 3
            name: "Quản lý xây dựng",
            description: "Ngành quản lý xây dựng",
            company: vnist._id,
        },
        {
            // 4
            name: "Kiểm toán",
            description: "Ngành kiểm toán",
            company: vnist._id,
        },
        {
            // 5
            name: "Kế toán",
            description: "Ngành kế toán",
            company: vnist._id,
        },
    ])
    const usersAlreadyInVNISTWithAdmin = await User(vnistDB).find({});
    let usersAlreadyInVNIST = [];
    usersAlreadyInVNISTWithAdmin.forEach((item) => {
        if (!item.email.includes('admin')) {
            usersAlreadyInVNIST.push(item);
        }
    })
    // Xoá hết 3 employee trong bảng employee để tránh bị trùng vũ thị cúc + trần văn bình
    await Employee(vnistDB).deleteMany({});
    await Salary(vnistDB).deleteMany({});
    // Tạo thông tin cho nhân viên tử các user đã có trong vnist
    let staffsForUsersAlreadyInVNIST = [];
    usersAlreadyInVNIST.forEach((x, index) => {
        let contractEndDate = new Date(
            `${index < 50 ? currentYear : currentYear - 1}-${months[Math.floor(Math.random() * 12)]
            }-${days[Math.floor(Math.random() * 19)]}`
        );
        staffsForUsersAlreadyInVNIST = [
            ...staffsForUsersAlreadyInVNIST,
            {
                avatar: "/upload/human-resource/avatars/avatar5.png",
                fullName: x.name,
                employeeNumber: `MS${2020100 + index}`,
                status: 70 <= index && index <= 120 ? "leave" : "active",
                company: vnist._id,
                employeeTimesheetId: `CC${100 + index}`,
                gender: index <= 100 ? "male" : "female",
                startingDate: new Date(
                    `${index < 70 ? currentYear - 1 : index > 120 ? currentYear : currentYear - 2}-${months[Math.floor(Math.random() * 12)]
                    }-${days[Math.floor(Math.random() * 19)]}`
                ),
                leavingDate:
                    70 <= index && index <= 120
                        ? new Date(
                            `${currentYear}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                            }`
                        )
                        : null,
                birthdate: new Date(randomDateOld()),
                birthplace: "Hai Bà Trưng - Hà Nội",
                identityCardNumber: `${163412570 + index}`,
                identityCardDate: new Date(randomDateNew()),
                identityCardAddress: "Hà Nội",
                emailInCompany: x.email.toLowerCase(),
                nationality: "Việt Nam",
                atmNumber: `${102298666 + index}`,
                bankName: "ViettinBank",
                bankAddress: "Hai Bà Trưng",
                ethnic: "Kinh",
                religion: "Không",
                maritalStatus: maritalStatus[Math.floor(Math.random() * 6)],
                phoneNumber: 962586290 + index,
                personalEmail: `${removeVietnameseTones(
                    x.name.toLowerCase().replace(/ /g, "")
                )}fake11.vnist@gmail.com`,
                phoneNumber2: 9625845,
                personalEmail2: `${removeVietnameseTones(
                    x.name.toLowerCase().replace(/ /g, "")
                )}fake12.vnist@gmail.com`,
                homePhone: 978590338 + index,
                emergencyContactPerson: randomDateNameMale(),
                relationWithEmergencyContactPerson: "Em trai",
                emergencyContactPersonPhoneNumber: 962586278 + index,
                emergencyContactPersonEmail: `${removeVietnameseTones(
                    randomDateNameMale().replace(/ /g, "")
                )}@gmail.com`,
                emergencyContactPersonHomePhone: 962586789 + index,
                emergencyContactPersonAddress:
                    "Tạ Quang Bửu - Hai Bà Trưng- Hà Nội",
                permanentResidence: `Số ${index} Tạ Quang Bửu - Hai Bà Trưng- Hà Nội`,
                permanentResidenceCountry: "Việt Nam",
                permanentResidenceCity: "Hà Nội",
                permanentResidenceDistrict: "Hai Bà Trưng",
                permanentResidenceWard: "Tạ Quang Bửu",
                temporaryResidence: `Ngõ ${index} Trại Cá phường Trương Định`,
                temporaryResidenceCountry: "Việt Nam",
                temporaryResidenceCity: "Hà Nội",
                temporaryResidenceDistrict: "Hai Bà Trưng",
                temporaryResidenceWard: "Bạch Mai",
                educationalLevel: "12/12",
                foreignLanguage: `${foreignLanguage[Math.floor(Math.random() * 7)]
                    } Toeic`,
                professionalSkill:
                    professionalSkill[Math.floor(Math.random() * 8)],
                healthInsuranceNumber: `N1236589${index}`,
                healthInsuranceStartDate: new Date(
                    `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                    }`
                ),
                healthInsuranceEndDate: new Date(
                    `${currentYear}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                    }`
                ),
                socialInsuranceNumber: `XH${1569874 + index}`,
                socialInsuranceDetails: [
                    {
                        company: "Vnist",
                        position: "Nhân viên",
                        startDate: new Date(`${currentYear}-01`),
                        endDate: new Date(`${currentYear}-05`),
                    },
                ],
                taxNumber: `${12315 + index}`,
                taxRepresentative: randomDateNameMale(),
                taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
                taxAuthority: "Chi cục thuế Hai Bà Trưng",
                degrees: [
                    {
                        name: "Bằng tốt nghiệp",
                        issuedBy: "Đại học Bách Khoa",
                        year: currentYear,
                        field: fields[Math.floor(Math.random() * 6)]._id,
                        degreeType: "good",
                    },
                ],
                certificates: [
                    {
                        name: "PHP",
                        issuedBy: "Hà Nội",
                        startDate: new Date(`${currentYear}-10-25`),
                        endDate: new Date(`${currentYear}-10-25`),
                    },
                ],
                experiences: [
                    {
                        startDate: new Date(`${currentYear}-06`),
                        endDate: new Date(`${currentYear}-02`),
                        company: "Vnist",
                        position: "Nhân viên",
                    },
                ],
                contractType: "Thử việc",
                contractEndDate: contractEndDate,
                contracts: [
                    {
                        name: "Thực tập",
                        contractType: `${index < 50
                            ? "Thử việc"
                            : index > 150
                                ? "Hợp đồng ngắn hạn hạn"
                                : "Hợp đồng dài hạn"
                            }`,
                        startDate: new Date(
                            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                            }`
                        ),
                        endDate: contractEndDate,
                    },
                ],
                archivedRecordNumber: `T3 - ${1234690 + index}`,
                files: [],
            },
        ];
    });
    let employeesForUsersAlreadyInVNIST = await Employee(vnistDB).insertMany(staffsForUsersAlreadyInVNIST);

    // Tạo lương cho các nhân viên đã có trong vnist
    let salaryForUsersAlreadyInVNIST = [];
    for (let i = 0; i < usersAlreadyInVNIST.length; i++) {
        // Truy vấn bảng userRole từ userId
        let currentUserRoles = await UserRole(vnistDB).find({
            userId: usersAlreadyInVNIST[i]._id,
        });
        // Truy vấn bảng organizationalUnit từ roleId
        for (let j = 0; j < currentUserRoles.length; j++) {
            let unit = await OrganizationalUnit(vnistDB).findOne({
                '$or': [
                    {
                        managers: currentUserRoles[j].roleId,
                    },
                    {
                        deputyManagers: currentUserRoles[j].roleId,
                    },
                    {
                        employees: currentUserRoles[j].roleId,
                    },
                ],
            });
            if (unit) {
                salaryForUsersAlreadyInVNIST = [
                    ...salaryForUsersAlreadyInVNIST,
                    {
                        company: vnist._id,
                        employee: employeesForUsersAlreadyInVNIST[i]._id,
                        month: `${currentYear}-${months[Math.floor(Math.random() * 12)]}`,
                        organizationalUnit: unit._id,
                        mainSalary:
                            ((i + 1) % 19) * 7000000 +
                            Math.floor(Math.random() * 20) * 1000000,
                        unit: "VND",
                        bonus: [
                            {
                                nameBonus: "Thưởng dự án",
                                number:
                                    (i % 19) * 1000000 +
                                    Math.floor(Math.random() * 20) * 1000000,
                            },
                        ],
                    },
                ];
            }
        }
    }
    await Salary(vnistDB).insertMany(salaryForUsersAlreadyInVNIST);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         4. THÊM CÁC TÀI KHOẢN USER CHO PROJECT
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync("vnist123@", salt);
    let usersForProject = [];
    for (let i = 0; i <= 20; i++) {
        if (i <= 10) {
            let name = randomDateNameMale();
            usersForProject = [
                ...usersForProject,
                {
                    name: name,
                    email: `${removeVietnameseTones(
                        name.toLowerCase().replace(/ /g, "")
                    )}fake${i + 1}.vnist@gmail.com`,
                    password: hash,
                    company: vnist._id,
                },
            ];
        } else {
            let name = randomDateNameFemale();
            usersForProject = [
                ...usersForProject,
                {
                    name: name,
                    email: `${removeVietnameseTones(
                        name.toLowerCase().replace(/ /g, "")
                    )}fake${i + 1}.vnist@gmail.com`,
                    password: hash,
                    company: vnist._id,
                },
            ];
        }
    }
    const usersForProjectAfterDB = await User(vnistDB).insertMany(usersForProject);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         6. GÁN PHÂN QUYỀN ROLE CHO CÁC VỊ TRÍ TRONG CÔNG TY
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const phongBan = [
        nvPhongMaketing,
        nvPhongKS,
        nvPhongQTNS,
        nvPhongQTMT,
        nvPhongQTHCNS,
        nvPhongHCHT,
        nvPhongTCKT,
        nvPhongKTDN,
        nvPhongKTBH,
    ];
    let userRolesForProject = [];
    for (let i = 0; i <= 20; i++) {
        let index = Math.floor(Math.random() * 9);
        let unit = phongBan[index];
        userRolesForProject = [
            ...userRolesForProject,
            {
                userId: usersForProjectAfterDB[i]._id,
                roleId: unit._id,
            },
        ];
    }
    await UserRole(vnistDB).insertMany(userRolesForProject);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         6. TẠO NHÂN VIÊN MỚI TỪ CÁC USER MỚI
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    let staffsForUsersProject = [];
    usersForProjectAfterDB.forEach((x, index) => {
        let contractEndDate = new Date(
            `${index < 50 ? currentYear : currentYear - 1}-${months[Math.floor(Math.random() * 12)]
            }-${days[Math.floor(Math.random() * 19)]}`
        );
        staffsForUsersProject = [
            ...staffsForUsersProject,
            {
                avatar: "/upload/human-resource/avatars/avatar5.png",
                fullName: x.name,
                employeeNumber: `MS${2020100 + index}`,
                status: 70 <= index && index <= 120 ? "leave" : "active",
                company: vnist._id,
                employeeTimesheetId: `CC${100 + index}`,
                gender: index <= 100 ? "male" : "female",
                startingDate: new Date(
                    `${index < 70 ? currentYear - 1 : index > 120 ? currentYear : currentYear - 2}-${months[Math.floor(Math.random() * 12)]
                    }-${days[Math.floor(Math.random() * 19)]}`
                ),
                leavingDate:
                    70 <= index && index <= 120
                        ? new Date(
                            `${currentYear}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                            }`
                        )
                        : null,
                birthdate: new Date(randomDateOld()),
                birthplace: "Hai Bà Trưng - Hà Nội",
                identityCardNumber: `${163412570 + index}`,
                identityCardDate: new Date(randomDateNew()),
                identityCardAddress: "Hà Nội",
                emailInCompany: x.email.toLowerCase(),
                nationality: "Việt Nam",
                atmNumber: `${102298666 + index}`,
                bankName: "ViettinBank",
                bankAddress: "Hai Bà Trưng",
                ethnic: "Kinh",
                religion: "Không",
                maritalStatus: maritalStatus[Math.floor(Math.random() * 6)],
                phoneNumber: 962586290 + index,
                personalEmail: `${removeVietnameseTones(
                    x.name.toLowerCase().replace(/ /g, "")
                )}fake11.vnist@gmail.com`,
                phoneNumber2: 9625845,
                personalEmail2: `${removeVietnameseTones(
                    x.name.toLowerCase().replace(/ /g, "")
                )}fake12.vnist@gmail.com`,
                homePhone: 978590338 + index,
                emergencyContactPerson: randomDateNameMale(),
                relationWithEmergencyContactPerson: "Em trai",
                emergencyContactPersonPhoneNumber: 962586278 + index,
                emergencyContactPersonEmail: `${removeVietnameseTones(
                    randomDateNameMale().replace(/ /g, "")
                )}@gmail.com`,
                emergencyContactPersonHomePhone: 962586789 + index,
                emergencyContactPersonAddress:
                    "Tạ Quang Bửu - Hai Bà Trưng- Hà Nội",
                permanentResidence: `Số ${index} Tạ Quang Bửu - Hai Bà Trưng- Hà Nội`,
                permanentResidenceCountry: "Việt Nam",
                permanentResidenceCity: "Hà Nội",
                permanentResidenceDistrict: "Hai Bà Trưng",
                permanentResidenceWard: "Tạ Quang Bửu",
                temporaryResidence: `Ngõ ${index} Trại Cá phường Trương Định`,
                temporaryResidenceCountry: "Việt Nam",
                temporaryResidenceCity: "Hà Nội",
                temporaryResidenceDistrict: "Hai Bà Trưng",
                temporaryResidenceWard: "Bạch Mai",
                educationalLevel: "12/12",
                foreignLanguage: `${foreignLanguage[Math.floor(Math.random() * 7)]
                    } Toeic`,
                professionalSkill:
                    professionalSkill[Math.floor(Math.random() * 8)],
                healthInsuranceNumber: `N1236589${index}`,
                healthInsuranceStartDate: new Date(
                    `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                    }`
                ),
                healthInsuranceEndDate: new Date(
                    `${currentYear}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                    }`
                ),
                socialInsuranceNumber: `XH${1569874 + index}`,
                socialInsuranceDetails: [
                    {
                        company: "Vnist",
                        position: "Nhân viên",
                        startDate: new Date(`${currentYear}-01`),
                        endDate: new Date(`${currentYear}-05`),
                    },
                ],
                taxNumber: `${12315 + index}`,
                taxRepresentative: randomDateNameMale(),
                taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
                taxAuthority: "Chi cục thuế Hai Bà Trưng",
                degrees: [
                    {
                        name: "Bằng tốt nghiệp",
                        issuedBy: "Đại học Bách Khoa",
                        year: currentYear,
                        field: fields[Math.floor(Math.random() * 6)]._id,
                        degreeType: "good",
                    },
                ],
                certificates: [
                    {
                        name: "PHP",
                        issuedBy: "Hà Nội",
                        startDate: new Date(`${currentYear}-10-25`),
                        endDate: new Date(`${currentYear}-10-25`),
                    },
                ],
                experiences: [
                    {
                        startDate: new Date(`${currentYear}-06`),
                        endDate: new Date(`${currentYear}-02`),
                        company: "Vnist",
                        position: "Nhân viên",
                    },
                ],
                contractType: "Thử việc",
                contractEndDate: contractEndDate,
                contracts: [
                    {
                        name: "Thực tập",
                        contractType: `${index < 50
                            ? "Thử việc"
                            : index > 150
                                ? "Hợp đồng ngắn hạn hạn"
                                : "Hợp đồng dài hạn"
                            }`,
                        startDate: new Date(
                            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
                            }`
                        ),
                        endDate: contractEndDate,
                    },
                ],
                archivedRecordNumber: `T3 - ${1234690 + index}`,
                files: [],
            },
        ];
        // if (usersAlreadyInVNIST.filter(item => item == x).length === 0) {

        // }
    });
    let employeesForUsersProject = await Employee(vnistDB).insertMany(staffsForUsersProject);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         6. TẠO LƯƠNG CHO NHỮNG NHÂN VIÊN MỚI
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    let salaryForUsersProject = [];
    for (let i = 0; i < usersForProjectAfterDB.length; i++) {
        // Truy vấn bảng userRole từ userId
        let currentUserRoles = await UserRole(vnistDB).find({
            userId: usersForProjectAfterDB[i]._id,
        });
        // Truy vấn bảng organizationalUnit từ roleId
        for (let j = 0; j < currentUserRoles.length; j++) {
            let unit = await OrganizationalUnit(vnistDB).findOne({
                '$or': [
                    {
                        managers: currentUserRoles[j].roleId,
                    },
                    {
                        deputyManagers: currentUserRoles[j].roleId,
                    },
                    {
                        employees: currentUserRoles[j].roleId,
                    },
                ],
            });
            if (unit) {
                salaryForUsersProject = [
                    ...salaryForUsersProject,
                    {
                        company: vnist._id,
                        employee: employeesForUsersProject[i]._id,
                        month: `${currentYear}-${months[Math.floor(Math.random() * 12)]}`,
                        organizationalUnit: unit._id,
                        mainSalary:
                            ((i + 1) % 19) * 2000000 +
                            Math.floor(Math.random() * 20) * 1000000,
                        unit: "VND",
                        bonus: [
                            {
                                nameBonus: "Thưởng dự án",
                                number:
                                    (i % 19) * 1000000 +
                                    Math.floor(Math.random() * 20) * 1000000,
                            },
                        ],
                    },
                ];
            }
        }
    }
    await Salary(vnistDB).insertMany(salaryForUsersProject);

    const currentSalaries = await Salary(vnistDB).find({});
    const currentEmployees = await Employee(vnistDB).find({});
    const currentOrganizationUnits = await OrganizationalUnit(vnistDB).find({});
    console.log('------------------LƯƠNG NHÂN VIÊN---------------------')
    console.log('-------------------------------------------------------------')
    for (let salaryItem of currentSalaries) {
        const moment = require('moment');
        const currentEmployee = currentEmployees.find(item => {
            return JSON.stringify(item._id) === JSON.stringify(salaryItem.employee)
        });
        const currentOrganizationUnit = currentOrganizationUnits.find(item => {
            return JSON.stringify(item._id) === JSON.stringify(salaryItem.organizationalUnit)
        });
        console.log(currentEmployee.fullName, '---', currentOrganizationUnit.name, '---', moment(salaryItem.month).format('MM-YYYY'), '---', salaryItem.mainSalary);
    }
    console.log('-------------------------------------------------------------')
    console.log('-------------------------------------------------------------')

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         TẠO DỮ LIỆU CHO DỰ ÁN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const projectManager = await User(vnistDB).findOne({
        name: 'Nguyễn Văn Danh'
    });
    // const currentUsers = await User(vnistDB).find({});

    // const newEmployeesWithUnit = [
    //     {
    //         unitId: Directorate._id,
    //         listUsers: [
    //             {
    //                 userId: Directorate.managers[0],
    //                 salary: ,
    //             }
    //         ]
    //     }
    // ];

    const newProject = {
        code: 'DUAN11',
        name: 'Du an 1',
        "unitTime": "day",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "ádasdasdasdasd",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: [],
        responsibleEmployeesWithUnit: []
    }

    await Project(vnistDB).insertMany([
        newProject,
    ]);
    console.log('Hoàn thành tạo dữ liệu cho dự án')

}

initHumanResourceForProjectData().catch((err) => {
    console.log(err);
    process.exit(0);
});