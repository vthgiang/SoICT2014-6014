// Thêm nhiều dữ liệu mẫu để test chức năng quản lý nhân sự
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
  CareerPosition,
  Certificate,
  Major,
  Tag,
  BiddingContract,
  BiddingPackage,
  ProjectTemplate,
} = require("../models");

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

const currentYear = new Date().getFullYear();
const beforCurrentYear = new Date().getFullYear() - 1;
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

const initHumanResourceData = async () => {
  console.log("Add more human resource database, ...");

  /**
   * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
   */
  let connectOptions =
    process.env.DB_AUTHENTICATION === "true"
      ? {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
      }
      : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      };
  const systemDB = mongoose.createConnection(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/${process.env.DB_NAME
    }`,
    connectOptions
  );

  let connectVNISTOptions =
    process.env.DB_AUTHENTICATION === "true"
      ? {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
      }
      : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      };
  const vnistDB = mongoose.createConnection(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/vnist`,
    connectVNISTOptions
  );

  if (!systemDB) throw "DB vnist cannot connect";
  console.log("DB vnist connected");

  if (!vnistDB) throw "DB vnist cannot connect";
  console.log("DB vnist connected");

  /**
   * 1.1 Khởi tạo model cho db
   */
  const initModels = (db) => {
    console.log("models", db.models);

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

    console.log("models_list", db.models);
  };

  initModels(vnistDB);
  initModels(systemDB);

  /**
   * 1.3. Lấy dữ liệu về công ty VNIST trong database của hệ thống
   */
  const vnist = await Company(systemDB).findOne({
    shortName: "vnist",
  });

  /**
   * 2. Thêm các tài khoản người dùng trong csdl của công ty VNIST
   */
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync("vnist123@", salt);

  let usersFake = [];
  for (let i = 0; i <= 200; i++) {
    if (i <= 100) {
      let name = randomDateNameMale();
      usersFake = [
        ...usersFake,
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
      usersFake = [
        ...usersFake,
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
  const users = await User(vnistDB).insertMany(usersFake);

  const users1 = await User(vnistDB).insertMany([
    {
      // 1
      name: "Lê Thống Nhất",
      email: "lethongnhat.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 2
      name: "Nguyễn Văn thanh",
      email: "nguyenvanthanh.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 3
      name: "Nguyễn Viết Đảng",
      email: "nguyenvietdang.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 4
      name: "Đỗ Văn Dương",
      email: "dovanduong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 5
      name: "Đào Xuân Hướng",
      email: "daoxuanhuong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 6
      name: "Đào Quang Phương",
      email: "daoquangphuong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 7
      name: "Vũ Mạnh Cường",
      email: "vumanhcuong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 8
      name: "Trần Văn Cường",
      email: "tranvancuong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 9
      name: "Dương Thị Thanh Thuỳ",
      email: "duongthithanhthuy.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 10
      name: "Nguyễn Thị huệ",
      email: "nguyenthihue.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 11
      name: "Vũ Viết Xuân",
      email: "vuvietxuan.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 12
      name: "Trần Thị Thu Phương",
      email: "tranthithuphuong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 13
      name: "Bùi Thị Mai",
      email: "buithimai.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 14
      name: "Nguyễn Lương Thử",
      email: "nguyenluongthu.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 15
      name: "Lưu Quang Ngọc",
      email: "luuquangngoc.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 16
      name: "Hoàng Văn Tùng",
      email: "hoangvantung.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 17
      name: "Nguyễn Văn Hải",
      email: "nguyenvanhai.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 18
      name: "Trần Văn Sơn",
      email: "tranvanson.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 19
      name: "Mai Thuỳ Dung",
      email: "maithuydung.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 20
      name: "Nguyễn Thống Nhất",
      email: "nguyenthongnhat.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 21
      name: "Trần Kim Cương",
      email: "trankimcuong.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 22
      name: "Nguyễn Đình Thuận",
      email: "nguyendinhthuan.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 23
      name: "Ngô Tri Dũng",
      email: "ngotridung.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
    {
      // 24
      name: "Nguyễn Khắc Đại",
      email: "nguyenkhacdai.vnist@gmail.com",
      password: hash,
      company: vnist._id,
    },
  ]);

  console.log("Dữ liệu tài khoản người dùng cho công ty VNIST", users);

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
  ]);

  const majors = await Major(vnistDB).find({})

  const careerPositions = await CareerPosition(vnistDB).insertMany([
    {
      // 1
      name: "Trưởng nhóm quản lí dự án",
      code: "TNQLDA",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 2
      name: "Nhân sự quản lí",
      code: "NSQL",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 3
      name: "Quản trị dự án 1 (Kỹ sư bậc 5)",
      code: "QTDA1",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 4
      name: "Trưởng nhóm triển khai dự án",
      code: "TNTKDA",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 5
      name: "Nhân sự triển khai",
      code: "NSTK",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 6
      name: "Cán bộ bảo trì, hướng dẫn sử dụng",
      code: "CBBTHDSD",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 7
      name: "Trưởng nhóm kỹ thuật",
      code: "TNKT",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 8
      name: "Nhân sự kĩ thuật",
      code: "NSKT",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 9
      name: "Khảo sát và phân tích(Kỹ sư bậc 3)",
      code: "KSVPT",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 10
      name: "Thiết kế: Cán bộ thiết kế 1 (Kỹ sư bậc 4)",
      code: "CBTK1",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 11
      name: "Nhân sự kiểm soát chất lượng",
      code: "NSKSCL",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 12
      name: "Cán bộ tài chính pháp lý",
      code: "CBHCPL",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 13
      name: "Kiểm thử",
      code: "KT",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 14
      name: "Cán bộ phụ trách bảo hành thiết bị",
      code: "CBPTBHTB",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
    {
      // 15
      name: "Cán bộ tham gia triển khai dự án",
      code: "CBTG",
      otherNames: "Quản lí dự án",
      description: vnist._id,
    },
  ]);

  const certificates = await Certificate(vnistDB).find({})

  /**
   * 3. Tạo thêm các role mặc định cho công ty vnist
   */
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
    name: "Nhân viên phòng Maketing & NCPT sản phẩm",
    type: roleChucDanh._id,
  });
  const phoPhongMaketing = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, nvPhongMaketing._id],
    name: "Phó phòng Maketing & NCPT sản phẩm",
    type: roleChucDanh._id,
  });
  const truongPhongMaketing = await Role(vnistDB).create({
    parents: [roleManager._id, nvPhongMaketing._id, phoPhongMaketing._id],
    name: "Trưởng phòng Maketing & NCPT sản phẩm",
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

  console.log("Dữ liệu các phân quyền cho công ty VNIST");

  /**
   * 4. Gán phân quyền cho các vị trí trong công ty
   */
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
  let UserRoleFake = [];
  for (let i = 0; i <= 200; i++) {
    let index = Math.floor(Math.random() * 9);
    let unit = phongBan[index];
    UserRoleFake = [
      ...UserRoleFake,
      {
        userId: users[i]._id,
        roleId: unit._id,
      },
    ];
    usersFake[i] = { ...usersFake[i], organizationalUnit: index };
  }
  await UserRole(vnistDB).insertMany(UserRoleFake);

  await UserRole(vnistDB).insertMany([
    {
      // Nhân viên phòng Maketing & NCPT sản phẩm
      userId: users1[1]._id,
      roleId: nvPhongMaketing._id,
    },
    {
      // Phó phòng Maketing & NCPT sản phẩm
      userId: users1[2]._id,
      roleId: phoPhongMaketing._id,
    },
    {
      // Trưởng phòng Maketing & NCPT sản phẩm
      userId: users1[3]._id,
      roleId: truongPhongMaketing._id,
    },
    {
      // Nhân viên phòng kiểm soát nội bộ
      userId: users1[4]._id,
      roleId: nvPhongKS._id,
    },
    {
      // Phó phòng kiểm soát nội bộ
      userId: users1[5]._id,
      roleId: phoPhongKS._id,
    },
    {
      // Trưởng phòng kiểm soát nội bộ
      userId: users1[6]._id,
      roleId: truongPhongKS._id,
    },
    {
      // Nhân viên phòng quản trị nhân sự
      userId: users1[7]._id,
      roleId: nvPhongQTNS._id,
    },
    {
      // Phó phòng quản trị nhân sự
      userId: users1[8]._id,
      roleId: phoPhongQTNS._id,
    },
    {
      // Trưởng phòng quản trị nhân sự
      userId: users1[9]._id,
      roleId: truongPhongQTNS._id,
    },
    {
      // Nhân viên phòng quản trị mục tiêu
      userId: users1[10]._id,
      roleId: nvPhongQTMT._id,
    },
    {
      // Phó phòng quản trị mục tiêu
      userId: users1[11]._id,
      roleId: phoPhongQTMT._id,
    },
    {
      // Trưởng phòng quản trị mục tiêu
      userId: users1[12]._id,
      roleId: truongPhongQTMT._id,
    },
    {
      // Nhân viên phòng quản trị hành chính nhân sự
      userId: users1[13]._id,
      roleId: nvPhongQTHCNS._id,
    },

    {
      // Phó phòng quản trị hành chính nhân sự
      userId: users1[14]._id,
      roleId: phoPhongQTHCNS._id,
    },
    {
      // TTrưởng phòng quản trị hành chính nhân sự
      userId: users1[15]._id,
      roleId: truongPhongQTHCNS._id,
    },
    {
      // Nhân viên phòng hậu cần - tư vấn
      userId: users1[16]._id,
      roleId: nvPhongHCHT._id,
    },
    {
      // Phó phòng hậu cần - tư vấn
      userId: users1[17]._id,
      roleId: phoPhongHCHT._id,
    },
    {
      // Trưởng phòng hậu cần - tư vấn
      userId: users1[18]._id,
      roleId: truongPhongHCHT._id,
    },
    {
      // Nhân viên phòng tài chính kế toán
      userId: users1[19]._id,
      roleId: nvPhongTCKT._id,
    },
    {
      // Phó phòng tài chính kế toán
      userId: users1[20]._id,
      roleId: phoPhongTCKT._id,
    },
    {
      // Trưởng phòng tài chính kế toán
      userId: users1[21]._id,
      roleId: truongPhongTCKT._id,
    },
    {
      // Nhân viên phòng kế toán doanh nghiệp
      userId: users1[22]._id,
      roleId: nvPhongKTDN._id,
    },
    {
      // Phó phòng kế toán doanh nghiệp
      userId: users1[23]._id,
      roleId: phoPhongKTDN._id,
    },
    {
      // Trưởng phòng kế toán doanh nghiệp
      userId: users1[15]._id,
      roleId: truongPhongKTDN._id,
    },
    {
      // Nhân viên phòng kế toán bán hàng
      userId: users1[22]._id,
      roleId: nvPhongKTBH._id,
    },
    {
      // Phó phòng kế toán bán hàng
      userId: users1[23]._id,
      roleId: phoPhongKTBH._id,
    },
    {
      // Trưởng phòng kế toán bán hàng
      userId: users1[17]._id,
      roleId: truongPhongKTBH._id,
    },
  ]);

  /**
   * 5. Tạo thêm dữ liệu các phòng ban cho công ty VNIST
   */
  const Directorate = await OrganizationalUnit(vnistDB).findOne({
    // Khởi tạo ban giám đốc công ty
    name: "Ban giám đốc",
  });
  const departments = await OrganizationalUnit(vnistDB).findOne({
    name: "Bộ phận kinh doanh",
  });

  const phongMaketing = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: "Phòng Maketing & NCPT sản phẩm",
      description:
        "Phòng Maketing & NCPT sản phẩm Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
      managers: [truongPhongMaketing._id],
      deputyManagers: [phoPhongMaketing._id],
      employees: [nvPhongMaketing._id],
      parent: Directorate._id,
    },
  ]);
  console.log("***", phongMaketing);

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

  console.log("Đã tạo dữ liệu phòng ban: ", Directorate, departments);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN CHO CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  let staffFake = [];
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
  usersFake.forEach((x, index) => {
    let contractEndDate = new Date(
      `${index < 50 ? currentYear : currentYear - 1}-${months[Math.floor(Math.random() * 12)]
      }-${days[Math.floor(Math.random() * 19)]}`
    );
    staffFake = [
      ...staffFake,
      {
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: x.name,
        employeeNumber: `MS${2020100 + index}`,
        status: 70 <= index && index <= 120 ? "leave" : "active",
        company: vnist._id,
        employeeTimesheetId: `CC${100 + index}`,
        gender: index <= 100 ? "male" : "female",
        startingDate: new Date(
          `${index < 70
            ? currentYear - 1
            : index > 120
              ? currentYear
              : currentYear - 2
          }-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
          }`
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
        emergencyContactPersonAddress: "Tạ Quang Bửu - Hai Bà Trưng- Hà Nội",
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
        professionalSkill: professionalSkill[Math.floor(Math.random() * 8)],
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
            major: majors[Math.floor(Math.random() * 12)]._id,
            degreeQualification: Math.floor(Math.random() * 6) + 1,
            degreeType: "good",
          },
        ],
        certificates: [
          {
            certificate: certificates[Math.floor(Math.random() * 10)]._id,
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: new Date(`${currentYear}-01-25`),
            endDate: new Date(`${currentYear}-12-25`),
          },
          {
            certificate: certificates[Math.floor(Math.random() * 10)]._id,
            name: "PHP 1",
            issuedBy: "Hà Nội",
            startDate: new Date(`${currentYear}-01-25`),
            endDate: new Date(`${currentYear}-12-25`),
          },
          {
            certificate: certificates[Math.floor(Math.random() * 10)]._id,
            name: "PHP 2",
            issuedBy: "Hà Nội",
            startDate: new Date(`${currentYear}-01-25`),
            endDate: new Date(`${currentYear}-12-25`),
          },
          {
            certificate: certificates[Math.floor(Math.random() * 10)]._id,
            name: "PHP 3",
            issuedBy: "Hà Nội",
            startDate: new Date(`${currentYear}-01-25`),
            endDate: new Date(`${currentYear}-12-25`),
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
        careerPositions: [
          {
            careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
            company: "Vnist",
            startDate: new Date(
              `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
            endDate: new Date(
              `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
          },
          {
            careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
            company: "Vnist",
            startDate: new Date(
              `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
            endDate: new Date(
              `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
          },
          {
            careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
            company: "Vnist",
            startDate: new Date(
              `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
            endDate: new Date(
              `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
          },
          {
            careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
            company: "Vnist",
            startDate: new Date(
              `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
            endDate: new Date(
              `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
          },
          {
            careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
            company: "Vnist",
            startDate: new Date(
              `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
            endDate: new Date(
              `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
              }`
            ),
          },
        ],
        biddingPackages: [
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
  let employeesFake = await Employee(vnistDB).insertMany(staffFake);
  let employees = await Employee(vnistDB).insertMany([
    {
      // user 1
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Lê Thống Nhất",
      employeeNumber: "MS202015",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`${currentYear}-02-19`),
      birthdate: new Date("1982-05-15"),
      birthplace: "Hải An - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "lethongnhat.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "102298653",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tranhungcuong@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hungkaratedo@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Văn Tài",
      relationWithEmergencyContactPerson: "Em trai",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "tai@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
      permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Nam Định",
      permanentResidenceDistrict: "Hải Hậu",
      permanentResidenceWard: "Hải Phương",
      temporaryResidence: "ngõ Trại Cá phường Trương Định",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "700 Toeic",
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12315",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP 2",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 2
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Văn Thanh",
      employeeNumber: "MS202016",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12316",
      gender: "male",
      startingDate: new Date(`${currentYear}-02-19`),
      birthdate: new Date("1994-10-17"),
      birthplace: "Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyenvanthanh.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "10229865323",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tranhung@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hungkara@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Văn Tú",
      relationWithEmergencyContactPerson: "Em trai",
      emergencyContactPersonPhoneNumber: 962586256,
      emergencyContactPersonEmail: "cuong12@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Xuân Trường - Nam Định",
      permanentResidence: "Hải Hậu - Nam Định",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Nam Định",
      permanentResidenceDistrict: "Hải Hậu",
      permanentResidenceWard: "Hải Phương",
      temporaryResidence: "Trương Định",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "750 Toeic",
      professionalSkill: "master_degree",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 3
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Viết Đảng",
      employeeNumber: "MS202017",
      status: "leave",
      company: vnist._id,
      employeeTimesheetId: "12319",
      gender: "male",
      startingDate: new Date(`${currentYear}-03-19`),
      leavingDate: new Date(`${currentYear}-09-19`),
      birthdate: new Date("1972-08-17"),
      birthplace: "Hà Nội",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Hà Nội",
      emailInCompany: "nguyenvietdang.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "10229253",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tran@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hung@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Thị Mai",
      relationWithEmergencyContactPerson: "Em gái",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "mai@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Hai Bà Trưng - Hà Nội",
      permanentResidence: "Hai Bà Trưng  - Hà Nội",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Hà Nội",
      permanentResidenceDistrict: "Hai Bà Trưng",
      permanentResidenceWard: "Bạch Mai",
      temporaryResidence: "ngách 53/1 ngõ Trại Cá phường Trương Định",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "595 Toeic",
      professionalSkill: "colleges",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hai Bà Trưng",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 4
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Đỗ Văn Dương",
      employeeNumber: "MS202018",
      status: "leave",
      company: vnist._id,
      employeeTimesheetId: "12319",
      gender: "male",
      startingDate: new Date(`${currentYear}-04-19`),
      leavingDate: new Date(`${currentYear}-10-19`),
      birthdate: new Date("1986-05-03"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "dovanduong.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "102298653",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tran153@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hung3101998@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Văn Tình",
      relationWithEmergencyContactPerson: "Em trai",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "tinh@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
      permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Nam Định",
      permanentResidenceDistrict: "Hải Hậu",
      permanentResidenceWard: "Hải Phương",
      temporaryResidence: "ngõ Trại Cá phường Trương Định",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "500 Toeic",
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 5
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Đào Xuân Hướng",
      employeeNumber: "MS202019",
      status: "leave",
      company: vnist._id,
      employeeTimesheetId: "12319",
      gender: "male",
      startingDate: new Date(`${currentYear}-02-19`),
      leavingDate: new Date(`${currentYear}-08-19`),
      birthdate: new Date("1993-02-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "daoxuanhuong.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "102298653",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tranhung@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hungkarate@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Văn Sơn",
      relationWithEmergencyContactPerson: "Em trai",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "sơn@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Hà Nam",
      permanentResidence: "Hà Nam",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Nam Định",
      permanentResidenceDistrict: "Hải Hậu",
      permanentResidenceWard: "Hải Phương",
      temporaryResidence: "số nhà 14 Phùng Khoang",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Nam Từ Liêm",
      temporaryResidenceWard: "Phùng Khoang",
      educationalLevel: "12/12",
      foreignLanguage: "900 Toeic",
      professionalSkill: "intermediate_degree",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 6
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Đào Quang Phương",
      employeeNumber: "MS202020",
      status: "leave",
      company: vnist._id,
      employeeTimesheetId: "12320",
      gender: "male",
      startingDate: new Date(`${currentYear}-01-19`),
      leavingDate: new Date(`${currentYear}-07-19`),
      birthdate: new Date("2002-06-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "daoquangphuong.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "102298653",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tranhungcuon@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hungkara01998@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Thị Vui",
      relationWithEmergencyContactPerson: "Chị gái",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "vui@gmail.com",
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
      foreignLanguage: "620 Toeic",
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP 2",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 7
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Vũ Mạnh Cường",
      employeeNumber: "MS202021",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12321",
      gender: "male",
      startingDate: new Date(`${currentYear - 1}-12-19`),
      leavingDate: new Date(`${currentYear}-06-19`),
      birthdate: new Date("1998-6-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "tte.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "102298653",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "tranhungcuong@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "hungkarate998@gmail.com",
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
      professionalSkill: "unavailable",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 8
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Trần Văn Cường",
      employeeNumber: "MS202022",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12322",
      gender: "male",
      startingDate: new Date(`${currentYear - 1}-06-19`),
      leavingDate: new Date(`${currentYear}-06-19`),
      birthdate: new Date("1998-02-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "pdp.vnist@gmail.com",
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
      professionalSkill: "colleges",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 9
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Dương Thị Thanh Thuỳ",
      employeeNumber: "MS202023",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12323",
      startingDate: new Date(`${currentYear}-09-19`),
      leavingDate: new Date(`${currentYear}-06-19`),
      gender: "female",
      birthdate: new Date("1985-07-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "minhtb.vnist@gmail.com",
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
      professionalSkill: "colleges",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Thử việc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Thử việc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 10
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Thị huệ",
      employeeNumber: "MS202024",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12324",
      gender: "female",
      startingDate: new Date(`${currentYear}-10-19`),
      leavingDate: new Date(`${currentYear}-04-19`),
      birthdate: new Date("1988-01-14"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nhungnt.vnist@gmail.com",
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
      professionalSkill: "intermediate_degree",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 11
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Vũ Viết Xuân",
      employeeNumber: "MS202025",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123456",
      gender: "female",
      startingDate: new Date(`${currentYear}-11-19`),
      leavingDate: new Date(`${currentYear}-03-19`),
      birthdate: new Date("1999-11-12"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "tmd.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 12
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Trần Thị Thu Phương",
      employeeNumber: "MS202026",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12326",
      gender: "male",
      startingDate: new Date(`${currentYear}-06-19`),
      leavingDate: new Date(`${currentYear}-03-19`),
      birthdate: new Date("1991-06-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyenvietanh.vnist@gmail.com",
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
      professionalSkill: "phd",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 13
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Bùi Thị Mai",
      employeeNumber: "MS2015124",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12327",
      gender: "female",
      startingDate: new Date(`${currentYear}-12-19`),
      birthdate: new Date("1965-06-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyenvietthai.vnist@gmail.com",
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
      professionalSkill: "unavailable",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 14
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Lương Thử",
      employeeNumber: "MS2015124",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12328",
      gender: "male",
      startingDate: new Date(`${currentYear}-02-19`),
      birthdate: new Date("1966-02-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "tranmyhanh.vnist@gmail.com",
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
      professionalSkill: "phd",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 15
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Lưu Quang Ngọc",
      employeeNumber: "MS202029",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12329",
      gender: "male",
      startingDate: new Date(`${currentYear}-02-19`),
      birthdate: new Date("1983-03-02"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "luuquangngoc.vnist@gmail.com",
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
      professionalSkill: "master_degree",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 16
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Hoàng Văn Tùng",
      employeeNumber: "MS202030",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123430",
      gender: "male",
      startingDate: new Date(`${currentYear}-02-19`),
      birthdate: new Date("1991-10-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "hoangvantung.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 17
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Văn Hải",
      employeeNumber: "MS202031",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123431",
      gender: "male",
      startingDate: new Date(`${currentYear}-03-19`),
      birthdate: new Date("1989-12-10"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyenvanhai.vnist@gmail.com",
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
      professionalSkill: "colleges",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 18
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Trần Văn Sơn",
      employeeNumber: "MS202032",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12332",
      gender: "male",
      startingDate: new Date(`${currentYear}-04-19`),
      birthdate: new Date("1986-03-23"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "tranvanson.vnist@gmail.com",
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
      professionalSkill: "intermediate_degree",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 19
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Mai Thuỳ Dung",
      employeeNumber: "MS202033",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123433",
      gender: "female",
      startingDate: new Date(`${currentYear}-04-19`),
      birthdate: new Date("1998-02-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "maithuydung.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 20
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Thống Nhất",
      employeeNumber: "MS202034",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123434",
      gender: "male",
      startingDate: new Date(`${currentYear}-05-19`),
      birthdate: new Date("1981-07-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyenthongnhat.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 21
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Trần Kim Cương",
      employeeNumber: "MS202035",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123456",
      gender: "male",
      startingDate: new Date(`${currentYear}-05-19`),
      birthdate: new Date("1990-09-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "trankimcuong.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 22
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Đình Thuận",
      employeeNumber: "MS202036",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123436",
      gender: "male",
      startingDate: new Date(`${currentYear}-05-19`),
      birthdate: new Date("1979-09-29"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyendinhthuan.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 23
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Ngô Tri Dũng",
      employeeNumber: "MS202037",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123437",
      gender: "male",
      startingDate: new Date(`${currentYear}-05-19`),
      birthdate: new Date("1981-11-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "ngotridung.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // User 24
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Khắc Đại",
      employeeNumber: "MS202038",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "123438",
      gender: "male",
      startingDate: new Date(`${currentYear}-06-19`),
      birthdate: new Date("1980-12-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nguyenkhacdai.vnist@gmail.com",
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
      professionalSkill: "university",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },

    {
      // user 25
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Văn Danh",
      employeeNumber: "MS202026",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12326",
      gender: "male",
      startingDate: new Date(`${currentYear}-06-19`),
      leavingDate: new Date(`${currentYear}-03-19`),
      birthdate: new Date("1991-06-17"),
      birthplace: "Hải Phương - Hải Hậu - Nam Định",
      identityCardNumber: 163414569,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Nam Định",
      emailInCompany: "nvd.vnist@gmail.com",
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
      professionalSkill: "phd",
      healthInsuranceNumber: "N1236589",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569874",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12658974",
      taxRepresentative: "Nguyễn Văn Hưng",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Hải Hậu",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "good",
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: "PHP",
          issuedBy: "Hà Nội",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: "Vnist",
          startDate: new Date(
            `${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
          endDate: new Date(
            `${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]
            }`
          ),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: "Vnist",
          position: "Nhân viên",
        },
      ],
      contractType: "Phụ thuộc",
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: "Thực tập",
          contractType: "Phụ thuộc",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
    },
  ]);
  console.log(`Xong! Thông tin nhân viên đã được tạo`);
  //END

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NGHỊ PHÉP CHO CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  const units = [
    phongMaketing,
    phongKS,
    phongQTNS,
    phongQTMT,
    phongQTHCNS,
    phongHCHT,
    phongTCKT,
    phongKTDN,
    phongKTBH,
  ];
  console.log("Khởi tạo dữ liệu nghỉ phép!");
  let reason = ["Về quê", "Đi du lịch", "Nghỉ ốm"];
  let statusAnnualLeave = ["approved", "waiting_for_approval"];
  let AnnualLeaveFake = [];
  usersFake.forEach((x, index) => {
    let month = months[Math.floor(Math.random() * 12)];
    let unit = units[x.organizationalUnit];
    AnnualLeaveFake = [
      ...AnnualLeaveFake,
      {
        company: vnist._id,
        employee: employeesFake[index]._id,
        organizationalUnit: unit[0]._id,
        startDate: `${currentYear}-${month}-05`,
        endDate: `${currentYear}-${month}-07`,
        status: statusAnnualLeave[Math.floor(Math.random() * 2)],
        reason: reason[Math.floor(Math.random() * 3)],
      },
    ];
  });
  await AnnualLeave(vnistDB).insertMany(AnnualLeaveFake);

  await AnnualLeave(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employees[3]._id,
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-05`,
      endDate: `${currentYear}-09-19`,
      status: "approved",
      reason: "Nghỉ du lịch",
    },
    {
      company: vnist._id,
      employee: employees[4]._id,
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-02`,
      endDate: `${currentYear}-09-22`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[4]._id,
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-02-02`,
      endDate: `${currentYear}-02-22`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[5]._id,
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-01`,
      endDate: `${currentYear}-09-03`,
      status: "waiting_for_approval",
      reason: "Nghỉ du lịch",
    },
    {
      company: vnist._id,
      employee: employees[5]._id,
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-03-01`,
      endDate: `${currentYear}-03-03`,
      status: "waiting_for_approval",
      reason: "Nghỉ du lịch",
    },
    {
      company: vnist._id,
      employee: employees[6]._id,
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-09-05`,
      endDate: `${currentYear}-09-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[7]._id,
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-09-05`,
      endDate: `${currentYear}-09-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[7]._id,
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-04-05`,
      endDate: `${currentYear}-04-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[7]._id,
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-01-05`,
      endDate: `${currentYear}-01-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[8]._id,
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-09-04`,
      endDate: `${currentYear}-09-16`,
      status: "waiting_for_approval",
      reason: "Nghỉ du lịch",
    },
    {
      company: vnist._id,
      employee: employees[8]._id,
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear - 1}-10-04`,
      endDate: `${currentYear}-10-16`,
      status: "waiting_for_approval",
      reason: "Nghỉ du lịch",
    },
    {
      company: vnist._id,
      employee: employees[9]._id,
      organizationalUnit: phongQTNS[0]._id,
      startDate: `${currentYear}-09-05`,
      endDate: `${currentYear}-09-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[9]._id,
      organizationalUnit: phongQTNS[0]._id,
      startDate: `${currentYear}-02-05`,
      endDate: `${currentYear}-02-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
    {
      company: vnist._id,
      employee: employees[9]._id,
      organizationalUnit: phongQTNS[0]._id,
      startDate: `${currentYear}-05-05`,
      endDate: `${currentYear}-05-10`,
      status: "approved",
      reason: "Nghỉ về quê",
    },
  ]);
  console.log(`Xong! Thông tin nghỉ phép đã được tạo`);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  console.log("Khởi tạo dữ liệu lương nhân viên!");
  let SalaryFake = [];
  usersFake.forEach((x, index) => {
    let unit = units[x.organizationalUnit];
    SalaryFake = [
      ...SalaryFake,
      {
        company: vnist._id,
        employee: employeesFake[index]._id,
        month: `${currentYear}-${months[Math.floor(Math.random() * 12)]}`,
        organizationalUnit: unit[0]._id,
        mainSalary:
          (index % 19) * 7000000 + Math.floor(Math.random() * 20) * 1000000,
        unit: "VND",
        bonus: [
          {
            nameBonus: "Thưởng dự án",
            number:
              (index % 19) * 1000000 + Math.floor(Math.random() * 20) * 1000000,
          },
        ],
      },
    ];
  });

  await Salary(vnistDB).insertMany(SalaryFake);
  await Salary(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employees[1]._id,
      month: "2019-08",
      organizationalUnit: Directorate._id,
      mainSalary: "21000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng dự án",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: "2019-09",
      mainSalary: "20000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: "2019-10",
      mainSalary: "19000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: "2019-11",
      mainSalary: "17000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: "2019-12",
      mainSalary: "13000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-01`,
      mainSalary: "14000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng dự án",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-02`,
      mainSalary: "14000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-03`,
      mainSalary: "10000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng dự án",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-04`,
      mainSalary: "16000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng dự án",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-05`,
      mainSalary: "18000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-06`,
      mainSalary: "17000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng dự án",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-07`,
      mainSalary: "12000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-08`,
      mainSalary: "11000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      organizationalUnit: Directorate._id,
      month: `${currentYear}-09`,
      mainSalary: "15000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },

    {
      company: vnist._id,
      employee: employees[3]._id,
      organizationalUnit: phongMaketing[0]._id,
      month: `${currentYear}-09`,
      mainSalary: "15000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
    {
      company: vnist._id,
      employee: employees[4]._id,
      organizationalUnit: phongMaketing[0]._id,
      month: `${currentYear}-09`,
      mainSalary: "15000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },

    {
      company: vnist._id,
      employee: employees[5]._id,
      organizationalUnit: phongMaketing[0]._id,
      month: `${currentYear}-09`,
      mainSalary: "15000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },

    {
      company: vnist._id,
      employee: employees[6]._id,
      organizationalUnit: phongMaketing[0]._id,
      month: `${currentYear}-09`,
      mainSalary: "18000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },

    {
      company: vnist._id,
      employee: employees[7]._id,
      organizationalUnit: phongMaketing[0]._id,
      month: `${currentYear}-09`,
      mainSalary: "15000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },

    {
      company: vnist._id,
      employee: employees[8]._id,
      organizationalUnit: phongMaketing[0]._id,
      month: `${currentYear}-09`,
      mainSalary: "15000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng tháng",
          number: "1000000",
        },
      ],
    },
  ]);
  console.log(`Xong! Thông tin lương nhân viên đã được tạo`);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHEN THƯỞNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  console.log("Khởi tạo dữ liệu khen thưởng!");
  let commendationFake = [];
  usersFake.forEach((x, index) => {
    let unit = units[x.organizationalUnit];
    commendationFake = [
      ...commendationFake,
      {
        company: vnist._id,
        employee: employeesFake[index]._id,
        decisionNumber: `${12345 + index}`,
        organizationalUnit: unit[0]._id,
        startDate: new Date(
          `${index > 100 ? currentYear : currentYear - 1}-${months[Math.floor(Math.random() * 12)]
          }-${days[Math.floor(Math.random() * 19)]}`
        ),
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
      },
    ];
  });
  await Commendation(vnistDB).insertMany(commendationFake);

  await Commendation(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employees[1]._id,
      decisionNumber: "123",
      organizationalUnit: departments._id,
      startDate: `${currentYear}-02-02`,
      type: "Thưởng tiền",
      reason: "Vượt doanh số",
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      decisionNumber: "1234",
      organizationalUnit: departments._id,
      startDate: `${currentYear}-02-02`,
      type: "Thưởng tiền",
      reason: "Vượt doanh số 500 triệu",
    },
    {
      company: vnist._id,
      employee: employees[3]._id,
      decisionNumber: "12345",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-02-02`,
      type: "Thưởng tiền",
      reason: "Vượt doanh số 500 triệu",
    },
    {
      company: vnist._id,
      employee: employees[4]._id,
      decisionNumber: "12346",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-02`,
      type: "Thưởng tiền",
      reason: "Vượt doanh số 500 triệu",
    },
    {
      company: vnist._id,
      employee: employees[5]._id,
      decisionNumber: "12347",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-02`,
      type: "Thưởng tiền",
      reason: "Vượt doanh số 500 triệu",
    },
    {
      company: vnist._id,
      employee: employees[6]._id,
      decisionNumber: "12348",
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-09-02`,
      type: "Thưởng tiền",
      reason: "Vượt doanh số 500 triệu",
    },
  ]);
  console.log(`Xong! Thông tin khen thưởng đã được tạo`);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KỶ LUẬT NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  console.log("Khởi tạo dữ liệu kỷ luật!");
  let disciplineFake = [];
  usersFake.forEach((x, index) => {
    let unit = units[x.organizationalUnit];
    let day = days[Math.floor(Math.random() * 19)];
    disciplineFake = [
      ...disciplineFake,
      {
        company: vnist._id,
        employee: employeesFake[index]._id,
        decisionNumber: `${15645 + index}`,
        organizationalUnit: unit[0]._id,
        startDate: new Date(
          `${index > 100 ? currentYear : currentYear - 1}-${months[Math.floor(Math.random() * 6)]
          }-${day}`
        ),
        endDate: new Date(
          `${index > 100 ? currentYear : currentYear - 1}-${months[Math.floor(Math.random() * 6) + 6]
          }-${day}`
        ),
        type: "Phạt tiền",
        reason: "Không làm đủ công",
      },
    ];
  });
  await Discipline(vnistDB).insertMany(disciplineFake);
  await Discipline(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employees[1]._id,
      decisionNumber: "1456",
      organizationalUnit: departments._id,
      startDate: `${currentYear}-09-07`,
      endDate: `${currentYear}-09-09`,
      type: "Phạt tiền",
      reason: "Không làm đủ công",
    },
    {
      company: vnist._id,
      employee: employees[1]._id,
      decisionNumber: "1457",
      organizationalUnit: departments._id,
      startDate: `${currentYear}-09-07`,
      endDate: `${currentYear}-09-09`,
      type: "Phạt tiền",
      reason: "Không đủ doanh số",
    },
    {
      company: vnist._id,
      employee: employees[3]._id,
      decisionNumber: "1458",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-08-07`,
      endDate: `${currentYear}-08-09`,
      type: "Phạt tiền",
      reason: "Không đủ doanh số",
    },
    {
      company: vnist._id,
      employee: employees[3]._id,
      decisionNumber: "1459",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-07`,
      endDate: `${currentYear}-09-09`,
      type: "Phạt tiền",
      reason: "Không đủ doanh số",
    },
    {
      company: vnist._id,
      employee: employees[4]._id,
      decisionNumber: "1460",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-07`,
      endDate: `${currentYear}-09-09`,
      type: "Phạt tiền",
      reason: "Không đủ doanh số",
    },
    {
      company: vnist._id,
      employee: employees[5]._id,
      decisionNumber: "1461",
      organizationalUnit: phongMaketing[0]._id,
      startDate: `${currentYear}-09-10`,
      endDate: `${currentYear}-10-13`,
      type: "Phạt tiền",
      reason: "Không đủ doanh số",
    },
    {
      company: vnist._id,
      employee: employees[6]._id,
      decisionNumber: "1462",
      organizationalUnit: phongKS[0]._id,
      startDate: `${currentYear}-09-20`,
      endDate: `${currentYear}-09-25`,
      type: "Phạt tiền",
      reason: "Không đủ doanh số",
    },
  ]);
  console.log(`Xong! Thông tin kỷ luật đã được tạo`);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Chấm công
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  console.log("Khởi tạo dữ liệu chấm công!");
  console.log(`Xong! Thông tin chấm công đã được tạo`);
  let timesheetFake = [];
  let timekeepingByShift = {
    shift1s: [
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
    ],
    shift2s: [
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
    ],
    shift3s: [
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ],
  };

  let monthTimesheet = [
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
  ];
  monthTimesheet.forEach((y) => {
    usersFake.forEach((x, index) => {
      timesheetFake = [
        ...timesheetFake,
        {
          company: vnist._id,
          employee: employeesFake[index]._id,
          month: `${currentYear}-${y}`,
          timekeepingByShift: {
            shift1s:
              timekeepingByShift[`shift${Math.floor(Math.random() * 3) + 1}s`],
            shift2s:
              timekeepingByShift[`shift${Math.floor(Math.random() * 3) + 1}s`],
            shift3s:
              timekeepingByShift[`shift${Math.floor(Math.random() * 3) + 1}s`],
          },
        },
      ];
    });
  });

  usersFake.forEach((x, index) => {
    timesheetFake = [
      ...timesheetFake,
      {
        company: vnist._id,
        employee: employeesFake[index]._id,
        month: `2019-${months[Math.floor(Math.random() * 12)]}`,
        timekeepingByShift: {
          shift1s:
            timekeepingByShift[`shift${Math.floor(Math.random() * 3) + 1}s`],
          shift2s:
            timekeepingByShift[`shift${Math.floor(Math.random() * 3) + 1}s`],
          shift3s:
            timekeepingByShift[`shift${Math.floor(Math.random() * 3) + 1}s`],
        },
      },
    ];
  });

  timesheetFake = timesheetFake.map((x) => {
    let timekeepingByShift = x.timekeepingByShift;
    let shift1s = timekeepingByShift.shift1s.map((x) => (x ? 4 : 0));
    let shift2s = timekeepingByShift.shift2s.map((x) => (x ? 4 : 0));
    let shift3s = timekeepingByShift.shift3s.map((x) => (x ? 4 : 0));
    let timekeepingByHours = shift1s.map(
      (x, index) => x + shift2s[index] + shift3s[index]
    );
    let totalHours = 0,
      totalOverTimeHours = 0;
    timekeepingByShift.shift3s.forEach((x) => {
      if (x) {
        totalOverTimeHours = totalOverTimeHours + 4;
      }
    });
    timekeepingByHours.forEach((x) => {
      totalHours = totalHours + x;
    });
    return {
      ...x,
      totalHours: totalHours,
      timekeepingByHours: timekeepingByHours,
      totalHoursOff:
        120 - totalOverTimeHours > 0
          ? 120 - totalOverTimeHours
          : 0 - (120 - totalOverTimeHours),
      totalOvertime: totalOverTimeHours,
    };
  });
  await Timesheet(vnistDB).insertMany(timesheetFake);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CHƯƠNG TRÌNH ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

  // console.log("Khởi tạo dữ liệu chương trình đào tạo bắt buộc!");
  // var educationProgram = await EducationProgram(vnistDB).insertMany([{
  //     applyForOrganizationalUnits: [
  //         departments[0]._id
  //     ],
  //     applyForPositions: [
  //         nvPhongHC._id
  //     ],
  //     name: "An toan lao dong",
  //     programId: "M123",
  // }, {
  //     applyForOrganizationalUnits: [
  //         departments[0]._id
  //     ],
  //     applyForPositions: [
  //         nvPhongHC._id
  //     ],
  //     name: "kỹ năng giao tiếp",
  //     programId: "M1234",
  // }])
  // console.log(`Xong! Thông tin chương trình đào tạo  đã được tạo`);

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHOÁ ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

  // console.log("Khởi tạo dữ liệu khoá đào tạo bắt buộc!");
  // await Course(vnistDB).insertMany([{
  //     company: vnist._id,
  //     name: "An toàn lao động 1",
  //     courseId: "LD1233",
  //     offeredBy: "Vnists",
  //     coursePlace: "P9.01",
  //     startDate: `${currentYear}-02-16`,
  //     endDate: `${currentYear}-03-21`,
  //     cost: {
  //         number: "1200000",
  //         unit: 'VND'
  //     },
  //     lecturer: "Nguyễn B",
  //     type: "external",
  //     educationProgram: educationProgram[0]._id,
  //     employeeCommitmentTime: "6",
  // }, {
  //     company: vnist._id,
  //     name: "An toàn lao động 2",
  //     courseId: "LD123",
  //     offeredBy: "Vnists",
  //     coursePlace: "P9.01",
  //     startDate: `${currentYear}-02-16`,
  //     endDate: `${currentYear}-03-21`,
  //     cost: {
  //         number: "1200000",
  //         unit: 'VND'
  //     },
  //     lecturer: "Nguyễn Văn B",
  //     type: "internal",
  //     educationProgram: educationProgram[1]._id,
  //     employeeCommitmentTime: "6",
  // }])

  // console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);



  // ============================================================

  console.log("Khởi tạo dữ liệu cấu hình module quản lý nhân sự!");

  const configModule = await ModuleConfiguration(vnistDB).create({
    humanResource: {
      contractNoticeTime: 15,
      timekeepingType: "shift",
      timekeepingByShift: {
        shift1Time: 4,
        shift2Time: 4,
        shift3Time: 4,
      },
    },
    bidding: {
      company: vnist.name,
      address: "Tầng 10, số 266 Đội Cấn, quận Ba Đình, Hà Nội",
      email: "vnist@gmail.com",
      phone: "0987654345",
      taxCode: "564651658496456",
      representative: {
        name: "Nguyễn Văn An",
        role: "Giám đốc"
      },
      bank: {
        name: "SHB - chi nhánh Ba Đình",
        accountNumber: "98676745678"
      }
    },
  });

  console.log(`Xong! thông tin cấu hình module quản lý nhân sự đã được tạo`);

  /**
   * ==================================================================
   */

  // nhân viên
  const anNV = await Employee(vnistDB).findOne({ emailInCompany: "nva.vnist@gmail.com" });
  const binhTV = await Employee(vnistDB).findOne({ emailInCompany: "tvb.vnist@gmail.com" });
  const cucVT = await Employee(vnistDB).findOne({ emailInCompany: "vtc.vnist@gmail.com" });
  const danhNV = await Employee(vnistDB).findOne({ emailInCompany: "nvd.vnist@gmail.com" })
  const dungNT = await Employee(vnistDB).findOne({ emailInCompany: "ngotridung.vnist@gmail.com" })
  const daiNK = await Employee(vnistDB).findOne({ emailInCompany: "nguyenkhacdai.vnist@gmail.com" })

  console.log("Khởi tạo dữ liệu tag!");


  const tags = await Tag(vnistDB).insertMany([
    { // 0
      employees: [
        cucVT._id,
        anNV._id,
        dungNT._id,
        danhNV._id,
      ],
      name: "backend",
      description: "Triển khai hệ thống backend cho website",
      employeeWithSuitability: [
        {
          suitability: 8,
          employee: cucVT._id
        },
        {
          suitability: 7,
          employee: anNV._id
        },
        {
          suitability: 8,
          employee: dungNT._id
        },
        {
          suitability: 9,
          employee: danhNV._id
        }
      ]
    },
    { // 1
      employees: [
        cucVT._id,
        binhTV._id,
        daiNK._id,
        danhNV._id,
      ],
      name: "frontend",
      description: "Xây dựng giao diện cho website",
      employeeWithSuitability: [
        {
          suitability: 7,
          employee: cucVT._id
        },
        {
          suitability: 7,
          employee: binhTV._id
        },
        {
          suitability: 5,
          employee: daiNK._id
        },
        {
          suitability: 9,
          employee: danhNV._id
        }
      ]
    },
    { // 2
      employees: [
        binhTV._id,
        daiNK._id,
        dungNT._id,
        danhNV._id,
      ],
      name: "trainnig_security",
      description: "Hướng dẫn triển khai, kiểm tra bảo mật hệ thống",
      employeeWithSuitability: [
        {
          suitability: 8,
          employee: binhTV._id
        },
        {
          suitability: 7,
          employee: daiNK._id
        },
        {
          suitability: 9,
          employee: dungNT._id
        },
        {
          suitability: 9,
          employee: danhNV._id
        }
      ]
    },
    { // 3
      employees: [
        cucVT._id,
        anNV._id,
        daiNK._id,
        danhNV._id,
      ],
      name: "implement_security",
      description: "Triển khai ứng dụng bảo mật cho hệ thống máy tính công ty",
      employeeWithSuitability: [
        {
          suitability: 9,
          employee: cucVT._id
        },
        {
          suitability: 7,
          employee: anNV._id
        },
        {
          suitability: 8,
          employee: daiNK._id
        },
        {
          suitability: 8,
          employee: danhNV._id
        }
      ]
    },
    { // 4
      employees: [
        binhTV._id,
        daiNK._id,
        cucVT._id,
      ],
      name: "collecting_data",
      description: "Thu thập dữ liệu, tìm kiếm thông tin",
      employeeWithSuitability: [
        {
          suitability: 7,
          employee: binhTV._id
        },
        {
          suitability: 8,
          employee: daiNK._id
        },
        {
          suitability: 7,
          employee: cucVT._id
        },
      ]
    },
    { // 5
      employees: [
        binhTV._id,
        anNV._id,
        dungNT._id,
        daiNK._id,
        danhNV._id,
      ],
      name: "devops",
      description: "Deploy sản phẩm lên server, làm việc với cloud,..",
      employeeWithSuitability: [
        {
          suitability: 9,
          employee: binhTV._id
        },
        {
          suitability: 8,
          employee: anNV._id
        },
        {
          suitability: 7,
          employee: dungNT._id
        },
        {
          suitability: 7,
          employee: daiNK._id
        },
        {
          suitability: 8,
          employee: danhNV._id
        }
      ]
    },
  ]);

  console.log("Xong! Thông tin tag đã đc tạo!");

  /**
   * ==================================================================
   */

  console.log("Khởi tạo dữ liệu gói thầu!");
  var now__ = new Date();
  var currentYear__ = now__.getFullYear();
  var currentMonth__ = now__.getMonth();
  const startDate__ = new Date(currentYear__, currentMonth__ - 1, 1, 12);
  const endDate__ = new Date(currentYear__, currentMonth__ - 1, 30, 12);

  const biddingPackage = await BiddingPackage(vnistDB).insertMany([
    {
      proposals: {
        executionTime: 20,
        unitOfTime: "days",
        tasks: [
          {
            preceedingTasks: [],
            numberOfEmployees: 1,
            directEmployees: [],
            backupEmployees: [],
            unitOfTime: "days",
            code: "T01",
            taskName: "Hướng dẫn thu thập thông tin qua các search engine",
            taskDescription: "Thu thập thông tin qua các search engine",
            estimateTime: 5,
            tag: tags[4]
          },
          {
            preceedingTasks: [],
            numberOfEmployees: 1,
            directEmployees: [],
            backupEmployees: [],
            unitOfTime: "days",
            code: "T02",
            taskName: "Triển khai nhận diện ứng dụng",
            taskDescription: "Nhận diện ứng dụng phiên bản ứng dụng, các thành phần, component của ứng dụng",
            estimateTime: 3,
            tag: tags[3]
          },
          {
            preceedingTasks: [
              "T01",
              "T02"
            ],
            numberOfEmployees: 1,
            directEmployees: [],
            backupEmployees: [],
            unitOfTime: "days",
            code: "T03",
            taskName: "Thay đổi phiên bản máy chủ web",
            taskDescription: "Thay đổi phiên bản máy chủ web",
            estimateTime: 4,
            tag: tags[3]
          },
          {
            preceedingTasks: [
              "T03"
            ],
            numberOfEmployees: 2,
            directEmployees: [],
            backupEmployees: [],
            unitOfTime: "days",
            code: "T04",
            taskName: "Thiết lập Cấu hình bảo mật mới cho trang web",
            taskDescription: "Thiết lập Cấu hình bảo mật mới cho trang web.",
            estimateTime: 5,
            tag: tags[3]
          }
        ]
      },
      type: 1,
      status: 3,
      name: "Triển khai công nghệ bảo mật mới cho web site công ty Lomo",
      code: "20220614-LOMO-01",
      customer: "Lomo Solution",
      price: 32000000,
      openLocal: "Đội Cấn, Ba Đình, Hà Nội",
      receiveLocal: "Đội Cấn, Ba Đình, Hà Nội",
      startDate: startDate__,
      endDate: endDate__,
      description: "Triển khai công nghệ bảo mật mới cho web site công ty Lomo",
      keyPeople: [],
      keyPersonnelRequires: [],
      company: vnist._id,
    },
    {
      "proposals": {
        "unitOfTime": "days",
        "executionTime": 15,
        "tasks": [
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T01",
            "preceedingTasks": [],
            "taskName": "Xây đường ống thoát nước",
            "taskDescription": "Xây đường ống",
            "estimateTime": 6
          },
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T02",
            "preceedingTasks": ["T01"],
            "taskName": "Làm mới vỉa hè",
            "taskDescription": "Làm mới vỉa hè",
            "estimateTime": 7
          }
        ]
      },
      "type": 4,
      "status": 1,
      "name": "Gói thầu xây dựng công trình đô thị Bắc Ninh",
      "code": "20220614-BN-06",
      "customer": "Công ty Xây Dựng Văn Phú",
      "price": 12000000,
      "openLocal": "Hà Nội",
      "receiveLocal": "Bắc Ninh",
      "startDate": startDate__,
      "endDate": endDate__,
      "description": "Gói thầu xây dựng công trình đô thị",
      "keyPeople": [],
      "keyPersonnelRequires": [],
      "company": vnist._id,
    },
    {
      "proposals": {
        "unitOfTime": "days",
        "executionTime": 20,
        "tasks": [
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T01",
            "preceedingTasks": [],
            "taskName": "Tư vấn dịch vụ bảo mật cho máy chủ công ty",
            "taskDescription": "Tư vấn dịch vụ bảo mật cho máy chủ",
            "estimateTime": 7
          },
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T02",
            "preceedingTasks": ["T01"],
            "taskName": "Hướng dẫn triển khai ứng dụng bảo mật cho công ty",
            "taskDescription": "Hướng dẫn triển khai ứng dụng bảo mật ",
            "estimateTime": 7
          }
        ]
      },
      "type": 1,
      "status": 2,
      "name": "Tư vấn giám sát hệ thống ATTT công ty Qmobile",
      "code": "20220614-ATTT-01",
      "customer": "Lomo Solution",
      "price": 30000000,
      "openLocal": "Hà Nội",
      "receiveLocal": "Hà Nội",
      "startDate": startDate__,
      "endDate": endDate__,
      "description": "Tư vấn giám sát hệ thống ATTT công ty ",
      "keyPeople": [],
      "keyPersonnelRequires": [],
      "company": vnist._id,
    },
    {
      "proposals": {
        "executionTime": 30,
        "unitOfTime": "days",
        "tasks": [
          {
            "preceedingTasks": [],
            "numberOfEmployees": 1,
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T01",
            "taskName": "Thu thập thông tin qua các search engine",
            "taskDescription": "Thông tin về hệ thống được thu thập phổ biến như GG, Bing, Baidu,...",
            "estimateTime": 7,
          },
          {
            "preceedingTasks": [
              "T01"
            ],
            "numberOfEmployees": 1,
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T02",
            "taskName": "Thu thập thông tin qua các web server",
            "taskDescription": "Thu thập thông tin qua các web server",
            "estimateTime": 6,
          },
          {
            "preceedingTasks": [
              "T02"
            ],
            "numberOfEmployees": 2,
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T03",
            "taskName": "Nhận diện ứng dụng",
            "taskDescription": "Nhận diện ứng dụng phiên bản ứng dụng, các thành phần, component của ứng dụng",
            "estimateTime": 7,
          },
          {
            "preceedingTasks": [
              "T03"
            ],
            "numberOfEmployees": 1,
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T04",
            "taskName": "Đánh giá quá trình truyền thông tin đăng nhập",
            "taskDescription": "Đánh giá quá trình truyền nội dung thông tin đăng nhập",
            "estimateTime": 4,
          }
        ]
      },
      "type": 2,
      "status": 3,
      "name": "Kiểm tra đánh giá an toàn thông tin và rà soát mã độc",
      "code": "20220614-ATTT-02",
      "customer": "Công Ty TNHH DXC",
      "price": 40000000,
      "startDate": startDate__,
      "endDate": endDate__,
      "description": "Kiểm tra đánh giá an toàn thông tin và rà soát mã độc",
      "keyPeople": [],
      "keyPersonnelRequires": [],
      "company": vnist._id,
      "openLocal": "Hà Nội",
      "receiveLocal": "Hà Nội",
    },
    {
      "proposals": {
        "unitOfTime": "days",
        "executionTime": 25,
        "tasks": [
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T01",
            "preceedingTasks": [],
            "taskName": "Dựng giao diện cho website",
            "taskDescription": "Dựng giao diện cho website",
            "estimateTime": 6,
          },
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T02",
            "preceedingTasks": [],
            "taskName": "Xây dựng server cho website",
            "taskDescription": "Xây dựng server cho website",
            "estimateTime": 7,
          },
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T03",
            "preceedingTasks": ["T01, T02"],
            "taskName": "Ghép nối backend và frontend",
            "taskDescription": "Ghép nối backend và frontend",
            "estimateTime": 4,
          },
          {
            "directEmployees": [],
            "backupEmployees": [],
            "unitOfTime": "days",
            "code": "T04",
            "preceedingTasks": ["T03"],
            "taskName": "Deploy web ra product",
            "taskDescription": "Deploy web ra product",
            "estimateTime": 3,
          }
        ],
      },
      "type": 1,
      "status": 3,
      "name": "Triển khai trang website QLCV cho công ty DXC",
      "code": "20200614-QLCV-01",
      "customer": "Công Ty TNHH DXC",
      "price": 15000000,
      "openLocal": "Hà Nội",
      "receiveLocal": "Hà Nội",
      "startDate": startDate__,
      "endDate": endDate__,
      "description": "Xây dựng website cho QLCV",
      "keyPeople": [],
      "keyPersonnelRequires": [],
      "company": vnist._id,
    }
  ]);

  console.log(`Xong! Danh sách gói thầu đã được tạo`);

  /**
   * Khởi tạo mẫu dự án
   */

  // người dùng
  const usAnNV = await User(vnistDB).findOne({ email: "nva.vnist@gmail.com" });
  const usBinhTV = await User(vnistDB).findOne({ email: "tvb.vnist@gmail.com" });
  const usCucVT = await User(vnistDB).findOne({ email: "vtc.vnist@gmail.com" });
  const usDanhNV = await User(vnistDB).findOne({ email: "nvd.vnist@gmail.com" });

  console.log(`Khởi tạo dữ liệu mẫu dự án`);

  const prjTemplate = await ProjectTemplate(vnistDB).insertMany([
    /* 1 */
    {
      "projectType": 2,
      "numberOfUse": 0,
      "unitOfTime": "days",
      "currenceUnit": "VND",
      "projectManager": [
        usDanhNV._id
      ],
      "responsibleEmployees": [
        usAnNV._id,
        usBinhTV._id,
        usCucVT._id,
        usDanhNV._id,
      ],
      "name": "Mẫu dự án đánh giá kiểm tra cơ sở hạn tầng mạng nội bộ",
      "description": "Mẫu dự án đánh giá kiểm tra cơ sở hạn tầng mạng nội bộ Bảo Việt",
      "creator": usDanhNV._id,
      "responsibleEmployeesWithUnit": [
        {
          "unitId": Directorate._id,
          "listUsers": [
            {
              "userId": usAnNV._id,
              "salary": 10000000
            },
            {
              "userId": usBinhTV._id,
              "salary": 9000000
            },
            {
              "userId": usCucVT._id,
              "salary": 11000000
            },
            {
              "userId": usDanhNV._id,
              "salary": 10000000
            }
          ]
        }
      ],
      "tasks": [
        {
          "taskWeight": {
            "timeWeight": 0.333333333333333,
            "qualityWeight": 0.333333333333333,
            "costWeight": 0.333333333333333
          },
          "memberWeight": {
            "timeWeight": 0.25,
            "qualityWeight": 0.25,
            "costWeight": 0.25,
            "timedistributionWeight": 0.25
          },
          "code": "T01",
          "tags": [],
          "priority": 3,
          "inactiveEmployees": [],
          "responsibleEmployees": [
            usBinhTV._id
          ],
          "accountableEmployees": [
            usAnNV._id
          ],
          "consultedEmployees": [],
          "informedEmployees": [],
          "formula": "progress / (daysUsed / totalDays) - (10 - averageActionRating) * 10",
          "formulaProjectTask": "taskTimePoint + taskQualityPoint + taskCostPoint",
          "formulaProjectMember": "memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint",
          "name": "Tìm kiếm thông tin bảo mật",
          "description": "Tìm kiếm thông tin bảo mật",
          "collaboratedWithOrganizationalUnits": [],
          "preceedingTasks": [],
          "estimateNormalTime": 4,
          "estimateOptimisticTime": 2,
          "estimateNormalCost": null,
          "estimateMaxCost": null,
          "estimateAssetCost": 1000000,
          "actorsWithSalary": [
            {
              "userId": usBinhTV._id,
              "salary": 0,
              "weight": 80
            },
            {
              "userId": usAnNV._id,
              "salary": 0,
              "weight": 20
            }
          ],
          "totalResWeight": 80,
          "taskInformations": [],
          "taskActions": []
        },
        {
          "taskWeight": {
            "timeWeight": 0.333333333333333,
            "qualityWeight": 0.333333333333333,
            "costWeight": 0.333333333333333
          },
          "memberWeight": {
            "timeWeight": 0.25,
            "qualityWeight": 0.25,
            "costWeight": 0.25,
            "timedistributionWeight": 0.25
          },
          "code": "T02",
          "tags": [],
          "priority": 3,
          "inactiveEmployees": [],
          "responsibleEmployees": [
            usDanhNV._id
          ],
          "accountableEmployees": [
            usCucVT._id
          ],
          "consultedEmployees": [],
          "informedEmployees": [],
          "formula": "progress / (daysUsed / totalDays) - (10 - averageActionRating) * 10",
          "formulaProjectTask": "taskTimePoint + taskQualityPoint + taskCostPoint",
          "formulaProjectMember": "memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint",
          "name": "Đánh giá cơ sở hạ tầng mạng nội bộ",
          "description": "Đánh giá cơ sở hạ tầng mạng nội bộ",
          "collaboratedWithOrganizationalUnits": [],
          "preceedingTasks": ["T01"],
          "estimateNormalTime": 6,
          "estimateOptimisticTime": 4,
          "estimateNormalCost": null,
          "estimateMaxCost": null,
          "estimateAssetCost": 1000000,
          "actorsWithSalary": [
            {
              "userId": usDanhNV._id,
              "salary": 0,
              "weight": 80
            },
            {
              "userId": usCucVT._id,
              "salary": 0,
              "weight": 20
            }
          ],
          "totalResWeight": 80,
          "taskInformations": [],
          "taskActions": []
        }
      ],
    }
  ])

  console.log(`Xong! Dữ liệu mẫu dự án đã được tạo`);

  /**
   * Ngắt kết nối db
   */
  systemDB.close();
  vnistDB.close();

  console.log("End init sample company database!");
};

initHumanResourceData().catch((err) => {
  console.log(err);
  process.exit(0);
});
