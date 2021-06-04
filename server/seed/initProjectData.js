const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require("../helpers/config");
const moment = require('moment');

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
const { isEqual } = require("lodash");

require("dotenv").config();

const ADDITIONAL_USERS_NUM = 45;
const MILISECS_TO_DAYS = 86400000;
const MILISECS_TO_HOURS = 3600000;
const SUBTRACT_TO_START_DATE = 70;

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
        name: "Nhân viên phòng Marketing",
        type: roleChucDanh._id,
    });
    const phoPhongMaketing = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongMaketing._id],
        name: "Phó phòng Marketing",
        type: roleChucDanh._id,
    });
    const truongPhongMaketing = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongMaketing._id, phoPhongMaketing._id],
        name: "Trưởng phòng Marketing",
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

    const nvPhongRND = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng NC & PT",
        type: roleChucDanh._id,
    });
    const phoPhongRND = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongRND._id],
        name: "Phó phòng NC & PT",
        type: roleChucDanh._id,
    });
    const truongPhongRND = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongRND._id, phoPhongRND._id],
        name: "Trưởng phòng NC & PT",
        type: roleChucDanh._id,
    });

    const nvPhongBDCL = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng Bảo đảm chất lượng",
        type: roleChucDanh._id,
    });
    const phoPhongBDCL = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongBDCL._id],
        name: "Phó phòng Bảo đảm chất lượng",
        type: roleChucDanh._id,
    });
    const truongPhongBDCL = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongBDCL._id, phoPhongBDCL._id],
        name: "Trưởng phòng Bảo đảm chất lượng",
        type: roleChucDanh._id,
    });

    const nvPhongKTCL = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng Kiểm tra chất lượng",
        type: roleChucDanh._id,
    });
    const phoPhongKTCL = await Role(vnistDB).create({
        parents: [roleDeputyManager._id, nvPhongKTCL._id],
        name: "Phó phòng Kiểm tra chất lượng",
        type: roleChucDanh._id,
    });
    const truongPhongKTCL = await Role(vnistDB).create({
        parents: [roleManager._id, nvPhongKTCL._id, phoPhongKTCL._id],
        name: "Trưởng phòng Kiểm tra chất lượng",
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
    const nvPhongKH = await Role(vnistDB).findOne({
        name: "Nhân viên phòng kế hoạch",
    });
    const phoPhongKH = await Role(vnistDB).findOne({
        name: "Phó phòng kế hoạch",
    });
    const truongPhongKH = await Role(vnistDB).findOne({
        name: "Trưởng phòng kế hoạch",
    });
    const nvNhaMayThuocBot = await Role(vnistDB).findOne({
        name: "Nhân viên nhà máy thuốc bột",
    });
    const quanDocNhaMayThuocBot = await Role(vnistDB).findOne({
        name: "Quản đốc nhà máy thuốc bột",
    });
    const nvNhaMayThuocNuoc = await Role(vnistDB).findOne({
        name: "Nhân viên nhà máy thuốc nước",
    });
    const quanDocNhaMayThuocNuoc = await Role(vnistDB).findOne({
        name: "Quản đốc nhà máy thuốc nước",
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
    const nhamaythuocbot = await OrganizationalUnit(vnistDB).findOne({
        name: "Nhà máy sản xuất thuốc bột",
    });
    const nhamaythuocnuoc = await OrganizationalUnit(vnistDB).findOne({
        name: "Nhà máy sản xuất thuốc nước",
    });
    const phongkehoach = await OrganizationalUnit(vnistDB).findOne({
        name: "Phòng kế hoạch",
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
            name: "Phòng Marketing",
            description:
                "Phòng Marketing Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
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
            parent: phongQTNS._id,
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
            parent: phongQTNS._id,
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
            parent: phongQTNS._id,
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
            parent: phongTCKT._id,
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
            parent: phongTCKT._id,
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

    const boPhanNCPT = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Bộ phận Nghiên cứu & Phát triển",
            description:
                "Bộ phận Nghiên cứu & Phát triển",
            managers: [truongPhongRND._id],
            deputyManagers: [phoPhongRND._id],
            employees: [nvPhongRND._id],
            parent: Directorate._id,
        },
    ]);

    const boPhanBDCL = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Bộ phận Bảo đảm chất lượng",
            description:
                "Bộ phận Bảo đảm chất lượng",
            managers: [truongPhongBDCL._id],
            deputyManagers: [phoPhongBDCL._id],
            employees: [nvPhongBDCL._id],
            parent: Directorate._id,
        },
    ]);

    const boPhanKTCL = await OrganizationalUnit(vnistDB).insertMany([
        {
            name: "Bộ phận Kiểm tra chất lượng",
            description:
                "Bộ phận Kiểm tra chất lượng",
            managers: [truongPhongKTCL._id],
            deputyManagers: [phoPhongKTCL._id],
            employees: [nvPhongKTCL._id],
            parent: Directorate._id,
        },
    ]);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         3. LẤY CÁC TÀI KHOẢN ĐÃ CÓ CỦA VNIST ĐỂ TẠO NHÂN VIÊN TRƯỚC
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
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
    for (let i = 0; i <= ADDITIONAL_USERS_NUM; i++) {
        if (i <= ADDITIONAL_USERS_NUM / 2) {
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
    let userRolesForProject = [];
    let rndArr = [], marketingArr = [], ktclArr = [], bdclArr = [], khArr = [], thuocBotArr = [], thuocNuocArr = [], qlhtnsArr = [], ktdnArr = [];
    for (let i = 0; i <= ADDITIONAL_USERS_NUM; i++) {
        if (i >= 0 && i < 6) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: i === 0 ? truongPhongRND._id : nvPhongRND._id,
                },
            ];
            rndArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 6 && i < 11) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: i === 6 ? truongPhongMaketing._id : nvPhongMaketing._id,
                },
            ];
            marketingArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 11 && i < 16) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: i === 11 ? truongPhongKTCL._id : nvPhongKTCL._id,
                },
            ];
            ktclArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 16 && i < 21) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: i === 16 ? truongPhongBDCL._id : nvPhongBDCL._id,
                },
            ];
            bdclArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 21 && i < 26) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: nvPhongKH._id,
                },
            ];
            khArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 26 && i < 31) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: nvNhaMayThuocBot._id,
                },
            ];
            thuocBotArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 31 && i < 36) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: nvNhaMayThuocNuoc._id,
                },
            ];
            thuocNuocArr.push(usersForProjectAfterDB[i]);
        }
        else if (i >= 36 && i < 41) {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: i === 36 ? truongPhongQTHCNS._id : nvPhongQTHCNS._id,
                },
            ];
            qlhtnsArr.push(usersForProjectAfterDB[i]);
        }
        else {
            userRolesForProject = [
                ...userRolesForProject,
                {
                    userId: usersForProjectAfterDB[i]._id,
                    roleId: i === 41 ? truongPhongKTDN._id : nvPhongKTDN._id,
                },
            ];
            ktdnArr.push(usersForProjectAfterDB[i]);
        }
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

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
         TẠO DỮ LIỆU CHO DỰ ÁN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const currentSalaries = await Salary(vnistDB).find({});
    const currentEmployees = await Employee(vnistDB).find({});
    const currentUsers = await User(vnistDB).find({});
    // Set 1 người làm projectManager
    const projectManager = await User(vnistDB).findOne({
        name: 'Nguyễn Văn Danh'
    });
    let directorateArr = usersAlreadyInVNIST;

    const TotalUnitUsersArr = {
        direct: getShortenArray(directorateArr, 4),
        ncpt: getShortenArray(rndArr, 5),
        marketing: getShortenArray(marketingArr, 2),
        ktcl: getShortenArray(ktclArr, 2),
        bdcl: getShortenArray(bdclArr, 2),
        kehoach: getShortenArray(khArr, 2),
        thuocbot: getShortenArray(thuocBotArr, 2),
        thuocnuoc: getShortenArray(thuocNuocArr, 2),
        qthcns: getShortenArray(qlhtnsArr, 1),
        ktdn: getShortenArray(ktdnArr),
    }
    const dataForResponsibleEmployees = [
        { unitItem: Directorate, unitUsersArr: TotalUnitUsersArr.direct },
        { unitItem: boPhanNCPT[0], unitUsersArr: TotalUnitUsersArr.ncpt },
        { unitItem: phongMaketing[0], unitUsersArr: TotalUnitUsersArr.marketing },
        { unitItem: boPhanKTCL[0], unitUsersArr: TotalUnitUsersArr.ktcl },
        { unitItem: boPhanBDCL[0], unitUsersArr: TotalUnitUsersArr.bdcl },
        { unitItem: phongkehoach, unitUsersArr: TotalUnitUsersArr.kehoach },
        { unitItem: nhamaythuocbot, unitUsersArr: TotalUnitUsersArr.thuocbot },
        { unitItem: nhamaythuocnuoc, unitUsersArr: TotalUnitUsersArr.thuocnuoc },
        { unitItem: phongQTHCNS[0], unitUsersArr: TotalUnitUsersArr.qthcns },
        { unitItem: phongKTDN[0], unitUsersArr: TotalUnitUsersArr.ktdn },
    ]

    const newResponsibleEmployeesWithUnit = dataForResponsibleEmployees.map((dataItem) => {
        return {
            unitId: dataItem.unitItem._id,
            listUsers: dataItem.unitUsersArr.map((userItem) => {
                return {
                    userId: userItem._id,
                    salary: getSalaryFromUserIdAndOrgId(currentSalaries, currentEmployees, currentUsers, dataItem.unitItem._id, userItem._id),
                }
            })
        }
    });

    const newResponsibleEmployees = newResponsibleEmployeesWithUnit.map((unitItem) => {
        return unitItem.listUsers.map((userItem) => {
            return userItem.userId
        })
    }).flat();

    const newEmptyProject1Type1 = {
        name: 'Dự án test không ràng buộc 1',
        projectType: 1,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "Dự án này có danh sách công việc không bị ràng buộc bởi tham số gì",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }

    const newEmptyProject2Type1 = {
        name: 'Dự án test không ràng buộc 2',
        projectType: 1,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "Dự án này có danh sách công việc không bị ràng buộc bởi tham số gì",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }
    
    const newEmptyProject3Type1 = {
        name: 'Dự án test không ràng buộc 3',
        projectType: 1,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "Dự án này có danh sách công việc không bị ràng buộc bởi tham số gì",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }

    
    const newEmptyProject4Type1 = {
        name: 'Dự án test không ràng buộc 4',
        projectType: 1,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "Dự án này có danh sách công việc không bị ràng buộc bởi tham số gì",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }

    
    const newEmptyProject5Type1 = {
        name: 'Dự án test không ràng buộc 5',
        projectType: 1,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "Dự án này có danh sách công việc không bị ràng buộc bởi tham số gì",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }

    const newEmptyProjectType2 = {
        name: 'Dự án test lập kế hoạch CPM',
        projectType: 2,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date("2021-04-16T00:00:00Z"),
        "endDate": new Date("2021-07-23T00:00:00Z"),
        "description": "Dự án này có danh sách công việc rỗng để có thể test chức năng lập kế hoạch",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }

    const drugRNDProjectStartDate = moment().subtract(SUBTRACT_TO_START_DATE, 'days').format();
    const drugRNDProjectEndDate = moment().add(100, 'days').format();
    const drugRNDProject = {
        name: 'Dự án nghiên cứu sản phẩm thuốc công ty Việt Anh',
        projectType: 2,
        "unitTime": "days",
        "unitCost": "VND",
        "status": "inprocess",
        "startDate": new Date(drugRNDProjectStartDate),
        "endDate": new Date(drugRNDProjectEndDate),
        "description": "Dự án này có dữ liệu danh sách công việc của 1 dự án cụ thể - dự án nghiên cứu và phát triển thuốc mới",
        projectManager: [
            projectManager._id,
        ],
        creator: projectManager._id,
        responsibleEmployees: newResponsibleEmployees,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    }

    const projectDataInsertedDB = await Project(vnistDB).insertMany([
        drugRNDProject,
        newEmptyProject1Type1,
        newEmptyProject2Type1,
        newEmptyProject3Type1,
        newEmptyProject4Type1,
        newEmptyProject5Type1,
        newEmptyProjectType2,
    ]);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
            TẠO DANH SÁCH CÔNG VIỆC CHO DỰ ÁN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    const drugRNDProjectIdInDB = projectDataInsertedDB.find((proDBItem) => proDBItem.name === drugRNDProject.name)._id;

    let fakeRACIData = [];
    for (let i = 0; i < 28; i++) {
        const ncptResDirAccArray = [0, 1, 4, 5, 6, 8, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        const ncptThuocnuocThuocbotResDirAccArray = [12, 13, 14];
        if (ncptResDirAccArray.includes(i)) {
            const responsibleEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id);
            // const accountableEmployees = [projectManager._id];
            const accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.direct, 1).map(item => item._id);
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            })
        }
        else if (ncptThuocnuocThuocbotResDirAccArray.includes(i)) {
            const responsibleEmployees = [
                ...getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id),
                ...getRandomUsersFromUnit(TotalUnitUsersArr.thuocnuoc, 1).map(item => item._id),
                ...getRandomUsersFromUnit(TotalUnitUsersArr.thuocbot, 1).map(item => item._id),
            ];
            const accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.direct, 1).map(item => item._id);
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            });
        }
        // Tài liệu nghiên cứu
        else if (i === 2) {
            const responsibleEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id);
            let accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.direct, 1).map(item => item._id);
            while (isEqual(responsibleEmployees, accountableEmployees)) {
                accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.direct, 1).map(item => item._id);
            }
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            });
        }
        // Bảng dự trù nguyên, phụ liệu
        else if (i === 3) {
            const responsibleEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id);
            const accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.kehoach, 1).map(item => item._id);
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            });
        }
        // Tiêu chuẩn cơ sở
        else if (i === 7) {
            const responsibleEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id);
            const accountableEmployees = [
                ...getRandomUsersFromUnit(TotalUnitUsersArr.ktcl, 1).map(item => item._id),
                ...getRandomUsersFromUnit(TotalUnitUsersArr.bdcl, 1).map(item => item._id),
            ];
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            });
        }
        // Nhãn sản phẩm
        else if (i === 26) {
            const responsibleEmployees = [
                ...getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id),
                ...getRandomUsersFromUnit(TotalUnitUsersArr.marketing, 1).map(item => item._id),
            ];
            const accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.direct, 1).map(item => item._id);
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            });
        }
        // Hồ sơ đăng ký sản phẩm
        else if (i === 27) {
            const responsibleEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.ncpt, 1).map(item => item._id);
            const accountableEmployees = getRandomUsersFromUnit(TotalUnitUsersArr.qthcns, 1).map(item => item._id);
            fakeRACIData.push({
                responsibleEmployees,
                accountableEmployees,
            });
        }
    }

    const fakeTasksData = [
        { name: 'Báo cáo nghiên cứu thị trường', code: 'A', preceedingTasks: [], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 80, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Phiếu đề xuất ý tưởng', code: 'B', preceedingTasks: ['A', 'D'], startDate: '', endDate: '', estimateNormalTime: 3, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 60, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Tài liệu nghiên cứu', code: 'C', preceedingTasks: [], startDate: '', endDate: '', estimateNormalTime: 2, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Bảng dự trù nguyên - phụ liệu', code: 'D', preceedingTasks: ['C'], startDate: '', endDate: '', estimateNormalTime: 2, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 90, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Đề cương xây dựng Quy mô Phòng thí nghiệm', code: 'E', preceedingTasks: ['B'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 80, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Phòng thí nghiệm - Tuần 1', code: 'F', preceedingTasks: ['E'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 80, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Phòng thí nghiệm - Tuần 2', code: 'G', preceedingTasks: ['F'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 80, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Tiêu chuẩn cơ sở', code: 'H', preceedingTasks: ['C'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Đề cương xây dựng Quy mô Pilot', code: 'I', preceedingTasks: ['G'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Pilot - Tuần 1', code: 'K', preceedingTasks: ['I'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Pilot - Tuần 2', code: 'L', preceedingTasks: ['K'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Đề cương xây dựng Quy mô Bán công nghiệp', code: 'M', preceedingTasks: ['G', 'L'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Bán công nghiệp - Tuần 1', code: 'N', preceedingTasks: ['M'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Bán công nghiệp - Tuần 2', code: 'O', preceedingTasks: ['N'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Quy mô Bán công nghiệp - Tuần 3', code: 'P', preceedingTasks: ['O'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Đề cương xây dựng Độ ổn định sản phẩm', code: 'Q', preceedingTasks: ['P'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 1', code: 'R', preceedingTasks: ['Q'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 2', code: 'S', preceedingTasks: ['R'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 3', code: 'T', preceedingTasks: ['S'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 4', code: 'U', preceedingTasks: ['T'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 5', code: 'V', preceedingTasks: ['U'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 6', code: 'W', preceedingTasks: ['V'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 7', code: 'X', preceedingTasks: ['W'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 8', code: 'Y', preceedingTasks: ['X'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 9', code: 'Z', preceedingTasks: ['Y'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Báo cáo kết quả thử nghiệm Độ ổn định sản phẩm - Tuần 10', code: 'AA', preceedingTasks: ['Z'], startDate: '', endDate: '', estimateNormalTime: 5, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Nhãn sản phẩm', code: 'AB', preceedingTasks: ['H', 'P', 'AA'], startDate: '', endDate: '', estimateNormalTime: 3, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
        { name: 'Hồ sơ đăng ký sản phảm', code: 'AC', preceedingTasks: ['AB'], startDate: '', endDate: '', estimateNormalTime: 4, creator: projectManager._id, description: '', responsibleEmployees: [], accountableEmployees: [], actorsWithSalary: [], estimateAssetCost: 1000000, totalResWeight: 70, taskProject: drugRNDProjectIdInDB, organizationalUnit: Directorate._id },
    ]
    const startEndTasksData = processDataTasksStartEnd(drugRNDProject, fakeTasksData);
    const startEndTasksDataWithoutPreceeding = startEndTasksData.map((seTaskItem, seTaskIndex) => {
        const { estimateNormalTime, startDate, estimateAssetCost, endDate } = seTaskItem;
        const { responsibleEmployees, accountableEmployees } = fakeRACIData[seTaskIndex];

        const responsibleSalary = responsibleEmployees.map((resItem) => {
            const currentOrgId = getOrgIdFromUserId(resItem, newResponsibleEmployeesWithUnit);
            return {
                userId: resItem,
                salary: Number(getSalaryFromUserIdAndOrgId(currentSalaries, currentEmployees, currentUsers, currentOrgId, resItem)),
                weight: Number(seTaskItem.totalResWeight) / (responsibleEmployees.length),
            }
        })
        const accountableSalary = accountableEmployees.map((accItem) => {
            const currentOrgId = getOrgIdFromUserId(accItem, newResponsibleEmployeesWithUnit);
            return {
                userId: accItem,
                salary: Number(getSalaryFromUserIdAndOrgId(currentSalaries, currentEmployees, currentUsers, currentOrgId, accItem)),
                weight: (100 - Number(seTaskItem.totalResWeight)) / (accountableEmployees.length),
            }
        })

        // Các hoạt động và Bấm giờ cho các hoạt động
        let totalTimesheetLogs = [];
        let actionsList = [];
        for (let resItem of responsibleEmployees) {
            for (let accItem of accountableEmployees) {
                let timesheetLogs = [];
                const currentActionsWithoutTimesheet = generateTaskActionsArray(resItem, accItem, 1);
                const currentActions = currentActionsWithoutTimesheet.map((cAWTItem, cAWTIndex) => {
                    const currentResWeight = responsibleSalary.find((resSalItem) => String(resSalItem.userId) === String(resItem)).weight;
                    const currentAccWeight = accountableSalary.find((accSalItem) => String(accSalItem.userId) === String(accItem)).weight;
                    const limitResDuration = Math.floor((estimateNormalTime * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS) / responsibleEmployees.length) * (currentResWeight / 100));
                    const limitAccDuration = Math.floor((estimateNormalTime * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS) / accountableEmployees.length) * (currentAccWeight / 100));
                    timesheetLogs.push(
                        generateTimesheetLogItem(resItem, limitResDuration, startDate, drugRNDProject.unitTime),
                        generateTimesheetLogItem(accItem, limitAccDuration, startDate, drugRNDProject.unitTime),
                    );
                    return {
                        ...cAWTItem,
                        timesheetLogs,
                    }
                })
                totalTimesheetLogs.push(...timesheetLogs);
                actionsList.push(...currentActions);
            }
        }

        // Chi phí công việc ước lượng + Chi phí công việc ước lượng thoả hiệp
        let estimateNormalCost = 0, estimateMaxCost = 0;
        for (let resItem of responsibleEmployees) {
            estimateNormalCost += getEstimateMemberCostOfTask(
                [...responsibleSalary, ...accountableSalary],
                estimateNormalTime * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                drugRNDProject,
                resItem
            )
        }
        for (let accItem of accountableEmployees) {
            estimateNormalCost += getEstimateMemberCostOfTask(
                [...responsibleSalary, ...accountableSalary],
                estimateNormalTime * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                drugRNDProject,
                accItem
            )
        }
        estimateNormalCost += estimateAssetCost;
        estimateMaxCost = getNearestIntegerNumber(estimateNormalCost);

        // Chi phí thực chỉ xuất hiện khi thời gian hiện tại quá thời điểm kết thúc dự kiến + Điểm số đánh giá
        let actualCost, actualEndDate, progress = 0, responsibleSalaryWithCost, accountableSalaryWithCost, status = 'inprocess';
        let overallEvaluation;
        if (moment(endDate).isSameOrBefore(moment())) {
            const isFinished = getRandomIntFromInterval(0, 1);
            // const isFinished = 1;
            progress = isFinished ? 100 : getRandomIntFromInterval(80, 100);
            actualCost = getRandomIntFromInterval(Math.floor(estimateNormalCost * 0.5), Math.floor(estimateNormalCost * 1.5));
            responsibleSalaryWithCost = responsibleSalary.map((resSalItem) => {
                const tempActualCost = actualCost * resSalItem.weight / 100;
                const resActualCost = Math.floor(tempActualCost - getRandomIntFromInterval(Math.floor(tempActualCost / 100), Math.floor(tempActualCost / 10)));
                return {
                    ...resSalItem,
                    actualCost: resActualCost,
                };
            });
            accountableSalaryWithCost = accountableSalary.map((accSalItem) => {
                const tempActualCost = actualCost * accSalItem.weight / 100;
                const accActualCost = Math.floor(tempActualCost - getRandomIntFromInterval(Math.floor(tempActualCost / 100), Math.floor(tempActualCost / 10)));
                return {
                    ...accSalItem,
                    actualCost: accActualCost,
                };
            });
            if (isFinished === 1) {
                status = 'finished';
                actualEndDate = moment(endDate).add(getRandomIntFromInterval(-25, 20), 'hours').format();
                const currentTask = {
                    ...seTaskItem,
                    progress,
                    status,
                    estimateNormalCost,
                    estimateMaxCost,
                    actualEndDate,
                    timesheetLogs: totalTimesheetLogs,
                    taskActions: actionsList,
                    actorsWithSalary: (responsibleSalaryWithCost && accountableSalaryWithCost) ? [...responsibleSalaryWithCost, ...accountableSalaryWithCost] : [...responsibleSalary, ...accountableSalary],
                    estimateNormalTime: Number(estimateNormalTime) * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                    estimateOptimisticTime: Number((estimateNormalTime - 2) < 1 ? 1 : (estimateNormalTime - 2)) * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                }
                const dataTask = {
                    task: currentTask,
                    progress,
                    currentTaskActualCost: actualCost,
                }
                const taskAutomaticPoint = calcProjectTaskPoint(dataTask);
                const resPointArr = responsibleSalaryWithCost.map((resSalWithCostItem) => {
                    const dataMemberTask = {
                        task: currentTask,
                        progress,
                        projectDetail: drugRNDProject,
                        currentMemberActualCost: resSalWithCostItem.actualCost,
                        userId: resSalWithCostItem.userId,
                    }
                    const memberAutomaticPoint = calcProjectMemberPoint(dataMemberTask);
                    return {
                        automaticPoint: memberAutomaticPoint,
                        employeePoint: getRandomIntFromInterval(80, 100),
                        accountablePoint: getRandomIntFromInterval(80, 100),
                        employee: resSalWithCostItem.userId,
                    }
                })
                const accPointArr = accountableSalaryWithCost.map((accSalWithCostItem) => {
                    const dataMemberTask = {
                        task: currentTask,
                        progress,
                        projectDetail: drugRNDProject,
                        currentMemberActualCost: accSalWithCostItem.actualCost,
                        userId: accSalWithCostItem.userId,
                    }
                    const memberAutomaticPoint = calcProjectMemberPoint(dataMemberTask);
                    return {
                        automaticPoint: memberAutomaticPoint,
                        employeePoint: getRandomIntFromInterval(80, 100),
                        employee: accSalWithCostItem.userId,
                    }
                })
                overallEvaluation = {
                    automaticPoint: taskAutomaticPoint,
                    responsibleEmployees: resPointArr,
                    accountableEmployees: accPointArr,
                }
            }
        }
        else if (moment(startDate).isSameOrBefore(moment()) && moment(endDate).isAfter(moment())) {
            progress = getRandomIntFromInterval(10, 60);
            actualCost = getRandomIntFromInterval(Math.floor(estimateNormalCost * 0.5), Math.floor(estimateNormalCost * 1.5));
            responsibleSalaryWithCost = responsibleSalary.map((resSalItem) => {
                const tempActualCost = actualCost * resSalItem.weight / 100;
                const resActualCost = Math.floor(tempActualCost - getRandomIntFromInterval(Math.floor(tempActualCost / 100), Math.floor(tempActualCost / 10)));
                return {
                    ...resSalItem,
                    actualCost: resActualCost,
                };
            });
            accountableSalaryWithCost = accountableSalary.map((accSalItem) => {
                const tempActualCost = actualCost * accSalItem.weight / 100;
                const accActualCost = Math.floor(tempActualCost - getRandomIntFromInterval(Math.floor(tempActualCost / 100), Math.floor(tempActualCost / 10)));
                return {
                    ...accSalItem,
                    actualCost: accActualCost,
                };
            });
        }

        return {
            ...seTaskItem,
            ...fakeRACIData[seTaskIndex],
            preceedingTasks: [],
            progress,
            status,
            taskActions: actionsList,
            timesheetLogs: totalTimesheetLogs,
            actorsWithSalary: (responsibleSalaryWithCost && accountableSalaryWithCost) ? [...responsibleSalaryWithCost, ...accountableSalaryWithCost] : [...responsibleSalary, ...accountableSalary],
            estimateNormalCost,
            estimateMaxCost,
            actualCost,
            actualEndDate,
            estimateNormalTime: Number(estimateNormalTime) * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            estimateOptimisticTime: Number((estimateNormalTime - 2) < 1 ? 1 : (estimateNormalTime - 2)) * (drugRNDProject.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            overallEvaluation,
        }
    })
    // console.log(startEndTasksDataWithoutPreceeding);
    const firstInsertedDBTasks = await Task(vnistDB).insertMany(startEndTasksDataWithoutPreceeding);
    // console.log('firstInsertedDBTasks', firstInsertedDBTasks)
    const fullTasksData = fakeTasksData.map((fakeItem, fakeIndex) => {
        let preceedingTasks = [];
        if (fakeItem.preceedingTasks && fakeItem.preceedingTasks.length > 0) {
            preceedingTasks = fakeItem.preceedingTasks.map((fakePreItem) => {
                const currentTaskNameFromFake = fakeTasksData.find((fakeItem) => String(fakeItem.code) === String(fakePreItem))?.name;
                const currentTaskIdFromDB = firstInsertedDBTasks.find((firstInsItem) => firstInsItem.name === currentTaskNameFromFake)?._id;
                return {
                    task: currentTaskIdFromDB,
                    link: '',
                };
            })
        }
        return {
            ...firstInsertedDBTasks[fakeIndex]._doc,
            preceedingTasks,
        }
    })
    // console.log('fullTasksData', fullTasksData)
    for (let fullItem of fullTasksData) {
        const { preceedingTasks, _id } = fullItem;
        await Task(vnistDB).findByIdAndUpdate(_id, {
            $set: {
                preceedingTasks,
            }
        }, { new: true });
    }
    // Cập nhật original estimate endDate của project
    if (moment(drugRNDProject.endDate).isBefore(moment(getLatestTaskEndDate(startEndTasksData)))) {
        await Project(vnistDB).findByIdAndUpdate(drugRNDProjectIdInDB, {
            $set: {
                endDate: getLatestTaskEndDate(startEndTasksData),
            }
        }, { new: true });
    }
    // Cập nhật original estimate budget của project
    await Project(vnistDB).findByIdAndUpdate(drugRNDProjectIdInDB, {
        $set: {
            budget: getEstimateCostOfProject(fullTasksData),
        }
    }, { new: true });

    console.log('Hoàn thành tạo dữ liệu cho dự án')
}

const getOrgIdFromUserId = (userId, newResponsibleEmployeesWithUnit) => {
    for (let unitItem of newResponsibleEmployeesWithUnit) {
        for (let userItem of unitItem.listUsers) {
            if (String(userItem.userId) === String(userId)) {
                return unitItem.unitId;
            }
        }
    }
    return undefined;
}

const getSalaryFromUserIdAndOrgId = (currentSalaries, currentEmployees, currentUsers, orgId, userId) => {
    const currentUserItem = currentUsers.find((usersItem) => String(usersItem._id) === String(userId));
    const currentEmployeeItem = currentEmployees.find((empsItem) => String(empsItem.emailInCompany) === String(currentUserItem.email));
    if (!currentEmployeeItem) return 0;
    const currentSalaryItem = currentSalaries.find((salsItem) => (
        String(salsItem.organizationalUnit) === String(orgId)
        && String(salsItem.employee) === String(currentEmployeeItem._id))
    );
    return !currentSalaryItem ? 0 : currentSalaryItem.mainSalary;
}

const getShortenArray = (array, numsOfItems = 3) => {
    if (!Array.isArray(array) || !array) return [];
    if (array.length < numsOfItems) {
        return array;
    }
    return array.filter((arrItem, arrIndex) => arrIndex < numsOfItems);
}

const handleWeekendAndWorkTime = (projectDetail, taskItem) => {
    // Nếu unitTime = 'days'
    if (projectDetail?.unitTime === 'days') {
        // Check xem startDate có phải thứ 7 hoặc chủ nhật không thì cộng thêm ngày để startDate vào ngày thứ 2 tuần sau
        let dayOfStartDate = (new Date(taskItem.startDate)).getDay();
        if (dayOfStartDate === 6) taskItem.startDate = moment(taskItem.startDate).add(2, 'days').format();
        if (dayOfStartDate === 0) taskItem.startDate = moment(taskItem.startDate).add(1, 'days').format();
        // Tách phần integer và phần decimal của estimateNormalTime
        const estimateNormalTimeArr = taskItem.estimateNormalTime.toString().split('.');
        const integerPart = Number(estimateNormalTimeArr[0]);
        const decimalPart = estimateNormalTimeArr.length === 2 ? Number(`.${estimateNormalTimeArr[1]}`) : undefined;
        let tempEndDate = '';
        // Cộng phần nguyên
        for (let i = 0; i < integerPart; i++) {
            // Tính tempEndDate = + 1 ngày trước để kiểm tra
            if (i === 0) {
                tempEndDate = moment(taskItem.startDate).add(1, 'days').format();
            } else {
                tempEndDate = moment(taskItem.endDate).add(1, 'days').format();
            }
            // Nếu tempEndDate đang là thứ 7 thì công thêm 2 ngày
            if ((new Date(tempEndDate)).getDay() === 6) {
                taskItem.endDate = moment(tempEndDate).add(2, 'days').format();
            }
            // Nếu tempEndDate đang là chủ nhật thì công thêm 1 ngày
            else if ((new Date(tempEndDate)).getDay() === 0) {
                taskItem.endDate = moment(tempEndDate).add(1, 'days').format();
            }
            // Còn không thì không cộng gì
            else {
                taskItem.endDate = tempEndDate;
            }
        }
        // Cộng phần thập phân (nếu có)
        if (decimalPart) {
            if (!taskItem.endDate) {
                taskItem.endDate = moment(taskItem.startDate).add(decimalPart, 'days').format();
            } else {
                taskItem.endDate = moment(taskItem.endDate).add(decimalPart, 'days').format();
            }
            // Check xem endDate hiện tại là thứ mấy => Cộng tiếp để bỏ qua thứ 7 và chủ nhật (nếu có)
            dayOfStartDate = (new Date(taskItem.endDate)).getDay();
            if (dayOfStartDate === 6) taskItem.endDate = moment(taskItem.endDate).add(2, 'days').format();
            if (dayOfStartDate === 0) taskItem.endDate = moment(taskItem.endDate).add(1, 'days').format();
        }
        return taskItem;
    }

    // Nếu unitTime = 'hours'
    const dailyMorningStartTime = moment('08:00', 'HH:mm');
    const dailyMorningEndTime = moment('12:00', 'HH:mm');
    const dailyAfternoonStartTime = moment('13:30', 'HH:mm');
    const dailyAfternoonEndTime = moment('17:30', 'HH:mm');
    // Check xem startDate có phải thứ 7 hoặc chủ nhật không thì cộng thêm ngày để startDate vào ngày thứ 2 tuần sau
    let dayOfStartDate = (new Date(taskItem.startDate)).getDay();
    if (dayOfStartDate === 6) taskItem.startDate = moment(taskItem.startDate).add(2, 'days').format();
    if (dayOfStartDate === 0) taskItem.startDate = moment(taskItem.startDate).add(1, 'days').format();
    // Tách phần integer và phần decimal của estimateNormalTime
    const estimateNormalTimeArr = taskItem.estimateNormalTime.toString().split('.');
    const integerPart = Number(estimateNormalTimeArr[0]);
    const decimalPart = estimateNormalTimeArr.length === 2 ? Number(`.${estimateNormalTimeArr[1]}`) : undefined;
    let tempEndDate = '';
    // Cộng phần nguyên
    for (let i = 0; i < integerPart; i++) {
        // Tính tempEndDate = + 1 tiêng trước để kiểm tra
        if (i === 0) {
            tempEndDate = moment(taskItem.startDate).add(1, 'hours').format();
        } else {
            tempEndDate = moment(taskItem.endDate).add(1, 'hours').format();
        }
        const currentEndDateInMomentHourMinutes = moment(moment(tempEndDate).format('HH:mm'), 'HH:mm');
        // Nếu đang ở giờ nghỉ trưa
        if (currentEndDateInMomentHourMinutes.isAfter(dailyMorningEndTime) && currentEndDateInMomentHourMinutes.isBefore(dailyAfternoonStartTime)) {
            tempEndDate = moment(tempEndDate).set({
                hour: 13,
                minute: 30,
            });
            tempEndDate = moment(tempEndDate).add(1, 'hours').format();
        }
        // Nếu quá 17:30
        else if (currentEndDateInMomentHourMinutes.isAfter(dailyAfternoonEndTime)) {
            tempEndDate = moment(tempEndDate).set({
                hour: 8,
                minute: 0,
            });
            tempEndDate = moment(tempEndDate).add(1, 'hours').format();
            tempEndDate = moment(tempEndDate).add(1, 'days').format();
        }
        // Nếu tempEndDate đang là thứ 7 thì công thêm 2 ngày
        if ((new Date(tempEndDate)).getDay() === 6) {
            taskItem.endDate = moment(tempEndDate).add(2, 'days').format();
        }
        // Nếu tempEndDate đang là chủ nhật thì công thêm 1 ngày
        else if ((new Date(tempEndDate)).getDay() === 0) {
            taskItem.endDate = moment(tempEndDate).add(1, 'days').format();
        }
        // Còn không thì không cộng gì
        else {
            taskItem.endDate = tempEndDate;
        }
    }
    // Cộng phần thập phân (nếu có)
    if (decimalPart) {
        if (!taskItem.endDate) {
            taskItem.endDate = moment(taskItem.startDate).add(decimalPart, 'hours').format();
        } else {
            taskItem.endDate = moment(taskItem.endDate).add(decimalPart, 'hours').format();
        }
        // Check xem endDate hiện tại là thứ mấy => Cộng tiếp để bỏ qua thứ 7 và chủ nhật (nếu có)
        dayOfStartDate = (new Date(taskItem.endDate)).getDay();
        if (dayOfStartDate === 6) taskItem.endDate = moment(taskItem.endDate).add(2, 'days').format();
        if (dayOfStartDate === 0) taskItem.endDate = moment(taskItem.endDate).add(1, 'days').format();
    }
    return taskItem;
}

const processDataTasksStartEnd = (projectDetail, currentTasksData) => {
    if (!currentTasksData || currentTasksData.length === 0) return [];
    const tempTasksData = [...currentTasksData];
    // console.log('tempTasksData', tempTasksData)
    // Lặp mảng tasks
    for (let taskItem of tempTasksData) {
        // console.log(taskItem.name, taskItem.startDate, taskItem.endDate)
        if (taskItem.estimateNormalTime > 20) {
            console.error('Estimate normal time đang quá lớn: ', taskItem.estimateNormalTime);
        }
        if (taskItem.preceedingTasks.length === 0 && (!taskItem.startDate || !taskItem.endDate)) {
            taskItem.startDate = taskItem.startDate || projectDetail?.startDate;
            taskItem = handleWeekendAndWorkTime(projectDetail, taskItem);
        }
        else {
            // Lặp mảng preceedingTasks của taskItem hiện tại
            for (let preceedingItem of taskItem.preceedingTasks) {
                const currentPreceedingTaskItem = tempTasksData.find(item => {
                    // chỗ này quan trọng nhất là .code
                    if (typeof preceedingItem === 'string') {
                        return String(item.code) === String(preceedingItem).trim();
                    }
                    return String(item.code) === String(preceedingItem.task);
                });
                if (currentPreceedingTaskItem && (
                    !taskItem.startDate ||
                    moment(taskItem.startDate)
                        .isBefore(moment(currentPreceedingTaskItem.endDate))
                )) {
                    taskItem.startDate = currentPreceedingTaskItem.endDate;
                }
                taskItem = handleWeekendAndWorkTime(projectDetail, taskItem);
            }
        }
    }
    // console.log('tempTasksData', tempTasksData);
    return tempTasksData;
}

const getRandomUsersFromUnit = (array, numOfItems) => {
    let resultArr = [];
    if (array.length < numOfItems) return [];
    if (array.length === numOfItems) return array;
    let currentArray = [...array];
    for (let i = 0; i < numOfItems; i++) {
        const currentIndex = Math.floor(Math.random() * currentArray.length);
        resultArr.push(currentArray[currentIndex]);
        currentArray.splice(currentIndex, 1)
    }
    return resultArr;
}

const getLatestTaskEndDate = (currentProjectTasks, needCustomFormat = false) => {
    if (!currentProjectTasks || currentProjectTasks.length === 0) return undefined;
    let currentEndDate = currentProjectTasks[0].endDate;
    for (let taskItem of currentProjectTasks) {
        if (moment(taskItem.endDate).isAfter(moment(currentEndDate))) {
            currentEndDate = taskItem.endDate;
        }
    }
    return needCustomFormat ? moment(currentEndDate).format('HH:mm DD/MM/YYYY') : moment(currentEndDate).format();
}

const generateTaskActionsArray = (resId, accId, numOfActions = 3) => {
    if (numOfActions === 0) return [];
    let tasksActions = [];
    for (let i = 0; i < numOfActions; i++) {
        const rating = getRandomIntFromInterval(5, 10);
        const actionImportanceLevel = getRandomIntFromInterval(5, 10);
        const action = {
            mandatory: true,
            rating,
            actionImportanceLevel,
            creator: resId,
            description: `<p>Hoạt động ${i} - người tạo ${resId}</p>`,
            evaluations: [{
                rating,
                actionImportanceLevel,
                creator: accId,
                role: 'accountable',
            }]
        }
        tasksActions.push(action);
    }
    return tasksActions;
}

const generateTimesheetLogItem = (creatorId, duration, startedAt, timeMode = 'days') => {
    const randomDuration = getRandomIntFromInterval(100, Number(duration));
    const formattedRandomDuration = Number(randomDuration) / (timeMode === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS);
    return {
        creator: creatorId,
        autoStopped: 1,
        acceptLog: true,
        description: '',
        duration: randomDuration,
        startedAt,
        stoppedAt: moment(startedAt).add(formattedRandomDuration, timeMode).format(),
    }
}

const getEstimateMemberCostOfTask = (actorsWithSalary, estimateNormalTime, projectDetail, userId) => {
    let estimateNormalMemberCost = 0;
    if (!projectDetail) return 0;
    const currentEmployee = actorsWithSalary.find((actorSalaryItem) => {
        return String(actorSalaryItem.userId) === String(userId)
    });
    if (currentEmployee) {
        estimateNormalMemberCost = Number(currentEmployee.salary) * Number(currentEmployee.weight / 100) * estimateNormalTime
            / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS);
    }
    return estimateNormalMemberCost;
}

const getNearestIntegerNumber = (value) => {
    const beforeDecimalPart = value.toString().split('.')[0].replace(/,/g, '');
    const beforeDecimalPartArr = beforeDecimalPart.split('');
    const numberWithFirstSecondIndexArr = beforeDecimalPartArr.map((item, index) => {
        if (index === 0 || index === 1) return item
        else return "0";
    })
    const numberWithFirstSecondIndex = numberWithFirstSecondIndexArr.join('');
    const result = Number(numberWithFirstSecondIndex) + Math.pow(10, beforeDecimalPart.length - 2);
    return result;
}

const getRandomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const calcProjectTaskPoint = (data, getCalcPointsOnly = true) => {
    // console.log('\n--------------');
    const { task, progress, currentTaskActualCost } = data;
    const { timesheetLogs, estimateNormalCost } = task;
    /***************** Yếu tố tiến độ **********************/
    const usedDuration = getDurationWithoutSatSun(task.startDate, task.actualEndDate, 'milliseconds');
    const totalDuration = task.estimateNormalTime;
    const schedulePerformanceIndex = (Number(progress) / 100) / (usedDuration / totalDuration);
    const taskTimePoint = convertIndexPointToNormalPoint(schedulePerformanceIndex) * (task?.timeWeight || 0.25);
    // console.log('taskTimePoint', taskTimePoint)
    /***************** Yếu tố chất lượng **********************/
    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá của người phê duyệt)
    let actionsHasRating = task.taskActions.filter(item => (
        item.rating && item.rating !== -1
    ))
    let sumRatingOfPassedActions = 0, sumRatingOfAllActions = 0;
    actionsHasRating.length > 0 && actionsHasRating.map((item) => {
        const currentActionImportanceLevel = item.actionImportanceLevel && item.actionImportanceLevel > 0 ? item.actionImportanceLevel : 10;
        if (item.rating >= 5) {
            sumRatingOfPassedActions = sumRatingOfPassedActions + item.rating * currentActionImportanceLevel;
        }
        sumRatingOfAllActions = sumRatingOfAllActions + item.rating * currentActionImportanceLevel;
    });
    const taskQualityPoint = sumRatingOfAllActions === 0
        ? 0
        : [(sumRatingOfPassedActions / sumRatingOfAllActions) * 100] * (task?.qualityWeight || 0.25);
    // console.log('taskQualityPoint', taskQualityPoint)
    /***************** Yếu tố chi phí **********************/
    let actualCost = 0;
    if (currentTaskActualCost) actualCost = Number(currentTaskActualCost);
    else if (task?.actualCost) actualCost = Number(task.actualCost);
    const costPerformanceIndex = ((Number(progress) / 100) * estimateNormalCost) / (actualCost);
    const taskCostPoint = convertIndexPointToNormalPoint(costPerformanceIndex) * (task?.costWeight || 0.25);
    // console.log('taskCostPoint', taskCostPoint)
    /***************** Yếu tố chuyên cần **********************/
    let totalTimeLogs = 0;
    if (timesheetLogs && timesheetLogs.length > 0) {
        for (let timeSheetItem of timesheetLogs) {
            totalTimeLogs += timeSheetItem.duration;
        }
    }
    const taskDilligencePoint = Math.min((totalTimeLogs / totalDuration) * 100 * (task?.dilligenceWeight || 0.25), 100);
    // console.log('taskDilligencePoint', taskDilligencePoint)
    const autoTaskPoint = taskTimePoint + taskQualityPoint + taskCostPoint + taskDilligencePoint;

    if (getCalcPointsOnly) return autoTaskPoint;
    return {
        usedDuration,
        totalDuration,
        schedulePerformanceIndex,
        actionsHasRating,
        sumRatingOfPassedActions,
        sumRatingOfAllActions,
        estimateNormalCost,
        actualCost,
        costPerformanceIndex,
        totalTimeLogs,
        taskTimePoint,
        taskQualityPoint,
        taskCostPoint,
        taskDilligencePoint,
        autoTaskPoint,
    }
}

const calcProjectMemberPoint = (data, getCalcPointsOnly = true) => {
    // console.log('\n--------------');
    const { task, progress, projectDetail, currentMemberActualCost, userId } = data;
    const { timesheetLogs } = task;
    const currentEmployee = task.actorsWithSalary.find((actorSalaryItem) => {
        return String(actorSalaryItem.userId) === String(userId)
    });
    /***************** Yếu tố tiến độ **********************/
    const usedDuration = getDurationWithoutSatSun(task.startDate, task.actualEndDate, 'milliseconds');
    const totalDuration = task.estimateNormalTime;
    const schedulePerformanceIndex = (Number(progress) / 100) / (usedDuration / totalDuration);
    const memberTimePoint = convertIndexPointToNormalPoint(schedulePerformanceIndex) * (task?.timeWeight || 0.25);
    // console.log('memberTimePoint', memberTimePoint)
    /***************** Yếu tố chất lượng **********************/
    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá của người phê duyệt)
    let actionsHasRating = task.taskActions.filter(item => (
        item.rating && item.rating !== -1
    ))
    let sumRatingOfPassedActions = 0, sumRatingOfAllActions = 0;
    actionsHasRating.length > 0 && actionsHasRating.map((item) => {
        const currentActionImportanceLevel = item.actionImportanceLevel && item.actionImportanceLevel > 0 ? item.actionImportanceLevel : 10;
        if (item.rating >= 5) {
            sumRatingOfPassedActions = sumRatingOfPassedActions + item.rating * currentActionImportanceLevel;
        }
        sumRatingOfAllActions = sumRatingOfAllActions + item.rating * currentActionImportanceLevel;
    });
    const memberQualityPoint = sumRatingOfAllActions === 0
        ? 0
        : [(sumRatingOfPassedActions / sumRatingOfAllActions) * 100] * (task?.qualityWeight || 0.25);
    // console.log('memberQualityPoint', memberQualityPoint)
    /***************** Yếu tố chi phí **********************/
    let actualCost = 0;
    if (currentMemberActualCost) actualCost = Number(currentMemberActualCost);
    // Tìm lương và trọng số thành viên đó
    let estimateNormalMemberCost = getEstimateMemberCostOfTask(task.actorsWithSalary, totalDuration, projectDetail, userId);
    const costPerformanceIndex = ((Number(progress) / 100) * estimateNormalMemberCost) / (actualCost);
    const memberCostPoint = convertIndexPointToNormalPoint(costPerformanceIndex) * (task?.costWeight || 0.25);
    // console.log('memberCostPoint', memberCostPoint)
    /***************** Yếu tố chuyên cần **********************/
    let totalTimeLogs = 0;
    for (let timeSheetItem of timesheetLogs) {
        if (String(userId) === String(timeSheetItem.creator)) {
            totalTimeLogs += timeSheetItem.duration;
        }
    }
    const memberDilligencePoint = Math.min((totalTimeLogs / (totalDuration * Number(currentEmployee.weight / 100))) * 100 * (task?.dilligenceWeight || 0.25), 100);
    // console.log('memberDilligencePoint', memberDilligencePoint)
    let autoMemberPoint = memberTimePoint + memberQualityPoint + memberCostPoint + memberDilligencePoint;
    console.log('\n')

    if (getCalcPointsOnly) return autoMemberPoint;
    return {
        usedDuration,
        totalDuration,
        schedulePerformanceIndex,
        actionsHasRating,
        sumRatingOfPassedActions,
        sumRatingOfAllActions,
        estimateNormalMemberCost,
        actualCost,
        costPerformanceIndex,
        totalTimeLogs,
        memberTimePoint,
        memberQualityPoint,
        memberCostPoint,
        memberDilligencePoint,
        autoMemberPoint,
    }
}

const getDurationWithoutSatSun = (startDate, endDate, timeMode) => {
    const numsOfSaturdays = getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 6)
    const numsOfSundays = getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 0)
    let duration = 0
    if (timeMode === 'hours') {
        duration = (moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays) * 8;
        // return theo don vi giờ - hours
        return duration;
    }
    if (timeMode === 'milliseconds') {
        duration = (moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays);
        // return theo don vi milliseconds
        return duration * MILISECS_TO_DAYS;
    }
    duration = moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays;
    // return theo don vi ngày - days
    return duration;
}

const getNumsOfDaysWithoutGivenDay = (startDate, endDate, givenDay) => {
    let numberOfDates = 0
    while (startDate < endDate) {
        if (startDate.getDay() === givenDay) {
            numberOfDates++
        }
        startDate.setDate(startDate.getDate() + 1)
    }
    return numberOfDates
}

const convertIndexPointToNormalPoint = (indexPoint) => {
    if (!indexPoint || indexPoint === Infinity || Number.isNaN(indexPoint) || indexPoint < 0.5) return 0;
    else if (indexPoint >= 0.5 && indexPoint < 0.75) return 40;
    else if (indexPoint >= 0.75 && indexPoint < 1) return 60;
    else if (indexPoint >= 1 && indexPoint < 1.25) return 80;
    else if (indexPoint >= 1.25 && indexPoint < 1.5) return 90;
    else return 100;
}

const getEstimateCostOfProject = (currentProjectTasks) => {
    if (!currentProjectTasks || currentProjectTasks.length === 0) return 0;
    let estCost = 0;
    for (let taskItem of currentProjectTasks) {
        estCost += Number(taskItem.estimateNormalCost)
    }
    return estCost;
}

initHumanResourceForProjectData().catch((err) => {
    console.log(err);
    process.exit(0);
});