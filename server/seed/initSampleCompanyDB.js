const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Terms = require('../helpers/config');
const linksPermission = require('../middleware/servicesPermission').links;
const saleOrders = require('./SaleOrders.json');
const listCustomer = require('./Customer.json');
const listTransport3Orders = require('./transport3orders.json');
const listTransport3Schedules = require('./transport3schedule.json');
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

  Configuration,
  RootRole,
  SystemLink,
  SystemComponent,
  SystemApi,

  Major,
  Certificate,
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

  Stock,
  BinLocation,
  Lot,
  Bill,
  Category,
  Good,
  SalesOrder,

  Tax,
  ServiceLevelAgreement,
  Discount,
  BankAccount,
  CoinRule,
  Quote,
  BusinessDepartment,

  Customer,
  CustomerCare,
  CustomerCareType,
  CustomerGroup,
  CustomerStatus,
  CustomerRankPoint,
  CustomerCareUnit,

  ManufacturingWorks,
  ManufacturingMill,
  ManufacturingPlan,
  ManufacturingCommand,
  WorkSchedule,
  ManufacturingQualityError,
  ManufacturingQualityCriteria,
  ManufacturingQualityInspection,
  ManufacturingRouting,

  TransportRequirement,
  TransportDepartment,
  TransportVehicle,
  TransportPlan,
  TransportSchedule,
  DeliverySchedule,
  ProductRequestManagement,
  SuppliesPurchaseRequest,
  Supplies,
  PurchaseInvoice,
  AllocationHistory,
  AllocationConfigSetting,
  Transport3Employee,
  Transport3Order,
  Transport3Schedule,
  Transport3Vehicle
} = require('../models');
const { ObjectId } = require('mongodb');

require('dotenv').config();

const initSampleCompanyDB = async () => {
  console.log('Init sample company database, ...');

  /**
   * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
   */
  let connectOptions =
    process.env.DB_AUTHENTICATION === 'true'
      ? {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
          user: process.env.DB_USERNAME,
          pass: process.env.DB_PASSWORD,
          auth: {
            authSource: 'admin',
          },
        }
      : {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        };
  const systemDB = mongoose.createConnection(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${
      process.env.DB_NAME
    }`,
    connectOptions
  );

  let connectVNISTOptions =
    process.env.DB_AUTHENTICATION === 'true'
      ? {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
          user: process.env.DB_USERNAME,
          pass: process.env.DB_PASSWORD,
          auth: {
            authSource: 'admin',
          },
        }
      : {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        };
  const vnistDB = mongoose.createConnection(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
    connectVNISTOptions
  );
  await Configuration(systemDB).insertMany([
    {
      name: 'vnist',
      backup: {
        time: {
          second: '0',
          minute: '0',
          hour: '2',
          date: '1',
          month: '*',
          day: '*',
        },
        limit: 10,
      },
    },
  ]);

  /**
   * 1.1 Khởi tạo model cho db
   */
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
    if (!db.models.EducationProgram) EducationProgram(db);
    if (!db.models.Course) Course(db);

    if (!db.models.Asset) Asset(db);
    if (!db.models.AssetType) AssetType(db);
    if (!db.models.RecommendProcure) RecommendProcure(db);
    if (!db.models.RecommendDistribute) RecommendDistribute(db);

    if (!db.models.Document) Document(db);
    if (!db.models.DocumentArchive) DocumentArchive(db);
    if (!db.models.DocumentDomain) DocumentDomain(db);
    if (!db.models.DocumentCategory) DocumentCategory(db);

    if (!db.models.Stock) Stock(db);
    if (!db.models.BinLocation) BinLocation(db);
    if (!db.models.Bill) Bill(db);
    if (!db.models.Lot) Lot(db);
    if (!db.models.Category) Category(db);
    if (!db.models.Good) Good(db);
    if (!db.models.Tax) Tax(db);
    if (!db.models.ServiceLevelAgreement) ServiceLevelAgreement(db);
    if (!db.models.Discount) Discount(db);
    if (!db.models.BankAccount) BankAccount(db);
    if (!db.models.CoinRule) CoinRule(db);
    if (!db.models.Quote) Quote(db);
    if (!db.models.BusinessDepartment) Discount(db);
    if (!db.models.SalesOrder) BankAccount(db);
    if (!db.models.Payment) CoinRule(db);
    if (!db.models.PurchaseOrder) Quote(db);
    if (!db.models.SalesOrder) SalesOrder(db);

    if (!db.models.Customer) Customer(db);
    if (!db.models.CustomerCare) CustomerCare(db);
    if (!db.models.CustomerCareType) CustomerCareType(db);
    if (!db.models.CustomerGroup) CustomerGroup(db);
    if (!db.models.CustomerStatus) CustomerStatus(db);

    if (!db.models.ManufacturingWorks) ManufacturingWorks(db);
    if (!db.models.ManufacturingMill) ManufacturingMill(db);
    if (!db.models.ManufacturingPlan) ManufacturingPlan(db);
    if (!db.models.ManufacturingCommand) ManufacturingCommand(db);
    if (!db.models.ManufacturingQualityError) ManufacturingQualityError(db);
    if (!db.models.ManufacturingQualityCriteria) ManufacturingQualityCriteria(db);
    if (!db.models.ManufacturingQualityInspection) ManufacturingQualityInspection(db);
    if (!db.models.ManufacturingRouting) ManufacturingRouting(db);

    if (!db.models.TransportDepartment) TransportDepartment(db);
    if (!db.models.TransportVehicle) TransportVehicle(db);
    if (!db.models.TransportRequirement) TransportRequirement(db);
    if (!db.models.TransportPlan) TransportPlan(db);
    if (!db.models.TransportSchedule) TransportSchedule(db);
    if (!db.models.Transport3Employee) Transport3Employee(db);
    if (!db.models.Transport3Order) Transport3Order(db);
    if (!db.models.Transport3Schedule) Transport3Schedule(db);
    if (!db.models.Transport3Vehicle) Transport3Vehicle(db);
    if (!db.models.AllocationConfigSetting) AllocationConfigSetting(db);
    if (!db.models.DeliverySchedule) DeliverySchedule(db);
    if (!db.models.ProductRequestManagement) ProductRequestManagement(db);

    // console.log("models_list", db.models);
  };

  initModels(vnistDB);
  initModels(systemDB);

  /**
   * 2. Xóa dữ liệu db cũ của công ty vnist
   */
  vnistDB.dropDatabase();

  /**
   * 3. Khởi tạo dữ liệu về công ty VNIST trong database của hệ thống
   */
  const vnist = await Company(systemDB).create({
    name: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    shortName: 'vnist',
    description:
      'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
  });
  console.log(`Xong! Công ty [${vnist.name}] đã được tạo.`);

  /**
   * 4. Tạo các tài khoản người dùng trong csdl của công ty VNIST
   */
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync('vnist123@', salt);

  const users = await User(vnistDB).insertMany([
    {
      name: 'Super Admin VNIST',
      email: 'super.admin.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Admin VNIST',
      email: 'admin.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Văn An',
      email: 'nva.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Văn Bình',
      email: 'tvb.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Vũ Thị Cúc',
      email: 'vtc.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Văn Danh',
      email: 'nvd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Thị Én',
      email: 'tte.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Phạm Đình Phúc',
      email: 'pdp.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Bình Minh',
      email: 'minhtb.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Thị Nhung',
      email: 'nhungnt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Minh Đức',
      email: 'tmd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Việt Anh',
      email: 'nguyenvietanh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Viết Thái',
      email: 'nguyenvietthai.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Mỹ Hạnh',
      email: 'tranmyhanh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Minh Thành',
      email: 'nguyenminhthanh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Gia Huy',
      email: 'nguyengiahuy.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Minh Anh',
      email: 'tranminhanh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Hùng Cường',
      email: 'cuongth.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Văn Thái',
      email: 'thainv.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Tiến Đạt',
      email: 'datnt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Vũ Tiến Dũng',
      email: 'dungvt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Đức Minh',
      email: 'minhmd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Lê Đình Thiện',
      email: 'thienld.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Phạm Tấn Hưng',
      email: 'hungpt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
  ]);
  // console.log("Dữ liệu tài khoản người dùng cho công ty VNIST", users);

  let vnistCom = await Company(systemDB).findById(vnist._id);
  vnistCom.superAdmin = users[0]._id;
  await vnistCom.save();

  /**
   * 5. Tạo các role mặc định cho công ty vnist
   */
  await RoleType(vnistDB).insertMany([
    { name: Terms.ROLE_TYPES.ROOT },
    { name: Terms.ROLE_TYPES.POSITION },
    { name: Terms.ROLE_TYPES.COMPANY_DEFINED },
  ]);
  const roleAbstract = await RoleType(vnistDB).findOne({
    name: Terms.ROLE_TYPES.ROOT,
  });
  const roleChucDanh = await RoleType(vnistDB).findOne({
    name: Terms.ROLE_TYPES.POSITION,
  });
  const roleTuDinhNghia = await RoleType(vnistDB).findOne({
    name: Terms.ROLE_TYPES.COMPANY_DEFINED,
  });
  const roleAdmin = await Role(vnistDB).create({
    name: Terms.ROOT_ROLES.ADMIN.name,
    type: roleAbstract._id,
  });
  const roleSuperAdmin = await Role(vnistDB).create({
    name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
    type: roleAbstract._id,
    parents: [roleAdmin._id],
  });
  const roleManager = await Role(vnistDB).create({
    name: Terms.ROOT_ROLES.MANAGER.name,
    type: roleAbstract._id,
  });
  const roleDeputyManager = await Role(vnistDB).create({
    name: Terms.ROOT_ROLES.DEPUTY_MANAGER.name,
    type: roleAbstract._id,
  });
  const roleEmployee = await Role(vnistDB).create({
    name: Terms.ROOT_ROLES.EMPLOYEE.name,
    type: roleAbstract._id,
  });

  const thanhVienBGĐ = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Thành viên ban giám đốc',
    type: roleChucDanh._id,
  });
  const phoGiamDoc = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, thanhVienBGĐ._id],
    name: 'Phó giám đốc',
    type: roleChucDanh._id,
  });
  const giamDoc = await Role(vnistDB).create({
    parents: [roleManager._id, thanhVienBGĐ._id, phoGiamDoc._id],
    name: 'Giám đốc',
    type: roleChucDanh._id,
  });

  //Khởi tạo Role cho bộ phận kinh doanh
  const nvKinhDoanh247 = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên phòng kinh doanh 247',
    type: roleChucDanh._id,
  });
  const truongPhongKinhDoanh247 = await Role(vnistDB).create({
    parents: [roleManager._id, nvKinhDoanh247._id],
    name: 'Trưởng phòng kinh doanh 247',
    type: roleChucDanh._id,
  });
  const nvKinhDoanh123 = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên phòng kinh doanh 123',
    type: roleChucDanh._id,
  });
  const truongPhongKinhDoanh123 = await Role(vnistDB).create({
    parents: [roleManager._id, nvKinhDoanh123._id],
    name: 'Trưởng phòng kinh doanh 123',
    type: roleChucDanh._id,
  });
  const keToanVien = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Kế toán viên',
    type: roleChucDanh._id,
  });
  const keToanTruong = await Role(vnistDB).create({
    parents: [roleManager._id, keToanVien._id],
    name: 'Kế toán trưởng',
    type: roleChucDanh._id,
  });
  const nvSalesAdmin = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên qản lý bán hàng',
    type: roleChucDanh._id,
  });
  const truongPhongSalesAdmin = await Role(vnistDB).create({
    parents: [roleManager._id, nvSalesAdmin._id],
    name: 'Trưởng phòng quản lý bán hàng',
    type: roleChucDanh._id,
  });
  const giamDocKinhDoanh = await Role(vnistDB).create({
    parents: [
      roleManager._id,
      nvKinhDoanh247._id,
      truongPhongKinhDoanh247._id,
      nvKinhDoanh123._id,
      truongPhongKinhDoanh123._id,
    ],
    name: 'Giám đốc kinh doanh',
    type: roleChucDanh._id,
  });
  //Kết thúc phần khởi tạo role cho bộ phận kinh doanh

  const nvPhongHC = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên phòng nhân sự',
    type: roleChucDanh._id,
  });
  const phoPhongHC = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, nvPhongHC._id],
    name: 'Phó phòng nhân sự',
    type: roleChucDanh._id,
  });
  const truongPhongHC = await Role(vnistDB).create({
    parents: [roleManager._id, nvPhongHC._id, phoPhongHC._id],
    name: 'Trưởng phòng nhân sự',
    type: roleChucDanh._id,
  });

  // Khỏi tạo role cho phòng kế hoạch

  const nvPhongKH = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên phòng kế hoạch',
    type: roleChucDanh._id,
  });
  const phoPhongKH = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, nvPhongKH._id],
    name: 'Phó phòng kế hoạch',
    type: roleChucDanh._id,
  });
  const truongPhongKH = await Role(vnistDB).create({
    parents: [roleManager._id, nvPhongKH._id, phoPhongKH._id],
    name: 'Trưởng phòng kế hoạch',
    type: roleChucDanh._id,
  });

  // Khỏi tạo role cho khối sản xuất

  const nvNhaMayThuocBot = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên nhà máy thuốc bột',
    type: roleChucDanh._id,
  });

  const nvXuongNguyenLieu = await Role(vnistDB).create({
    parents: [roleEmployee._id, nvNhaMayThuocBot._id],
    name: 'Nhân viên xử lý nguyên liệu',
    type: roleChucDanh._id,
  });

  const nvXuongXay = await Role(vnistDB).create({
    parents: [roleEmployee._id, nvNhaMayThuocBot._id],
    name: 'Nhân viên vận hành máy xay',
    type: roleChucDanh._id,
  });

  const nvXuongTron = await Role(vnistDB).create({
    parents: [roleEmployee._id, nvNhaMayThuocBot._id],
    name: 'Nhân viên vận hành máy trộn',
    type: roleChucDanh._id,
  });

  const nvXuongNen = await Role(vnistDB).create({
    parents: [roleEmployee._id, nvNhaMayThuocBot._id],
    name: 'Nhân viên vận hành máy nén',
    type: roleChucDanh._id,
  });

  const nvXuongDongGoi = await Role(vnistDB).create({
    parents: [roleEmployee._id, nvNhaMayThuocBot._id],
    name: 'Nhân viên đóng gói',
    type: roleChucDanh._id,
  });

  const quanDocNhaMayThuocBot = await Role(vnistDB).create({
    parents: [roleManager._id, nvNhaMayThuocBot._id],
    name: 'Quản đốc nhà máy thuốc bột',
    type: roleChucDanh._id,
  });

  const nvNhaMayThuocNuoc = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên nhà máy thuốc nước',
    type: roleChucDanh._id,
  });

  const quanDocNhaMayThuocNuoc = await Role(vnistDB).create({
    parents: [roleManager._id, nvNhaMayThuocNuoc._id],
    name: 'Quản đốc nhà máy thuốc nước',
    type: roleChucDanh._id,
  });

  const nvNhaMayTPCN = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên nhà máy thực phẩm chức năng',
    type: roleChucDanh._id,
  });

  const quanDocNhaMayTPCN = await Role(vnistDB).create({
    parents: [roleManager._id, nvNhaMayTPCN._id],
    name: 'Quản đốc nhà máy thực phẩm chức năng',
    type: roleChucDanh._id,
  });
  // Kho Trần Đại Nghĩa
  const nvKhoTDN = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên kho Trần Đại Nghĩa',
    type: roleChucDanh._id,
  });

  const keToanKhoTDN = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Kế toán kho Trần Đại Nghĩa',
    type: roleChucDanh._id,
  });

  const phoKhoTDN = await Role(vnistDB).create({
    parents: [roleManager._id, nvKhoTDN._id, keToanKhoTDN._id],
    name: 'Phó kho Trần Đại Nghĩa',
    type: roleChucDanh._id,
  });

  const thuKhoTDN = await Role(vnistDB).create({
    parents: [roleManager._id, nvKhoTDN._id, phoKhoTDN._id, keToanKhoTDN._id],
    name: 'Thủ Kho Trần Đại Nghĩa',
    type: roleChucDanh._id,
  });
  // Kho Tạ Quang Bửu

  const nvKhoTQB = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên kho Tạ Quang Bửu',
    type: roleChucDanh._id,
  });

  const keToanKhoTQB = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Kế toán kho Tạ Quang Bửu',
    type: roleChucDanh._id,
  });

  const phoKhoTQB = await Role(vnistDB).create({
    parents: [roleManager._id, nvKhoTQB._id, keToanKhoTQB._id],
    name: 'Phó kho Tạ Quang Bửu',
    type: roleChucDanh._id,
  });

  const thuKhoTQB = await Role(vnistDB).create({
    parents: [roleManager._id, nvKhoTQB._id, phoKhoTQB._id, keToanKhoTQB._id],
    name: 'Thủ Kho Trần Tạ Quang Bửu',
    type: roleChucDanh._id,
  });
  // Khỏi tạo role cho phòng chăm sóc khách hàng

  const nvPhongCSKH = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên phòng CSKH',
    type: roleChucDanh._id,
  });
  const phoPhongCSKH = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, nvPhongCSKH._id],
    name: 'Phó phòng CSKH',
    type: roleChucDanh._id,
  });
  const truongPhongCSKH = await Role(vnistDB).create({
    parents: [roleManager._id, nvPhongCSKH._id, phoPhongCSKH._id],
    name: 'Trưởng phòng CSKH',
    type: roleChucDanh._id,
  });

  // Khởi tạo role cho đơn vị vận chuyển
  const vcNvVanChuyen = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Nhân viên vận chuyển',
    type: roleChucDanh._id,
  });
  const vcNvGiamSat = await Role(vnistDB).create({
    parents: [roleDeputyManager._id],
    name: 'Nhân viên giám sát',
    type: roleChucDanh._id,
  });
  const vcTruongPhong = await Role(vnistDB).create({
    parents: [roleManager._id],
    name: 'Trưởng phòng vận chuyển',
    type: roleChucDanh._id,
  });

  console.log('Dữ liệu các phân quyền cho công ty VNIST');

  /**
   * 6. Gán phân quyền cho các vị trí trong công ty
   */
  await UserRole(vnistDB).insertMany([
    {
      // Gán tài khoản super.admin.vnist có role là Super Admin của công ty VNIST
      userId: users[0]._id,
      roleId: roleSuperAdmin._id,
    },
    {
      userId: users[1]._id, // Gán tài khoản admin.vnist có role là admin
      roleId: roleAdmin._id,
    },
    // Tiếp tục gán chức danh vai trò của phòng ban cho nhân viên:
    {
      // Giám đốc Nguyễn Văn An
      userId: users[2]._id,
      roleId: giamDoc._id,
    },
    {
      // Phó giám đốc Trần Văn Bình
      userId: users[3]._id,
      roleId: phoGiamDoc._id,
    },
    {
      // Thành viên ban giám đốc Vũ Thị Cúc
      userId: users[4]._id,
      roleId: thanhVienBGĐ._id,
    },
    {
      // Trưởng phòng kinh doanh Nguyễn Văn Danh
      userId: users[5]._id,
      roleId: truongPhongHC._id,
    },
    {
      // Nguyễn Văn Danh cũng là thành viên ban giám đốc
      userId: users[5]._id,
      roleId: thanhVienBGĐ._id,
    },

    {
      // Nhân viên phòng nhân sự Phạm Đình Phúc
      userId: users[7]._id,
      roleId: nvPhongHC._id,
    },

    {
      userId: users[8]._id,
      roleId: nvPhongHC._id,
    },
    {
      userId: users[9]._id,
      roleId: nvPhongHC._id,
    },
    // Gán quyền cho phòng kế hoạch
    {
      userId: users[12]._id,
      roleId: phoPhongKH._id,
    },
    {
      userId: users[13]._id,
      roleId: truongPhongKH._id,
    },
    // Gán quyền cho khối sản xuất

    {
      // Quản đốc nhà máy thuốc bột
      userId: users[11]._id,
      roleId: quanDocNhaMayThuocBot._id,
    },
    {
      // Quản đốc nhà máy thuốc nước
      userId: users[12]._id,
      roleId: quanDocNhaMayThuocNuoc._id,
    },
    {
      // Quản đốc nhà máy thực phẩm chức năng
      userId: users[13]._id,
      roleId: quanDocNhaMayTPCN._id,
    },

    {
      // Nhân viên nhà máy thuôc bột
      userId: users[14]._id,
      roleId: nvNhaMayThuocBot._id,
    },
    {
      userId: users[15]._id,
      roleId: nvNhaMayThuocBot._id,
    },
    {
      userId: users[16]._id,
      roleId: nvNhaMayThuocBot._id,
    },
    {
      // Nhân viên nguyên liệu nhà máy thuôc bột
      userId: users[19]._id,
      roleId: nvXuongNguyenLieu._id,
    },
    {
      userId: users[20]._id,
      roleId: nvXuongNguyenLieu._id,
    },
    {
      // Nhân viên xay nhà máy thuôc bột
      userId: users[20]._id,
      roleId: nvXuongXay._id,
    },
    {
      userId: users[21]._id,
      roleId: nvXuongXay._id,
    },
    {
      // Nhân viên trộn nhà máy thuôc bột
      userId: users[21]._id,
      roleId: nvXuongTron._id,
    },
    {
      userId: users[22]._id,
      roleId: nvXuongTron._id,
    },
    {
      // Nhân viên nén nhà máy thuôc bột
      userId: users[22]._id,
      roleId: nvXuongNen._id,
    },
    {
      userId: users[23]._id,
      roleId: nvXuongNen._id,
    },
    {
      // Nhân viên đóng gói nhà máy thuôc bột
      userId: users[23]._id,
      roleId: nvXuongDongGoi._id,
    },
    {
      userId: users[19]._id,
      roleId: nvXuongDongGoi._id,
    },
    {
      // Nhân viên nhà máy thuôc nước
      userId: users[5]._id,
      roleId: nvNhaMayThuocNuoc._id,
    },

    {
      userId: users[8]._id,
      roleId: nvNhaMayTPCN._id,
    },
    {
      userId: users[9]._id,
      roleId: nvNhaMayTPCN._id,
    },
    {
      userId: users[10]._id,
      roleId: nvNhaMayTPCN._id,
    },

    // nhân viên kho Trần Đại Nghĩa
    {
      userId: users[5]._id,
      roleId: nvKhoTDN._id,
    },
    {
      userId: users[8]._id,
      roleId: nvKhoTDN._id,
    },
    {
      userId: users[9]._id,
      roleId: nvKhoTDN._id,
    },
    {
      userId: users[10]._id,
      roleId: nvKhoTDN._id,
    },

    //Gán quyền cho bộ phận kinh doanh
    {
      userId: users[2]._id,
      roleId: giamDocKinhDoanh._id,
    },
    {
      userId: users[3]._id,
      roleId: truongPhongKinhDoanh247._id,
    },
    {
      userId: users[4]._id,
      roleId: nvKinhDoanh247._id,
    },
    {
      userId: users[5]._id,
      roleId: nvKinhDoanh247._id,
    },
    {
      userId: users[8]._id,
      roleId: nvKinhDoanh123._id,
    },
    {
      userId: users[9]._id,
      roleId: keToanTruong._id,
    },
    {
      userId: users[10]._id,
      roleId: keToanVien._id,
    },
    {
      userId: users[11]._id,
      roleId: truongPhongSalesAdmin._id,
    },
    {
      userId: users[12]._id,
      roleId: nvSalesAdmin._id,
    }, //2 cái
    //phân quyền cho phòng CSKH ??? 2 dâu ,
    //, //1 cái
    {
      // Nguyễn Văn Danh cũng là trưởng phòng CSKH
      userId: users[5]._id,
      roleId: truongPhongCSKH._id,
    },
    {
      // nhân viên CSKH Trần Thị Én
      userId: users[6]._id,
      roleId: nvPhongCSKH._id,
    },
    {
      // Nhân viên CSKH Phạm Đình Phúc
      userId: users[7]._id,
      roleId: nvPhongCSKH._id,
    },

    // Đơn vị vận chuyển-------------------------------------------------
    {
      // nva trưởng phòng vận chuyển phía bắc
      userId: users[2]._id,
      roleId: vcTruongPhong._id,
    },
    {
      // admin nhân viên giám sát phía bắc,
      userId: users[1]._id,
      roleId: vcNvGiamSat._id,
    },
    {
      // tvb nhân viên giám sát phía bắc
      userId: users[3]._id,
      roleId: vcNvGiamSat._id,
    },
    {
      // vtv nhân viên vận chuyển phía bắc
      userId: users[4]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // nvd nhân viên vận chuyển phía bắc
      userId: users[5]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // tte nhân viên vận chuyển phía bắc
      userId: users[6]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // pdp nhân viên vận chuyển phía bắc
      userId: users[7]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // tvb nhân viên vận chuyển phía bắc
      userId: users[8]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // tte nhân viên vận chuyển phía bắc
      userId: users[9]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // pdp nhân viên vận chuyển phía bắc
      userId: users[10]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // tvb nhân viên vận chuyển phía bắc
      userId: users[11]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // tte nhân viên vận chuyển phía bắc
      userId: users[12]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // pdp nhân viên vận chuyển phía bắc
      userId: users[13]._id,
      roleId: vcNvVanChuyen._id,
    },
    {
      // tvb nhân viên vận chuyển phía bắc
      userId: users[14]._id,
      roleId: vcNvVanChuyen._id,
    },
  ]);

  /**
   * 7. Tạo dữ liệu các phòng ban cho công ty VNIST
   */
  const Directorate = await OrganizationalUnit(vnistDB).create({
    // Khởi tạo ban giám đốc công ty
    name: 'Ban giám đốc',
    description:
      'Ban giám đốc Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [giamDoc._id],
    deputyManagers: [phoGiamDoc._id],
    employees: [thanhVienBGĐ._id],
    parent: null,
  });

  // Khởi tạo cơ cấu tổ chức bộ phận kinh doanh
  const boPhanKinhDoanh = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: 'Bộ phận kinh doanh',
      description: 'Bao gồm các phòng ban kinh doanh',
      managers: [giamDocKinhDoanh._id],
      parent: Directorate._id,
    },
  ]);
  // Khởi tạo cơ cấu tổ chức bộ phận CSKH
  const boPhanCSKH = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: 'Phòng Chăm sóc khách hàng',
      description: 'Phòng chăm sóc khách hàng',
      managers: [truongPhongCSKH._id],
      parent: Directorate._id,
      deputyManagers: [phoPhongCSKH._id],
      employees: [nvPhongCSKH._id],
    },
  ]);

  // const phongKinhDoanh247 = await OrganizationalUnit(vnistDB).insertMany([
  //     {
  //         name: "Phòng kinh doanh 247",
  //         description:
  //             "Phòng kinh doanh 247",
  //         managers: [truongPhongKinhDoanh247._id],
  //         employees: [nvKinhDoanh247._id],
  //         parent: boPhanKinhDoanh._id,
  //     },
  // ]);

  // const phongKinhDoanh123 = await OrganizationalUnit(vnistDB).insertMany([
  //     {
  //         name: "Phòng kinh doanh 123",
  //         description:
  //             "Phòng kinh doanh 123",
  //         managers: [truongPhongKinhDoanh123._id],
  //         employees: [nvKinhDoanh123._id],
  //         parent: boPhanKinhDoanh._id,
  //     },
  // ]);

  // const boPhanKeToan = await OrganizationalUnit(vnistDB).insertMany([
  //     {
  //         name: "Bộ phận kế toán",
  //         description:
  //             "Bộ phận kế toán",
  //         managers: [keToanTruong._id],
  //         employees: [keToanVien._id],
  //         parent: boPhanKinhDoanh._id,
  //     },
  // ]);

  // const boPhanSalesAdmin = await OrganizationalUnit(vnistDB).insertMany([
  //     {
  //         name: "Bộ phận Sales Admin",
  //         description:
  //             "Bộ phận Sales Admin",
  //         managers: [truongPhongSalesAdmin._id],
  //         employees: [nvSalesAdmin._id],
  //         parent: boPhanKinhDoanh._id,
  //     },
  // ]);

  // console.log("Đã tạo dữ liệu các phòng ban kinh doanh",
  //     boPhanKinhDoanh,
  //     phongKinhDoanh247,
  //     phongKinhDoanh123,
  //     boPhanKeToan,
  //     boPhanSalesAdmin
  // )

  const departments = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: 'Phòng nhân sự',
      description: 'Phòng nhân sự',
      managers: [truongPhongHC._id],
      deputyManagers: [phoPhongHC._id],
      employees: [nvPhongHC._id],
      parent: Directorate._id,
    },
  ]);

  // Khỏi tạo cơ cấu tổ chức cho khối sản xuất
  const nhamaythuocbot = await OrganizationalUnit(vnistDB).create({
    name: 'Nhà máy sản xuất thuốc bột',
    description:
      'Nhà máy sản xuất thuốc bột của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [quanDocNhaMayThuocBot._id],
    deputyManagers: [],
    employees: [nvNhaMayThuocBot._id, nvXuongNguyenLieu._id, nvXuongXay._id, nvXuongTron._id, nvXuongNen._id, nvXuongDongGoi._id],
    parent: Directorate._id,
  });
  const nhamaythuocnuoc = await OrganizationalUnit(vnistDB).create({
    name: 'Nhà máy sản xuất thuốc nước',
    description:
      'Nhà máy sản xuất thuốc nước của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [quanDocNhaMayThuocNuoc._id],
    deputyManagers: [],
    employees: [nvNhaMayThuocNuoc._id],
    parent: Directorate._id,
  });
  const nhamaythucphamchucnang = await OrganizationalUnit(vnistDB).create({
    name: 'Nhà máy sản xuất thực phẩm chức năng',
    description:
      'Nhà máy sản xuất thực phẩm chức năng của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [quanDocNhaMayTPCN._id],
    deputyManagers: [],
    employees: [nvNhaMayTPCN._id],
    parent: Directorate._id,
  });

  // Vận chuyển
  const phongVanChuyen = await OrganizationalUnit(vnistDB).create({
    name: 'Phòng vận chuyển miền bắc',
    description:
      'Đơn vị vận chuyển khu vực miền bắc của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [vcTruongPhong._id],
    deputyManagers: [vcNvGiamSat._id],
    employees: [vcNvVanChuyen._id],
    parent: Directorate._id,
  });

  const phongkehoach = await OrganizationalUnit(vnistDB).create({
    name: 'Phòng kế hoạch',
    description:
      'Phòng kế hoạch của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [truongPhongKH._id],
    deputyManagers: [phoPhongKH._id],
    employees: [nvPhongKH._id],
    parent: Directorate._id,
  });
  const bophankho = await OrganizationalUnit(vnistDB).create({
    name: 'Bộ phận kho',
    description:
      'Bộ phận kho của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    parent: Directorate._id,
  });
  const khoTDN = await OrganizationalUnit(vnistDB).create({
    name: 'Kho Trần Đại Nghĩa',
    description:
      'Kho Trần Đại Nghĩa của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [thuKhoTDN._id],
    deputyManagers: [phoKhoTDN._id],
    employees: [nvKhoTDN._id, keToanKhoTDN._id],
    parent: bophankho._id,
  });
  const khoTQB = await OrganizationalUnit(vnistDB).create({
    name: 'Kho Tạ Quang Bửu',
    description:
      'Kho Tạ Quang Bửu của Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
    managers: [thuKhoTQB._id],
    deputyManagers: [phoKhoTQB._id],
    employees: [nvKhoTQB._id, keToanKhoTQB._id],
    parent: bophankho._id,
  });

  /**
   * 7. Tạo dữ liệu các phòng ban cho công ty VNIST, workspace thứ 2
   */
  const users2 = await User(vnistDB).insertMany([
    {
      name: 'Trần Hữu Hiến',
      email: 'thh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Bùi Mạnh Dũng',
      email: 'bmd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Thị Minh Châu',
      email: 'ntmc.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Mạnh Hiếu',
      email: 'nmh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trịnh Phú Quang',
      email: 'tpq.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Ngô Văn Thức',
      email: 'nvt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Tài Khoa',
      email: 'ntk.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Dương Đức Huy',
      email: 'ddh.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Lê Bá Trọng',
      email: 'lbt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Đinh Huy Dương',
      email: 'dhd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Lê Đàm Quân test',
      email: 'ldq.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Minh Chiến test',
      email: 'nmc.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Chu Văn Thành test',
      email: 'cvt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Hoàng Thương test',
      email: 'nht.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Dương Đăng Quang test',
      email: 'ddq.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Khánh Duy test',
      email: 'nkd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Tô Duy Tường',
      email: 'tdt.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Trần Tiến Đạt',
      email: 'ttd.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Lâm Anh Quân',
      email: 'laq.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Hoàng Sĩ Vương',
      email: 'hsv.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Nguyễn Vũ Thục Anh',
      email: 'nvta.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Lê Quang Minh',
      email: 'lqm.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Lê Thanh Giang',
      email: 'ltg.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Uông Hồng Minh',
      email: 'vtk.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    {
      name: 'Đinh Thị Ngọc Anh',
      email: 'dtna.vnist@gmail.com',
      password: hash,
      company: vnist._id,
    },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
    // {
    //   name: 'Đinh Thị Ngọc Anh test1tst2tes3',
    //   email: 'dádasdtna.vnist@gmail.com',
    //   password: hash,
    //   company: vnist._id,
    // },
  ]);

  //Khởi tạo Role cho bộ phận kinh doanh
  const thanhVienPhongKinhDoanh2 = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Thành viên phòng kinh doanh công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const phoPhongPhongKinhDoanh2 = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, thanhVienPhongKinhDoanh2._id],
    name: 'Phó phòng phòng kinh doanh công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const giamDocPhongKinhDoanh2 = await Role(vnistDB).create({
    parents: [
      roleManager._id,
      thanhVienPhongKinhDoanh2._id,
      phoPhongPhongKinhDoanh2._id,
    ],
    name: 'Giám đốc phòng kinh doanh công ty VNIST 2',
    type: roleChucDanh._id,
  });
  //Kết thúc phần khởi tạo role cho bộ phận kinh doanh

  //Khởi tạo Role cho phòng chăm sóc khách hàng
  const thanhVienPhongChamSocKhachHang2 = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Thành viên phòng chăm sóc khách hàng công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const phoPhongPhongChamSocKhachHang2 = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, thanhVienPhongChamSocKhachHang2._id],
    name: 'Phó phòng phòng chăm sóc khách hàng công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const giamDocPhongChamSocKhachHang2 = await Role(vnistDB).create({
    parents: [
      roleManager._id,
      thanhVienPhongChamSocKhachHang2._id,
      phoPhongPhongChamSocKhachHang2._id,
    ],
    name: 'Trưởng phòng phòng chăm sóc khách hàng công ty VNIST 2',
    type: roleChucDanh._id,
  });
  //Kết thúc phần khởi tạo role cho phòng chăm sóc khách hàng

  //Khởi tạo Role cho phòng nhân sự
  const thanhVienPhongNhanSu2 = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Thành viên phòng nhân sự công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const phoPhongPhongNhanSu2 = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, thanhVienPhongNhanSu2._id],
    name: 'Phó phòng phòng nhân sự công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const giamDocPhongNhanSu2 = await Role(vnistDB).create({
    parents: [
      roleManager._id,
      thanhVienPhongNhanSu2._id,
      phoPhongPhongNhanSu2._id,
    ],
    name: 'Trưởng phòng phòng nhân sự công ty VNIST 2',
    type: roleChucDanh._id,
  });
  //Kết thúc phần khởi tạo role cho phòng nhân sự

  //Khởi tạo Role cho phòng kế hoạch
  // const thanhVienPhongKeHoach2 = await Role(vnistDB).create({
  //   parents: [roleEmployee._id],
  //   name: 'Thành viên phòng kế hoạch công ty VNIST 2',
  //   type: roleChucDanh._id,
  // });

  // const phoPhongPhongKeHoach2 = await Role(vnistDB).create({
  //   parents: [roleDeputyManager._id, thanhVienPhongKeHoach2._id],
  //   name: 'Phó phòng phòng kế hoạch công ty VNIST 2',
  //   type: roleChucDanh._id,
  // });

  // const giamDocPhongKeHoach2 = await Role(vnistDB).create({
  //   parents: [roleManager._id, thanhVienPhongKeHoach2._id, phoPhongPhongKeHoach2._id],
  //   name: 'Trưởng phòng phòng kế hoạch công ty VNIST 2',
  //   type: roleChucDanh._id,
  // });
  //Kết thúc phần khởi tạo role cho phòng kế hoạch

  //Khởi tạo Role cho giám đốc
  const thanhVienBanGiamDoc2 = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: 'Thành viên ban giám đốc công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const phoGiamDoc2 = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, thanhVienBanGiamDoc2._id],
    name: 'Phó giám đốc công ty VNIST 2',
    type: roleChucDanh._id,
  });

  const giamDoc2 = await Role(vnistDB).create({
    parents: [roleManager._id, thanhVienBanGiamDoc2._id, phoGiamDoc2._id],
    name: 'Giám đốc công ty VNIST 2',
    type: roleChucDanh._id,
  });
  //Kết thúc phần khởi tạo role cho giám đốc

  const Directorate2 = await OrganizationalUnit(vnistDB).create({
    // Khởi tạo ban giám đốc công ty
    name: 'Ban giám đốc công ty VNIST 2',
    description:
      'Ban giám đốc Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam Second',
    managers: [giamDoc2._id],
    deputyManagers: [phoGiamDoc2._id],
    employees: [thanhVienBanGiamDoc2._id],
    parent: null,
  });

  // Khởi tạo cơ cấu tổ chức bộ phận kinh doanh
  const boPhanKinhDoanh2 = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: 'Bộ phận kinh doanh công ty VNIST 2',
      description: 'Bao gồm các phòng ban kinh doanh',
      managers: [giamDocPhongKinhDoanh2._id],
      deputyManagers: [phoPhongPhongKinhDoanh2._id],
      employees: [thanhVienPhongKinhDoanh2._id],
      parent: Directorate2._id,
    },
  ]);
  // Khởi tạo cơ cấu tổ chức bộ phận CSKH
  const phongChamSocKhachHang2 = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: 'Phòng Chăm sóc khách hàng công ty VNIST 2',
      description: 'Phòng chăm sóc khách hàng công ty VNIST 2',
      managers: [giamDocPhongChamSocKhachHang2._id],
      parent: Directorate2._id,
      deputyManagers: [phoPhongPhongChamSocKhachHang2._id],
      employees: [thanhVienPhongChamSocKhachHang2._id],
    },
  ]);

  const phongNhanSu2 = await OrganizationalUnit(vnistDB).insertMany([
    {
      name: 'Phòng Nhân sự công ty VNIST 2',
      description: 'Phòng Nhân sự công ty VNIST 2',
      managers: [giamDocPhongNhanSu2._id],
      parent: Directorate2._id,
      deputyManagers: [phoPhongPhongNhanSu2._id],
      employees: [thanhVienPhongNhanSu2._id],
    },
  ]);

  // const phongKeHoach2 = await OrganizationalUnit(vnistDB).insertMany([
  //   {
  //     name: 'Phòng Kế hoạch công ty VNIST 2',
  //     description: 'Phòng Kế hoạch công ty VNIST 2',
  //     managers: [giamDocPhongKeHoach2._id],
  //     parent: Directorate2._id,
  //     deputyManagers: [phoPhongPhongKeHoach2._id],
  //     employees: [thanhVienPhongKeHoach2._id],
  //   },
  // ]);

  await UserRole(vnistDB).insertMany([
    {
      userId: users2[22]._id,
      roleId: giamDoc2._id,
    },
    {
      userId: users2[23]._id,
      roleId: phoGiamDoc2._id,
    },
    {
      userId: users2[24]._id,
      roleId: thanhVienBanGiamDoc2._id,
    },
    {
      userId: users2[22]._id,
      roleId: giamDocPhongChamSocKhachHang2._id,
    },
    {
      userId: users2[0]._id,
      roleId: phoPhongPhongChamSocKhachHang2._id,
    },
    {
      userId: users2[1]._id,
      roleId: thanhVienPhongChamSocKhachHang2._id,
    },
    {
      userId: users2[2]._id,
      roleId: thanhVienPhongChamSocKhachHang2._id,
    },
    {
      userId: users2[3]._id,
      roleId: thanhVienPhongChamSocKhachHang2._id,
    },
    {
      userId: users2[4]._id,
      roleId: thanhVienPhongChamSocKhachHang2._id,
    },
    {
      userId: users2[22]._id,
      roleId: giamDocPhongNhanSu2._id,
    },
    {
      userId: users2[5]._id,
      roleId: phoPhongPhongNhanSu2._id,
    },
    {
      userId: users2[6]._id,
      roleId: thanhVienPhongNhanSu2._id,
    },
    {
      userId: users2[7]._id,
      roleId: thanhVienPhongNhanSu2._id,
    },
    {
      userId: users2[8]._id,
      roleId: thanhVienPhongNhanSu2._id,
    },
    {
      userId: users2[9]._id,
      roleId: thanhVienPhongNhanSu2._id,
    },
    {
      userId: users2[22]._id,
      roleId: giamDocPhongKinhDoanh2._id,
    },
    {
      userId: users2[10]._id,
      roleId: phoPhongPhongKinhDoanh2._id,
    },
    {
      userId: users2[11]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[12]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[13]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[14]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[15]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[16]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[17]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[18]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[19]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[20]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    {
      userId: users2[21]._id,
      roleId: thanhVienPhongKinhDoanh2._id,
    },
    // {
    //   userId: users2[22]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[23]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[24]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[25]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[26]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[27]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[28]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[29]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[30]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[31]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[32]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[33]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[34]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[35]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[36]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[37]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[38]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[39]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
    // {
    //   userId: users2[40]._id,
    //   roleId: thanhVienPhongKinhDoanh2._id,
    // },
  ]);

  /**
   * 8. Tạo link cho các trang web của công ty VNIST
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
    };

    let allLinks = await SystemLink(systemDB).find().populate({
      path: 'roles',
    });
    let activeLinks = await SystemLink(systemDB)
      .find({ _id: { $in: linkArr } })
      .populate({
        path: 'roles',
      });

    let checkAllSystemApi = false;
    let dataApis = [];
    let dataLinks = allLinks.map((link) => {
      if (checkIndex(link, activeLinks) === -1)
        return {
          url: link.url,
          category: link.category,
          description: link.description,
        };
      else if (!checkAllSystemApi) {
        let url = linksPermission.filter((item) => item.url === link.url)?.[0];
        if (url?.apis?.length === 1 && url.apis[0] === '@all') {
          checkAllSystemApi = true;
        } else {
          if (url?.apis?.length > 0) {
            url.apis.map((api) => {
              checkDuplicate = dataApis.filter((item) => item.path === api.path && item.method === api.method);
              if (checkDuplicate?.length === 0) {
                dataApis.push(api);
              }
            });
          }
        }
      }

      return {
        url: link.url,
        category: link.category,
        description: link.description,
        deleteSoft: false,
      };
    });

    if (checkAllSystemApi) {
      let systemApis = await SystemApi(systemDB).find();
      await Company(systemDB).update(
        { shortName: 'vnist' },
        {
          $set: {
            apis: systemApis.map((item) => item._id),
          },
        }
      );
    } else {
      dataApis.map(async (item) => {
        let systemApi = await SystemApi(systemDB).findOne({
          path: item.path,
          method: item.method,
        });
        await Company(systemDB).update(
          { shortName: 'vnist' },
          {
            $push: {
              apis: systemApi._id,
            },
          }
        );
      });
    }

    let links = await Link(vnistDB).insertMany(dataLinks);

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
                  roleId: role._id,
                });
              }
            }
          }
        }
      }
    }
    await Privilege(vnistDB).insertMany(dataPrivilege);

    return await Link(vnistDB)
      .find()
      .populate({
        path: 'roles',
        populate: { path: 'roleId' },
      });
  };

  const createCompanyComponents = async (linkArr) => {
    let systemLinks = await SystemLink(systemDB).find({
      _id: { $in: linkArr },
    });

    let dataSystemComponents = systemLinks.map((link) => link.components);
    dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
    dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);
    const systemComponents = await SystemComponent(systemDB)
      .find({ _id: { $in: dataSystemComponents } })
      .populate({ path: 'roles' });

    for (let i = 0; i < systemComponents.length; i++) {
      let sysLinks = await SystemLink(systemDB).find({
        _id: { $in: systemComponents[i].links },
      });
      let links = await Link(vnistDB).find({
        url: sysLinks.map((link) => link.url),
      });
      // Tạo component
      let component = await Component(vnistDB).create({
        name: systemComponents[i].name,
        description: systemComponents[i].description,
        links: links.map((link) => link._id),
        deleteSoft: false,
      });
      for (let j = 0; j < links.length; j++) {
        let updateLink = await Link(vnistDB).findById(links[j]._id);
        updateLink.components.push(component._id);
        await updateLink.save();
      }
      // Tạo phân quyền cho components
      let roles = await Role(vnistDB).find({
        name: {
          $in: systemComponents[i].roles.map((role) => role.name),
        },
      });
      let dataPrivileges = roles.map((role) => {
        return {
          resourceId: component._id,
          resourceType: 'Component',
          roleId: role._id,
        };
      });
      await Privilege(vnistDB).insertMany(dataPrivileges);
    }

    return await Component(vnistDB).find();
  };
  let linkArrData = await SystemLink(systemDB).find();
  let linkArr = linkArrData.map((link) => link._id);
  let roleArr = [roleSuperAdmin, roleAdmin, roleManager, roleDeputyManager, roleEmployee];
  await createCompanyLinks(linkArr, roleArr);
  await createCompanyComponents(linkArr);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU NHÂN VIÊN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */

  // const majorsParent = await Major(vnistDB).insertMany([
  //   {
  //     // 0
  //     name: "Công nghệ thông tin",
  //     code: "74802",
  //     parents: [],
  //     company: vnist._id,
  //   },
  //   {
  //     // 1
  //     name: "Máy tính",
  //     code: "74801",
  //     parents: [],
  //     company: vnist._id,
  //   },
  //   {
  //     // 2
  //     name: "Toán học",
  //     code: "74601",
  //     parents: [],
  //     company: vnist._id,
  //   },
  //   {
  //     // 3
  //     name: "Công nghệ kỹ thuật điện, điện tử và viễn thông",
  //     code: "75103",
  //     parents: [],
  //     company: vnist._id,
  //   },
  //   {
  //     // 4
  //     name: "Kỹ thuật điện, điện tử và viễn thông",
  //     code: "75202",
  //     parents: [],
  //     company: vnist._id,
  //   },
  // ]);

  const max_score = Math.ceil(5);
  const min_score = Math.ceil(1);

  const majors = await Major(vnistDB).insertMany([
    {
      // 0
      name: 'Công nghệ thông tin',
      code: '7480201',
      // parents: [majorsParent[0]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 1
      name: 'An toàn thông tin',
      code: '7480202',
      // parents: [majorsParent[0]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 2
      name: 'Khoa học máy tính',
      code: '7480101',
      // parents: [majorsParent[1]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 3
      name: 'Mạng máy tính và truyền thông dữ liệu',
      code: '7480102',
      // parents: [majorsParent[1]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 4
      name: 'Kỹ thuật phần mềm',
      code: '7480103',
      // parents: [majorsParent[1]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 5
      name: 'Hệ thống thông tin',
      code: '7480104',
      // parents: [majorsParent[1]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 6
      name: 'Kỹ thuật máy tính',
      code: '7480106',
      // parents: [majorsParent[1]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 7
      name: 'Công nghệ kỹ thuật máy tính',
      code: '7480108',
      // parents: [majorsParent[1]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 8
      name: 'Toán học',
      code: '7460101',
      // parents: [majorsParent[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 9
      name: 'Khoa học tính toán',
      code: '7480108',
      // parents: [majorsParent[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 10
      name: 'Toán ứng dụng',
      code: '7460112',
      // parents: [majorsParent[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 11
      name: 'Toán cơ',
      code: '7460115',
      // parents: [majorsParent[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 12
      name: 'Toán tin',
      code: '7460117',
      // parents: [majorsParent[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
  ]);

  const certificates = await Certificate(vnistDB).insertMany([
    {
      // 0
      name: 'Offensive Security Certified Expert',
      abbreviation: 'OSCE',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 1
      name: 'Offensive Security Certified Professional',
      abbreviation: 'OSCP',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 2
      name: 'Certified Ethical Hacker',
      abbreviation: 'CEH',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 3
      name: 'Certified Information System Security Professional',
      abbreviation: 'CISSP',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 4
      name: 'Computer Hacking Forensic Investigator',
      abbreviation: 'CHFI',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 5
      name: 'CREST Practitioner Security Analyst',
      abbreviation: 'CSPA',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 6
      name: 'EC-Council Certified Security Analyst',
      abbreviation: 'CSPA',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 7
      name: 'Offensive Security Web Expert',
      abbreviation: 'OSWE',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 8
      name: 'Global Infomation Assurance Cetification Penetration Tester',
      abbreviation: 'GPEN',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
    {
      // 9
      name: 'GIAC Exploit Researcher & Advanced Penetration Tester',
      abbreviation: 'GXPN',
      majors: [majors[2]._id],
      company: vnist._id,
      score: Math.floor(Math.random() * (max_score - min_score + 1)) + min_score,
    },
  ]);

  await Employee(vnistDB).insertMany([
    {
      avatar: '/upload/human-resource/avatars/avatar5.png',
      fullName: 'Vũ Thị Cúc',
      employeeNumber: 'MS2015122',
      status: 'active',
      company: vnist._id,
      employeeTimesheetId: '123456',
      gender: 'female',
      birthdate: new Date('1998-02-17'),
      birthplace: 'Hải Phương - Hải Hậu - Nam Định',
      identityCardNumber: 163414569,
      identityCardDate: new Date('2015-10-20'),
      identityCardAddress: 'Nam Định',
      emailInCompany: 'vtc.vnist@gmail.com',
      nationality: 'Việt Nam',
      atmNumber: '102298653',
      bankName: 'ViettinBank',
      bankAddress: 'Hai Bà Trưng',
      ethnic: 'Kinh',
      religion: 'Không',
      maritalStatus: 'single',
      phoneNumber: 962586290,
      personalEmail: 'tranhungcuong703@gmail.com',
      phoneNumber2: 9625845,
      personalEmail2: 'hungkaratedo03101998@gmail.com',
      homePhone: 978590338,
      emergencyContactPerson: 'Nguyễn Văn Thái',
      relationWithEmergencyContactPerson: 'Em trai',
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: 'cuong@gmail.com',
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: 'Hải Phương - Hải Hậu - Nam Định',
      permanentResidence: 'Hải Phương - Hải Hậu - Nam Định',
      permanentResidenceCountry: 'Việt Nam',
      permanentResidenceCity: 'Nam Định',
      permanentResidenceDistrict: 'Hải Hậu',
      permanentResidenceWard: 'Hải Phương',
      temporaryResidence: 'số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định',
      temporaryResidenceCountry: 'Việt Nam',
      temporaryResidenceCity: 'Hà Nội',
      temporaryResidenceDistrict: 'Hai Bà Trưng',
      temporaryResidenceWard: 'Bạch Mai',
      educationalLevel: '12/12',
      foreignLanguage: '500 Toeic',
      professionalSkill: 'university',
      healthInsuranceNumber: 'N1236589',
      healthInsuranceStartDate: new Date('2019-01-25'),
      healthInsuranceEndDate: new Date('2020-02-16'),
      socialInsuranceNumber: 'XH1569874',
      socialInsuranceDetails: [
        {
          company: 'Vnist',
          position: 'Nhân viên',
          startDate: new Date('2020-01'),
          endDate: new Date('2020-05'),
        },
      ],
      taxNumber: '12658974',
      taxRepresentative: 'Nguyễn Văn Hưng',
      taxDateOfIssue: new Date('12/08/2019'),
      taxAuthority: 'Chi cục thuế Huyện Hải Hậu',
      degrees: [
        {
          name: 'Bằng tốt nghiệp',
          issuedBy: 'Đại học Bách Khoa',
          year: 2020,
          degreeType: 'good',
          major: majors[Math.floor(Math.random() * 12)]._id,
          urlFile:
            'lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm',
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: 'PHP',
          issuedBy: 'Hà Nội',
          startDate: new Date('2019-10-25'),
          endDate: new Date('2020-10-25'),
          urlFile: 'lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm',
        },
      ],
      experiences: [
        {
          startDate: new Date('2019-06'),
          endDate: new Date('2020-02'),
          company: 'Vnist',
          position: 'Nhân viên',
        },
      ],
      contractType: 'Phụ thuộc',
      contractEndDate: new Date('2020-10-25'),
      contracts: [
        {
          name: 'Thực tập',
          contractType: 'Phụ thuộc',
          startDate: new Date('2019-10-25'),
          endDate: new Date('2020-10-25'),
          urlFile:
            'lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm',
        },
      ],
      archivedRecordNumber: 'T3 - 123698',
      files: [],
    },
    {
      avatar: '/upload/human-resource/avatars/avatar5.png',
      fullName: 'Trần Văn Bình',
      employeeNumber: 'MS2015124',
      status: 'active',
      company: vnist._id,
      employeeTimesheetId: '123456',
      gender: 'male',
      birthdate: new Date('1998-02-17'),
      birthplace: 'Hải Phương - Hải Hậu - Nam Định',
      identityCardNumber: 163414569,
      identityCardDate: new Date('2015-10-20'),
      identityCardAddress: 'Nam Định',
      emailInCompany: 'tvb.vnist@gmail.com',
      nationality: 'Việt Nam',
      atmNumber: '102298653',
      bankName: 'ViettinBank',
      bankAddress: 'Hai Bà Trưng',
      ethnic: 'Kinh',
      religion: 'Không',
      maritalStatus: 'single',
      phoneNumber: 962586290,
      personalEmail: 'tranhungcuong703@gmail.com',
      phoneNumber2: 9625845,
      personalEmail2: 'hungkaratedo03101998@gmail.com',
      homePhone: 978590338,
      emergencyContactPerson: 'Nguyễn Văn Thái',
      relationWithEmergencyContactPerson: 'Em trai',
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: 'cuong@gmail.com',
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: 'Hải Phương - Hải Hậu - Nam Định',
      permanentResidence: 'Hải Phương - Hải Hậu - Nam Định',
      permanentResidenceCountry: 'Việt Nam',
      permanentResidenceCity: 'Nam Định',
      permanentResidenceDistrict: 'Hải Hậu',
      permanentResidenceWard: 'Hải Phương',
      temporaryResidence: 'số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định',
      temporaryResidenceCountry: 'Việt Nam',
      temporaryResidenceCity: 'Hà Nội',
      temporaryResidenceDistrict: 'Hai Bà Trưng',
      temporaryResidenceWard: 'Bạch Mai',
      educationalLevel: '12/12',
      foreignLanguage: '500 Toeic',
      professionalSkill: 'university',
      healthInsuranceNumber: 'N1236589',
      healthInsuranceStartDate: new Date('2019-01-25'),
      healthInsuranceEndDate: new Date('2020-02-16'),
      socialInsuranceNumber: 'XH1569874',
      socialInsuranceDetails: [
        {
          company: 'Vnist',
          position: 'Nhân viên',
          startDate: new Date('2020-01'),
          endDate: new Date('2020-05'),
        },
      ],
      taxNumber: '12658974',
      taxRepresentative: 'Nguyễn Văn Hưng',
      taxDateOfIssue: new Date('12/08/2019'),
      taxAuthority: 'Chi cục thuế Huyện Hải Hậu',
      degrees: [
        {
          name: 'Bằng tốt nghiệp',
          issuedBy: 'Đại học Bách Khoa',
          year: 2020,
          degreeType: 'good',
          major: majors[Math.floor(Math.random() * 12)]._id,
          urlFile:
            'lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm',
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: 'PHP',
          issuedBy: 'Hà Nội',
          startDate: new Date('2019-10-25'),
          endDate: new Date('2020-10-25'),
          urlFile: 'lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm',
        },
      ],
      experiences: [
        {
          startDate: new Date('2019-06'),
          endDate: new Date('2020-02'),
          company: 'Vnist',
          position: 'Nhân viên',
        },
      ],
      contractType: 'Phụ thuộc',
      contractEndDate: new Date('2020-10-25'),
      contracts: [
        {
          name: 'Thực tập',
          contractType: 'Phụ thuộc',
          startDate: new Date('2019-10-25'),
          endDate: new Date('2020-10-25'),
          urlFile:
            'lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm',
        },
      ],
      archivedRecordNumber: 'T3 - 123698',
      files: [],
    },
  ]);
  console.log('Khởi tạo dữ liệu nhân viên!');
  var employee = await Employee(vnistDB).create({
    avatar: '/upload/human-resource/avatars/avatar5.png',
    fullName: 'Nguyễn Văn An',
    employeeNumber: 'MS2015123',
    status: 'active',
    company: vnist._id,
    employeeTimesheetId: '123456',
    gender: 'male',
    birthdate: new Date('1988-05-20'),
    birthplace: 'Hải Phương - Hải Hậu - Nam Định',
    identityCardNumber: 163414569,
    identityCardDate: new Date('2015-10-20'),
    identityCardAddress: 'Nam Định',
    emailInCompany: 'nva.vnist@gmail.com',
    nationality: 'Việt Nam',
    atmNumber: '102298653',
    bankName: 'ViettinBank',
    bankAddress: 'Hai Bà Trưng',
    ethnic: 'Kinh',
    religion: 'Không',
    maritalStatus: 'single',
    phoneNumber: 962586290,
    personalEmail: 'tranhungcuong703@gmail.com',
    phoneNumber2: 9625845,
    personalEmail2: 'hungkaratedo03101998@gmail.com',
    homePhone: 978590338,
    emergencyContactPerson: 'Nguyễn Văn Thái',
    relationWithEmergencyContactPerson: 'Em trai',
    emergencyContactPersonPhoneNumber: 962586278,
    emergencyContactPersonEmail: 'cuong@gmail.com',
    emergencyContactPersonHomePhone: 962586789,
    emergencyContactPersonAddress: 'Hải Phương - Hải Hậu - Nam Định',
    permanentResidence: 'Hải Phương - Hải Hậu - Nam Định',
    permanentResidenceCountry: 'Việt Nam',
    permanentResidenceCity: 'Nam Định',
    permanentResidenceDistrict: 'Hải Hậu',
    permanentResidenceWard: 'Hải Phương',
    temporaryResidence: 'số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định',
    temporaryResidenceCountry: 'Việt Nam',
    temporaryResidenceCity: 'Hà Nội',
    temporaryResidenceDistrict: 'Hai Bà Trưng',
    temporaryResidenceWard: 'Bạch Mai',
    educationalLevel: '12/12',
    foreignLanguage: '500 Toeic',
    professionalSkill: 'university',
    healthInsuranceNumber: 'N1236589',
    healthInsuranceStartDate: new Date('2019-01-25'),
    healthInsuranceEndDate: new Date('2020-02-16'),
    socialInsuranceNumber: 'XH1569874',
    socialInsuranceDetails: [
      {
        company: 'Vnist',
        position: 'Nhân viên',
        startDate: new Date('2020-01'),
        endDate: new Date('2020-05'),
      },
    ],
    taxNumber: '12658974',
    taxRepresentative: 'Nguyễn Văn Hưng',
    taxDateOfIssue: new Date('12/08/2019'),
    taxAuthority: 'Chi cục thuế Huyện Hải Hậu',
    degrees: [
      {
        name: 'Bằng tốt nghiệp',
        issuedBy: 'Đại học Bách Khoa',
        year: 2020,
        degreeType: 'good',
        major: majors[Math.floor(Math.random() * 12)]._id,
        urlFile:
          'lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm',
      },
    ],
    certificates: [
      {
        certificate: certificates[Math.floor(Math.random() * 10)]._id,
        name: 'PHP',
        issuedBy: 'Hà Nội',
        startDate: new Date('2019-10-25'),
        endDate: new Date('2020-10-25'),
        urlFile: 'lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm',
      },
    ],
    experiences: [
      {
        startDate: new Date('2019-06'),
        endDate: new Date('2020-02'),
        company: 'Vnist',
        position: 'Nhân viên',
      },
    ],
    contractType: 'Phụ thuộc',
    contractEndDate: new Date('2020-10-25'),
    contracts: [
      {
        name: 'Thực tập',
        contractType: 'Phụ thuộc',
        startDate: new Date('2019-10-25'),
        endDate: new Date('2020-10-25'),
        urlFile:
          'lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm',
      },
    ],
    archivedRecordNumber: 'T3 - 123698',
    files: [
      {
        name: 'Ảnh',
        description: 'Ảnh 3x4',
        number: '1',
        status: 'submitted',
        urlFile: 'lib/fileEmployee/1582212624054-3.5.1.png',
      },
    ],
  });
  console.log(`Xong! Thông tin nhân viên đã được tạo`);
  //END

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU NGHỊ PHÉP
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu nghỉ phép!');
  await AnnualLeave(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employee._id,
      organizationalUnit: Directorate._id,
      startDate: '2021-01-06',
      endDate: '2021-01-08',
      status: 'approved',
      reason: 'Về quê',
    },
    {
      company: vnist._id,
      employee: employee._id,
      organizationalUnit: Directorate._id,
      startDate: '2021-01-05',
      endDate: '2021-01-10',
      status: 'waiting_for_approval',
      reason: 'Nghỉ tết',
    },
  ]);
  console.log(`Xong! Thông tin nghỉ phép đã được tạo`);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu lương nhân viên!');
  await Salary(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employee._id,
      month: '2021-01',
      organizationalUnit: Directorate._id,
      mainSalary: '10000000',
      unit: 'VND',
      bonus: [
        {
          nameBonus: 'Thưởng dự án',
          number: '1000000',
        },
      ],
    },
    {
      company: vnist._id,
      employee: employee._id,
      organizationalUnit: Directorate._id,
      month: '2020-12',
      mainSalary: '10000000',
      unit: 'VND',
      bonus: [
        {
          nameBonus: 'Thưởng tháng 1',
          number: '1000000',
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
  console.log('Khởi tạo dữ liệu khen thưởng!');
  await Commendation(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employee._id,
      decisionNumber: '123',
      organizationalUnit: departments[0]._id,
      startDate: '2021-01-02',
      type: 'Thưởng tiền',
      reason: 'Vượt doanh số',
    },
    {
      company: vnist._id,
      employee: employee._id,
      decisionNumber: '1234',
      organizationalUnit: departments[0]._id,
      startDate: '2021-01-06',
      type: 'Thưởng tiền',
      reason: 'Vượt doanh số 500 triệu',
    },
  ]);
  console.log(`Xong! Thông tin khen thưởng đã được tạo`);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU KỶ LUẬT NHÂN VIÊN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu kỷ luật!');
  await Discipline(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employee._id,
      decisionNumber: '1456',
      organizationalUnit: departments[0]._id,
      startDate: '2021-01-06',
      endDate: '2021-01-09',
      type: 'Phạt tiền',
      reason: 'Không làm đủ công',
    },
    {
      company: vnist._id,
      employee: employee._id,
      decisionNumber: '1457',
      organizationalUnit: departments[0]._id,
      startDate: '2021-01-10',
      endDate: '2021-01-12',
      type: 'Phạt tiền',
      reason: 'Không đủ doanh số',
    },
  ]);
  console.log(`Xong! Thông tin kỷ luật đã được tạo`);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU CHƯƠNG TRÌNH ĐÀO TẠO
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo dữ liệu chương trình đào tạo bắt buộc!');
  var educationProgram = await EducationProgram(vnistDB).insertMany([
    {
      company: vnist._id,
      applyForOrganizationalUnits: [departments[0]._id],
      applyForPositions: [nvPhongHC._id],

      name: 'An toan lao dong',
      programId: 'M123',
    },
    {
      company: vnist._id,
      applyForOrganizationalUnits: [departments[0]._id],
      applyForPositions: [nvPhongHC._id],
      name: 'kỹ năng giao tiếp',
      programId: 'M1234',
    },
  ]);
  console.log(`Xong! Thông tin chương trình đào tạo  đã được tạo`);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU KHOÁ ĐÀO TẠO
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo dữ liệu khoá đào tạo bắt buộc!');
  await Course(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'An toàn lao động 1',
      courseId: 'LD1233',
      offeredBy: 'Vnists',
      coursePlace: 'P9.01',
      startDate: '2021-01-16',
      endDate: '2021-03-21',
      cost: {
        number: '1200000',
        unit: 'VND',
      },
      lecturer: 'Nguyễn B',
      type: 'external',
      educationProgram: educationProgram[0]._id,
      employeeCommitmentTime: '6',
    },
    {
      company: vnist._id,
      name: 'An toàn lao động 2',
      courseId: 'LD123',
      offeredBy: 'Vnists',
      coursePlace: 'P9.01',
      startDate: '2021-01-16',
      endDate: '2021-05-21',
      cost: {
        number: '1200000',
        unit: 'VND',
      },
      lecturer: 'Nguyễn Văn B',
      type: 'internal',
      educationProgram: educationProgram[1]._id,
      employeeCommitmentTime: '6',
    },
  ]);
  console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);

  /**
   * Tạo dữ liệu tài liệu
   */
  const domains = await DocumentDomain(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Tài liệu lữu trữ bắt buộc',
      description: 'Tài liệu lữu trữ bắt buộc',
    },
    {
      company: vnist._id,
      name: 'Hồ sơ lữu trữ bắt buộc',
      description: 'Hồ sơ lữu trữ bắt buộc',
    },
  ]);

  const domanins2 = await DocumentDomain(vnistDB).insertMany([
    //tài liệu bắt buộc
    {
      company: vnist._id,
      name: 'Điều lệ công ty',
      description: 'Điều lệ công ty',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Quy chế quản lý nội bộ công ty',
      description: 'Quy chế quản lý nội bộ công ty',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Sổ đăng ký thành viên hoặc sổ đăng ký cổ đông',
      description: 'Sổ đăng ký thành viên hoặc sổ đăng ký cổ đông',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Văn bằng bảo hộ quyền sở hữu công nghiệp',
      description: 'Văn bằng bảo hộ quyền sở hữu công nghiệp',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
      description: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Giấy phép và giấy chứng nhận khác',
      description: 'Giấy phép và giấy chứng nhận khác',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Tài liệu, giấy tờ xác nhận quyền sở hữu tài sản của công ty',
      description:
        'Tài liệu, giấy tờ xác nhận quyền sở hữu tài sản của công ty',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Biên bản họp hội đồng thành viên',
      description:
        'Biên bản họp hội đồng thành viên, đại hội đồng cổ đông, hội đồng quản trị, các quyết định của doanh nghiệp',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Bản cáo bạch để phát hành chứng khoán',
      description: 'Bản cáo bạch để phát hành chứng khoán',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Báo cáo của ban kiểm soát',
      description:
        'Báo cáo của ban kiểm soát, kết luận của cơ quan thanh tra, kết luận của tổ chức kiểm toán',
      parent: domains[0]._id,
    },
    {
      company: vnist._id,
      name: 'Sổ kế toán, chứng từ kế toán, báo cáo tài chính hằng năm',
      description: 'Sổ kế toán, chứng từ kế toán, báo cáo tài chính hằng năm',
      parent: domains[0]._id,
    },

    //hồ sơ
    {
      company: vnist._id,
      name: 'Hồ sơ thống kê kết quả thực hiện mục tiêu chất lượng',
      description:
        'Hồ sơ thống kê kết quả thực hiện mục tiêu chất lượng của từng phòng ban và của tổ chức',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ xem xét của lãnh đạo',
      description: 'Hồ sơ xem xét của lãnh đạo',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ về các hoạt động giáo dục, đào tạo, huấn luyện kỹ năng',
      description:
        'Hồ sơ về các hoạt động giáo dục, đào tạo, huấn luyện kỹ năng',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ về kinh nghiệm làm việc của nhân viên',
      description: 'Hồ sơ về kinh nghiệm làm việc của nhân viên',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ yêu cầu của các đơn đặt hàng từ khách hàng',
      description:
        'Hồ sơ thống kê kết quả thực hiện mục tiêu chất lượng của từng phòng ban và của tổ chức',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Các hồ sơ cung cấp thông tin đầu vào',
      description:
        'Các hồ sơ cung cấp thông tin đầu vào phục vụ cho thiết kế sản phẩm',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ tài liệu quản lý chất lượng ISO 9001',
      description: 'Hồ sơ tài liệu quản lý chất lượng ISO 9001',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ ghi nhận hoạt động xem xét thiết kế sản phẩm',
      description: 'Hồ sơ ghi nhận hoạt động xem xét thiết kế sản phẩm',
      parent: domains[1]._id,
    },
    {
      company: vnist._id,
      name: 'Hồ sơ kết quả xác nhận giá trị sử dụng của thiết kế sản phẩm',
      description:
        'Hồ sơ kết quả xác nhận giá trị sử dụng của thiết kế sản phẩm',
      parent: domains[1]._id,
    },
  ]);
  const archives = await DocumentArchive(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Văn phòng B1',
      description: 'Văn phòng B1',
      path: 'Văn phòng B1',
    },
    {
      company: vnist._id,
      name: 'Văn phòng B2',
      description: 'Văn phòng B2',
      path: 'Văn phòng B2',
    },
    {
      company: vnist._id,
      name: 'Văn phòng B3',
      description: 'Văn phòng B3',
      path: 'Văn phòng B3',
    },
  ]);
  const archives2 = await DocumentArchive(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Phòng 201',
      description: 'Phòng  lưu trữ tầng 2',
      path: 'Văn phòng B1 - Phòng 201',
      parent: archives[0],
    },
    {
      company: vnist._id,
      name: 'Phòng 202',
      description: 'Phòng giám đốc',
      path: 'Văn phòng B1 - Phòng 202',
      parent: archives[0],
    },
    {
      company: vnist._id,
      name: 'Phòng 301',
      path: 'Văn phòng B2 - Phòng 301',
      parent: archives[1],
    },
    {
      company: vnist._id,
      name: 'Phòng 302',
      path: 'Văn phòng B2 - Phòng 302',
      parent: archives[1],
    },
    {
      company: vnist._id,
      name: 'Phòng 403',
      path: 'Văn phòng B3 - Phòng 403',
      parent: archives[2],
    },
    {
      company: vnist._id,
      name: 'Phòng 404',
      path: 'Văn phòng B3 - Phòng 404',
      parent: archives[2],
    },
  ]);
  const archives3 = await DocumentArchive(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Tủ 1',
      path: 'Văn phòng B1 - Phòng 201 - Tủ 1',
      parent: archives2[0],
    },
    {
      company: vnist._id,
      name: 'Tủ 2',
      path: 'Văn phòng B1 - Phòng 201 - Tủ 2',
      parent: archives2[0],
    },
    {
      company: vnist._id,
      name: 'Tủ 1',
      path: 'Văn phòng B1 - Phòng 202 - Tủ 1',
      parent: archives2[1],
    },
    {
      company: vnist._id,
      name: 'Tủ A',
      path: 'Văn phòng B2 - Phòng 301 - Tủ A',
      parent: archives2[2],
    },
    {
      company: vnist._id,
      name: 'Tủ B',
      path: 'Văn phòng B2 - Phòng 301 - Tủ B',
      parent: archives2[2],
    },
    {
      company: vnist._id,
      name: 'Tủ to',
      path: 'Văn phòng B3 - Phòng 403 - Tủ to',
      parent: archives2[4],
    },
    {
      company: vnist._id,
      name: 'Tủ nhỏ',
      path: 'Văn phòng B3 - Phòng 403 - Tủ nhỏ',
      parent: archives2[4],
    },
    {
      company: vnist._id,
      name: 'Tủ trung bình',
      path: 'Văn phòng B3 - Phòng 403 - Tủ trung bình',
      parent: archives2[4],
    },
  ]);
  const archives4 = await DocumentArchive(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Ngăn đầu',
      path: 'Văn phòng B1 - Phòng 201 - Tủ 1 - Ngăn đầu',
      parent: archives3[0],
    },
  ]);
  const categories = await DocumentCategory(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Văn bản',
      description: 'Văn bản',
    },
    {
      company: vnist._id,
      name: 'Biểu mẫu',
      description: 'Biểu mẫu',
    },
    {
      company: vnist._id,
      name: 'Công văn',
      description: 'Công văn',
    },
    {
      company: vnist._id,
      name: 'Hồ sơ',
      description: 'Hồ sơ',
    },
    {
      company: vnist._id,
      name: 'Biên bản',
      description: 'Biên bản',
    },
    {
      company: vnist._id,
      name: 'Tài liệu khác',
      description: 'Tài liệu khác',
    },
  ]);

  const documents = await Document(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Quy định du lịch nghỉ mát công ty',
      category: categories[0],
      domains: [domanins2[1]],
      archives: [archives4[0]],
      versions: [
        {
          versionName: 'Quy định du lịch nghỉ mát công ty V1.0',
          issuingDate: '2020-08-16',
          effectiveDate: '2020-08-16',
          expiredDate: '2020-08-16',
        },
      ],
      roles: [roleAdmin._id, roleManager._id],
      officialNumber: 'VN001',
    },
    {
      company: vnist._id,
      name: 'Điều lệ công ty',
      category: categories[2],
      domains: [domanins2[0]],
      archives: [archives3[3]],
      versions: [
        {
          versionName: 'Điều lệ công ty v1.0',
          issuingDate: '2020-08-16',
          effectiveDate: '2020-08-16',
          expiredDate: '2020-08-16',
        },
      ],
      roles: [roleAdmin._id, roleManager._id],
      officialNumber: 'VN002',
    },
    {
      company: vnist._id,
      name: 'Giấy chứng nhận đăng ký chất lượng sản phẩm',
      category: categories[3],
      domains: [domanins2[4]],
      archives: [archives3[3]],
      versions: [
        {
          versionName: 'Giấy chứng nhận đăng ký chất lượng sản phẩm v1.0',
          issuingDate: '2020-08-16',
          effectiveDate: '2020-08-16',
          expiredDate: '2020-08-16',
        },
      ],
      roles: [roleAdmin._id, roleManager._id],
      officialNumber: 'VN003',
    },
    {
      company: vnist._id,
      name: 'Giấy chứng nhận đăng ký chất lượng hàng nhập',
      category: categories[4],
      domains: [domanins2[12]],
      archives: [archives3[4]],
      versions: [
        {
          versionName: 'Giấy chứng nhận đăng ký chất lượng hàng nhập',
          issuingDate: '2020-08-16',
          effectiveDate: '2020-08-16',
          expiredDate: '2020-08-16',
        },
      ],
      officialNumber: 'VN004',
    },
    {
      company: vnist._id,
      name: 'Kết quả khảo sát định kỳ',
      category: categories[5],
      domains: [domanins2[1]],
      archives: [archives4[0]],
      versions: [
        {
          versionName: 'Kết quả khảo sát định kỳ v1.0',
          issuingDate: '2020-08-16',
          effectiveDate: '2020-08-16',
          expiredDate: '2020-08-16',
        },
      ],
      officialNumber: 'VN005',
    },
    {
      company: vnist._id,
      name: 'Giấy chứng nhận đăng ký chất lượng thực phẩm',
      category: categories[3],
      domains: [domanins2[4]],
      archives: [archives3[3]],
      versions: [
        {
          versionName: 'Giấy chứng nhận đăng ký chất lượng thực phẩm v1.0',
          issuingDate: '2020-08-16',
          effectiveDate: '2020-08-16',
          expiredDate: '2020-08-16',
        },
      ],
      officialNumber: 'VN006',
    },
  ]);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU lOẠI TÀI SẢN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu loại tài sản');
  var listAssetType = await AssetType(vnistDB).insertMany([
    {
      //0
      company: vnist._id,
      typeNumber: 'BA',
      typeName: 'Bàn',
      parent: null,
      description: 'Các loại bàn',
    },
    {
      //1
      company: vnist._id,
      typeNumber: 'BC',
      typeName: 'Băng chuyền',
      parent: null,
      description: 'Các loại băng chuyền',
    },
    {
      //2
      company: vnist._id,
      typeNumber: 'BG',
      typeName: 'Bảng',
      parent: null,
      description: 'Các loại bảng, viết, bảng từ, bảng chỉ dẫn',
    },
    {
      //3
      company: vnist._id,
      typeNumber: 'BI',
      typeName: 'Bình',
      parent: null,
      description: 'Các loại bình chứa: bình nước,...',
    },
    {
      //4
      company: vnist._id,
      typeNumber: 'BN',
      typeName: 'Bồn',
      parent: null,
      description: 'Các loại bồn rửa tay, bồn đựng nước',
    },
    {
      //5
      company: vnist._id,
      typeNumber: 'BU',
      typeName: 'Bục',
      parent: null,
      description: 'Các loại bục để giày dép, để chân, để tượng',
    },
    {
      //6
      company: vnist._id,
      typeNumber: 'CA',
      typeName: 'Cân',
      parent: null,
      description: 'Các loại cân',
    },
    {
      //7
      company: vnist._id,
      typeNumber: 'Đèn',
      typeName: 'DE',
      parent: null,
      description: 'Đèn các loại',
    },
    {
      //8
      company: vnist._id,
      typeNumber: 'DH',
      typeName: 'Điều hòa',
      parent: null,
      description: 'Điều hòa các loại',
    },
    {
      //9
      company: vnist._id,
      typeNumber: 'DO',
      typeName: 'Đồng hồ',
      parent: null,
      description: 'Các loại đồng hồ',
    },
    {
      //10
      company: vnist._id,
      typeNumber: 'GH',
      typeName: 'Ghế',
      parent: null,
      description: 'Ghế các loại',
    },
    {
      //11
      company: vnist._id,
      typeNumber: 'GI',
      typeName: 'Giá',
      parent: null,
      description: 'Giá các chất liệu để tài liệu, trei, vật dụng nhỏ',
    },
    {
      //12
      company: vnist._id,
      typeNumber: 'HT',
      typeName: 'Hệ thống',
      parent: null,
      description: 'Các thiết bị hệ thống',
    },
    {
      //13
      company: vnist._id,
      typeNumber: 'KE',
      typeName: 'Kệ hòm',
      parent: null,
      description:
        'Hòm, Kệ các chất liệu để tài liệu, có thể di động, có mặt phẳng',
    },
    {
      //14
      company: vnist._id,
      typeNumber: 'QU',
      typeName: 'Quạt',
      parent: null,
      description: 'Quạt các loại',
    },
    {
      //15
      company: vnist._id,
      typeNumber: 'TU',
      typeName: 'Tủ đựng tài liệu và chứa các vật phẩm, TB',
      parent: null,
      description: '',
    },
    {
      //16
      company: vnist._id,
      typeNumber: 'MV',
      typeName: 'Thiết bị máy văn phòng',
      parent: null,
      description:
        'Tất cả các máy liên quan tới làm việc tại VP, Máy hút bụi, máy giặt, máy hút mùi',
    },
    {
      //17
      company: vnist._id,
      typeNumber: 'DX',
      typeName: 'Dụng cụ SX',
      parent: null,
      description:
        'Các vật dụng như thùng các chất liệu để đựng, chứa, pha chế, chia liều cột',
    },
    {
      //18
      company: vnist._id,
      typeNumber: 'MK',
      typeName: 'Máy cơ khí',
      parent: null,
      description:
        'Các máy liên quan tới hỗ trọ SX trực tiếp, sửa chữa, xây dựng',
    },
    {
      //19
      company: vnist._id,
      typeNumber: 'TM',
      typeName: 'Máy vi tính và thiết bị mạng',
      parent: null,
      description: 'Máy vi tính các loại + phụ kiện + các thiết bị mạng',
    },
    {
      //20
      company: vnist._id,
      typeNumber: 'AA',
      typeName: 'Thiết bị âm thanh, hình ảnh',
      parent: null,
      description:
        'Các thiết bị điện tử riêng biệt liên quan tới âm thanh, hình ảnh',
    },
    {
      //21
      company: vnist._id,
      typeNumber: 'NB',
      typeName: 'Các vật dụng liên quan tới nhà bếp',
      parent: null,
      description: 'Bếp, bình ga, nồi, chảo...',
    },
    {
      //22
      company: vnist._id,
      typeNumber: 'PC',
      typeName: 'Các thiết bị PCCC',
      parent: null,
      description: '',
    },
    {
      //23
      company: vnist._id,
      typeNumber: 'XE',
      typeName: 'Xe các loại',
      parent: null,
      description: '',
    },
    {
      //24
      company: vnist._id,
      typeNumber: 'KH',
      typeName: 'Khác',
      parent: null,
      description: '',
    },
    {
      //25
      company: vnist._id,
      typeNumber: 'MB',
      typeName: 'Mặt bằng',
      parent: null,
      description: '',
    },
  ]);
  console.log(`Xong! Thông tin loại tài sản đã được tạo`);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU PHIẾU ĐĂNG KÝ MUA SẮM TÀI SẢN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu phiếu đăng ký mua sắm tài sản');
  var listRecommendProcure = await RecommendProcure(vnistDB).insertMany([
    {
      company: vnist._id,
      recommendNumber: 'MS0001',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      equipmentName: 'Laptop DELL 5559',
      equipmentDescription: 'Laptop màu đen',
      supplier: 'HanoiComputer',
      total: '1',
      unit: 'cái',
      estimatePrice: '30000000',
      note: '',
      approver: null,
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      recommendNumber: 'MS0002',
      dateCreate: new Date('2020-06-19'),
      proponent: users[5]._id,
      equipmentName: 'Laptop DELL XPS',
      equipmentDescription: 'Laptop màu trắng',
      supplier: 'Phong Vũ',
      total: '1',
      unit: 'cái',
      estimatePrice: '50000000',
      note: '',
      approver: null,
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      recommendNumber: 'MS0003',
      dateCreate: new Date('2020-04-19'),
      proponent: users[7]._id,
      equipmentName: 'Máy photocopy',
      equipmentDescription: 'Hãng HanoiComputer',
      supplier: 'HanoiComputer',
      total: '1',
      unit: 'cái',
      estimatePrice: '25000000',
      note: '',
      approver: null,
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      recommendNumber: 'MS0004',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      equipmentName: 'Ô tô',
      equipmentDescription: 'Của hãng Toyota',
      supplier: 'Toyota Thanh Xuân',
      total: '1',
      unit: 'cái',
      estimatePrice: '500000000',
      note: '',
      approver: null,
      status: 'waiting_for_approval',
    },
  ]);
  console.log(`Xong! Thông tin phiếu đăng ký mua sắm tài sản đã được tạo`);

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU TÀI SẢN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu tài sản');
  var listAsset = await Asset(vnistDB).insertMany([
    {
      company: vnist._id,
      assetName: 'Laptop Sony Vaio',
      group: 'machine',
      usefulLife: '12',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-06-20'),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: 'VVTM02.001',
      serial: '00001',
      assetType: [listAssetType[19]._id, listAssetType[16]._id],
      purchaseDate: new Date('2020-06-20'),
      warrantyExpirationDate: new Date('2022-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: 'disposed',
      typeRegisterForUse: 1,
      description: 'Laptop Sony Vaio',
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
        {
          maintainanceCode: 'BT01',
          createDate: new Date('2020-06-25'),
          type: '1',
          description: '',
          startDate: new Date('2020-06-25'),
          endDate: new Date('2020-06-30'),
          expense: 1000000,
          status: '3',
        },
      ],
      //sự cố
      incidentLogs: [
        {
          incidentCode: 'SC01',
          type: '1',
          reportedBy: users[7],
          dateOfIncident: new Date('2020-06-24'),
          description: '',
          statusIncident: '2',
        },
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: new Date('2020-06-20'),
      disposalType: '1',
      disposalCost: 20000000,
      disposalDesc: '',
      //tài liệu đính kèm
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Điều hòa Panasonic 9.000BTU',
      code: 'VVDH01.017',
      group: 'machine',
      usefulLife: '15',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2015-06-20'),
          unitsProducedDuringTheYear: 4,
        },
      ],
      estimatedTotalProduction: 50,
      serial: '00002',
      assetType: [listAssetType[8]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2022-05-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: 'disposed',
      typeRegisterForUse: 2,
      description: 'Điều hòa Panasonic 9.000BTU',
      detailInfo: [],
      readByRoles: [giamDoc._id, roleAdmin._id, roleSuperAdmin._id, roleManager._id, thanhVienBGĐ._id],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
        {
          maintainanceCode: 'BT02',
          createDate: new Date('2020-07-15'),
          type: '1',
          description: '',
          startDate: new Date('2020-07-15'),
          endDate: new Date('2020-07-30'),
          expense: 3000000,
          status: '3',
        },
      ],
      //sự cố
      incidentLogs: [
        {
          incidentCode: 'SC02',
          type: '1',
          reportedBy: users[8],
          dateOfIncident: new Date('2020-07-10'),
          description: '',
          statusIncident: '2',
        },
      ],
      //khấu hao
      cost: 40000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 18, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: new Date('2020-05-20'),
      disposalType: '2',
      disposalCost: 10000000,
      disposalDesc: '',
      //tài liệu đính kèm
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Máy tính cây',
      code: 'VVMV18.001',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2017-06-20'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00003',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[5]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: 'ready_to_use',
      typeRegisterForUse: 2,
      description: 'Máy tính cây',
      detailInfo: [],
      readByRoles: [roleAdmin._id, roleSuperAdmin._id, roleManager._id, thanhVienBGĐ._id, truongPhongHC._id, phoPhongHC._id],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
        {
          maintainanceCode: 'BT03',
          createDate: new Date('2020-08-25'),
          type: '1',
          description: '',
          startDate: new Date('2020-08-25'),
          endDate: new Date('2020-08-30'),
          expense: 5000000,
          status: '3',
        },
      ],
      //sự cố
      incidentLogs: [
        {
          incidentCode: 'SC03',
          type: '1',
          reportedBy: users[7],
          dateOfIncident: new Date('2020-08-25'),
          description: '',
          statusIncident: '1',
        },
      ],
      //khấu hao
      cost: 30000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Máy tính cây',
      code: 'VVMV18.028',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2017-06-20'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00003',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[5]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: 'ready_to_use',
      typeRegisterForUse: 2,
      description: 'Máy tính cây',
      detailInfo: [],
      readByRoles: [roleAdmin._id, roleSuperAdmin._id, roleManager._id, nvPhongHC._id, truongPhongHC._id, phoPhongHC._id],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
        {
          maintainanceCode: 'BT04',
          createDate: new Date('2020-09-02'),
          type: '1',
          description: '',
          startDate: new Date('2020-09-02'),
          endDate: new Date('2020-09-07'),
          expense: 4500000,
          status: '2',
        },
      ],
      //sự cố
      incidentLogs: [
        {
          incidentCode: 'SC04',
          type: '1',
          reportedBy: users[7],
          dateOfIncident: new Date('2020-09-01'),
          description: '',
          statusIncident: '2',
        },
      ],
      //khấu hao
      cost: 30000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '1',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Iphone XS Max',
      code: 'VVMV18.027',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2017-06-20'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00003',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: 'ready_to_use',
      typeRegisterForUse: 2,
      description: 'Máy tính cây',
      detailInfo: [],
      readByRoles: [roleAdmin._id, roleManager._id, nvPhongHC._id, truongPhongHC._id, phoPhongHC._id],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
        {
          maintainanceCode: 'BT05',
          createDate: new Date('2020-08-01'),
          type: '1',
          description: '',
          startDate: new Date('2020-08-02'),
          endDate: new Date('2020-08-30'),
          expense: 9000000,
          status: '3',
        },
      ],
      //sự cố
      incidentLogs: [
        {
          incidentCode: 'SC05',
          type: '1',
          reportedBy: users[7],
          dateOfIncident: new Date('2020-08-01'),
          description: '',
          statusIncident: '1',
        },
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '1',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Card GTX 2050Ti',
      code: 'VVMV18.0026',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2017-06-20'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00003',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[4]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'Máy tính cây',
      detailInfo: [],
      readByRoles: [giamDoc._id, roleAdmin._id, roleSuperAdmin._id, roleManager._id, thanhVienBGĐ._id],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [
        {
          createdAt: new Date('2020-05-20'),
          dateOfIncident: new Date('2020-05-20'),
          description: 'aaaaaa',
          incidentCode: 'icd03',
          statusIncident: '1',
          type: '1',
          statusIncident: '1',
          updatedAt: new Date('2020-05-20'),
        },
      ],
      //khấu hao
      cost: 30000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      files: [],
    },

    // Máy móc trong định tuyến sản xuất
    {
      company: vnist._id,
      assetName: 'Máy xay SGE',
      code: 'MX.0006',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2024-04-05'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00006',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[4]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: nhamaythuocbot._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'Máy xay nguyên liệu',
      detailInfo: [],
      readByRoles: [giamDoc._id, roleAdmin._id, roleSuperAdmin._id, roleManager._id, thanhVienBGĐ._id, quanDocNhaMayThuocBot._id],
      usageLogs: [],
      maintainanceLogs: [],
      incidentLogs: [
        {
          createdAt: new Date('2024-04-07'),
          dateOfIncident: new Date('2024-04-07'),
          description: 'No description',
          incidentCode: 'icd03',
          statusIncident: '1',
          type: '1',
          statusIncident: '1',
          updatedAt: new Date('2024-04-07'),
        },
      ],
      cost: 30000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Máy trộn D20',
      code: 'MT.0007',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2024-04-05'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00007',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[4]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: nhamaythuocbot._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'Máy trộn nguyên liệu',
      detailInfo: [],
      readByRoles: [giamDoc._id, roleAdmin._id, roleSuperAdmin._id, roleManager._id, thanhVienBGĐ._id, quanDocNhaMayThuocBot._id],
      usageLogs: [],
      maintainanceLogs: [],
      incidentLogs: [
        {
          createdAt: new Date('2024-04-07'),
          dateOfIncident: new Date('2024-04-07'),
          description: 'No description',
          incidentCode: 'icd03',
          statusIncident: '1',
          type: '1',
          statusIncident: '1',
          updatedAt: new Date('2024-04-07'),
        },
      ],
      cost: 30000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      files: [],
    },
    {
      company: vnist._id,
      assetName: 'Máy nén 1.5T',
      code: 'MN.0008',
      group: 'other',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2024-04-05'),
          unitsProducedDuringTheYear: 20,
        },
      ],
      estimatedTotalProduction: 500,
      serial: '00008',
      assetType: [listAssetType[16]._id],
      purchaseDate: new Date('2020-05-25'),
      warrantyExpirationDate: new Date('2022-05-25'),
      managedBy: users[4]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: nhamaythuocbot._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'Máy nén thuốc viên',
      detailInfo: [],
      readByRoles: [giamDoc._id, roleAdmin._id, roleSuperAdmin._id, roleManager._id, thanhVienBGĐ._id, quanDocNhaMayThuocBot._id],
      usageLogs: [],
      maintainanceLogs: [],
      incidentLogs: [
        {
          createdAt: new Date('2024-04-07'),
          dateOfIncident: new Date('2024-04-07'),
          description: 'No description',
          incidentCode: 'icd03',
          statusIncident: '1',
          type: '1',
          statusIncident: '1',
          updatedAt: new Date('2024-04-07'),
        },
      ],
      cost: 30000000,
      residualValue: 5000000,
      startDepreciation: new Date('2020-05-25'), // thời gian bắt đầu trích khấu hao
      usefulLife: 16, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      files: [],
    },
  ]);

  var asset = await Asset(vnistDB).create({
    company: vnist._id,
    assetName: 'HUST',
    group: 'building',
    usefulLife: '40',
    unitsProducedDuringTheYears: [
      {
        month: new Date('2020-05-20'),
        unitsProducedDuringTheYear: 40,
      },
    ],
    estimatedTotalProduction: 500,
    code: 'VVTM02.000',
    serial: '00000',
    assetType: [listAssetType[25]._id],
    purchaseDate: new Date('2019-06-20'),
    warrantyExpirationDate: new Date('2099-06-20'),
    managedBy: users[1]._id,
    assignedToUser: null,
    assignedToOrganizationalUnit: null,

    location: null,
    status: 'ready_to_use',
    typeRegisterForUse: 3,
    description: 'BK',
    detailInfo: [],
    readByRoles: [giamDoc._id, roleAdmin._id, roleSuperAdmin._id, roleManager._id, truongPhongHC._id, phoPhongHC._id],
    usageLogs: [],
    // bảo trì thiết bị
    maintainanceLogs: [],
    //sự cố
    incidentLogs: [],
    //khấu hao
    cost: 50000000,
    residualValue: 10000000,
    startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
    usefulLife: 20, // thời gian trích khấu hao
    depreciationType: 'straight_line', // thời gian trích khấu hao
    //thanh lý
    disposalDate: null,
    disposalType: '1',
    disposalCost: null,
    disposalDesc: '',
    //tài liệu đính kèm
    files: [],
  });
  var assetManagedByEmployee2 = await Asset(vnistDB).create({
    company: vnist._id,
    assetName: 'Phòng họp 02',
    group: 'building',
    usefulLife: '40',
    unitsProducedDuringTheYears: [
      {
        month: new Date('2020-05-20'),
        unitsProducedDuringTheYear: 40,
      },
    ],
    estimatedTotalProduction: 500,
    code: 'PH02.000',
    serial: '000002',
    assetType: [listAssetType[25]._id],
    purchaseDate: new Date('2019-06-20'),
    warrantyExpirationDate: new Date('2099-06-20'),
    managedBy: users[5]._id,
    assignedToUser: null,
    assignedToOrganizationalUnit: null,

    location: null,
    status: 'ready_to_use',
    typeRegisterForUse: 3,
    description: 'Phòng họp',
    detailInfo: [],
    readByRoles: [giamDoc._id, roleAdmin._id, thanhVienBGĐ._id, nvPhongHC._id, truongPhongHC._id, phoPhongHC._id],
    usageLogs: [{}],
    // bảo trì thiết bị
    maintainanceLogs: [],
    //sự cố
    incidentLogs: [
      {
        createdAt: new Date('2020-05-20'),
        dateOfIncident: new Date('2020-05-20'),
        description: 'aaaaaa',
        incidentCode: 'icd04',
        statusIncident: '1',
        type: '1',
        updatedAt: new Date('2020-05-20'),
      },
    ],
    //khấu hao
    cost: 50000000,
    residualValue: 10000000,
    startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
    usefulLife: 20, // thời gian trích khấu hao
    depreciationType: 'straight_line', // thời gian trích khấu hao
    //thanh lý
    disposalDate: null,
    disposalType: '2',
    disposalCost: null,
    disposalDesc: '',
    //tài liệu đính kèm
    files: [],
  });
  var assetManagedByEmployee1 = await Asset(vnistDB).create({
    company: vnist._id,
    assetName: 'Phòng họp 01',
    group: 'building',
    usefulLife: '40',
    unitsProducedDuringTheYears: [
      {
        month: new Date('2020-05-20'),
        unitsProducedDuringTheYear: 40,
      },
    ],
    estimatedTotalProduction: 500,
    code: 'PH02.000',
    serial: '000002',
    assetType: [listAssetType[25]._id],
    purchaseDate: new Date('2019-06-20'),
    warrantyExpirationDate: new Date('2099-06-20'),
    managedBy: users[5]._id,
    assignedToUser: null,
    assignedToOrganizationalUnit: null,

    location: null,
    status: 'ready_to_use',
    typeRegisterForUse: 3,
    description: 'Phòng họp',
    detailInfo: [],
    readByRoles: [
      giamDoc._id,
      roleAdmin._id,
      roleSuperAdmin._id,
      roleManager._id,
      thanhVienBGĐ._id,
      nvPhongHC._id,
      truongPhongHC._id,
      phoPhongHC._id,
    ],
    usageLogs: [],
    // bảo trì thiết bị
    maintainanceLogs: [],
    //sự cố
    incidentLogs: [
      {
        createdAt: new Date('2020-05-20'),
        dateOfIncident: new Date('2020-05-20'),
        description: 'aaaaaa',
        incidentCode: 'icd04',
        statusIncident: '1',
        type: '1',
        updatedAt: new Date('2020-05-20'),
      },
    ],
    //khấu hao
    cost: 50000000,
    residualValue: 10000000,
    startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
    usefulLife: 20, // thời gian trích khấu hao
    depreciationType: 'straight_line', // thời gian trích khấu hao
    //thanh lý
    disposalDate: null,
    disposalType: '1',
    disposalCost: null,
    disposalDesc: '',
    //tài liệu đính kèm
    files: [],
  });
  var listAsset1 = await Asset(vnistDB).insertMany([
    {
      //1 B1
      company: vnist._id,
      assetName: 'B1',
      group: 'building',
      usefulLife: '32',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 500,
      code: 'VVTM02.001',

      serial: '00001',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,

      location: asset._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'B1',
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '1',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
    {
      //2 TQB
      company: vnist._id,
      assetName: 'TV TQB',
      group: 'building',
      usefulLife: '50',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 50,
        },
      ],
      estimatedTotalProduction: 1000,
      code: 'VVTM02.002',

      serial: '00002',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2005-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,

      location: asset._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'TV',
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '1',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
  ]);

  var listAsset2 = await Asset(vnistDB).insertMany([
    {
      //3 B1 101
      company: vnist._id,
      assetName: 'B1-101',
      group: 'building',
      code: 'VVTM02.003',
      usefulLife: '12',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-06-20'),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      serial: '00003',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      location: listAsset1[0]._id,
      status: 'disposed',
      typeRegisterForUse: 3,
      description: 'B1-101',
      detailInfo: [],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: new Date('2020-07-20'),
      disposalType: '1',
      disposalCost: 12000000,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
    {
      //04
      company: vnist._id,
      assetName: 'B1-202',
      group: 'building',
      usefulLife: '22',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 3,
        },
      ],
      estimatedTotalProduction: 100,
      code: 'VVTM02.004',
      serial: '00004',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      location: listAsset1[0]._id,
      status: 'disposed',
      typeRegisterForUse: 3,
      description: 'B1-202',
      detailInfo: [],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: new Date('2020-07-20'),
      disposalType: '1',
      disposalCost: 12000000,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
    {
      //04
      company: vnist._id,
      assetName: 'B1-202',
      group: 'building',
      usefulLife: '22',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 3,
        },
      ],
      estimatedTotalProduction: 100,
      code: 'VVTM02.004',
      serial: '00004',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      location: listAsset1[0]._id,
      status: 'disposed',
      typeRegisterForUse: 3,
      description: 'B1-202',
      detailInfo: [],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '1',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
    {
      // 06
      company: vnist._id,
      assetName: 'D3-102',
      group: 'building',
      usefulLife: '20',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 300,
      code: 'VVTM02.006',
      serial: '00006',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[5]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,

      location: listAsset1[1]._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'd3-102',
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [
        {
          createdAt: new Date('2020-05-20'),
          dateOfIncident: new Date('2020-05-20'),
          description: 'broken',
          incidentCode: 'icd01',
          statusIncident: '2',
          type: '2',
          updatedAt: new Date('2020-05-20'),
        },
        {
          createdAt: new Date('2020-08-20'),
          dateOfIncident: new Date('2020-08-20'),
          description: 'cháy',
          incidentCode: 'icd01',
          statusIncident: '2',
          type: '1',
          updatedAt: new Date('2020-08-20'),
        },
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
    {
      // 07
      company: vnist._id,
      assetName: 'D3-103',
      group: 'building',
      usefulLife: '12',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 80,
        },
      ],
      estimatedTotalProduction: 1000,
      code: 'VVTM02.007',
      serial: '00007',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2020-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,

      location: listAsset1[1]._id,
      status: 'ready_to_use',
      typeRegisterForUse: 2,
      canRegisterForUse: true,
      description: 'd3-103',
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [
        {
          createdAt: new Date('2000-05-20'),
          dateOfIncident: new Date('2000-05-20'),
          description: 'broken',
          incidentCode: 'icd01',
          statusIncident: '1',
          type: '1',
          updatedAt: new Date('2000-05-20'),
        },
        {
          createdAt: new Date('2000-08-20'),
          dateOfIncident: new Date('2000-08-20'),
          description: 'cháy',
          incidentCode: 'icd01',
          statusIncident: '1',
          type: '1',
          updatedAt: new Date('2000-08-20'),
        },
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
    {
      // 07
      company: vnist._id,
      assetName: 'D3-103',
      group: 'building',
      usefulLife: '12',
      unitsProducedDuringTheYears: [
        {
          month: new Date('2020-05-20'),
          unitsProducedDuringTheYear: 80,
        },
      ],
      estimatedTotalProduction: 1000,
      code: 'VVTM02.008',
      serial: '00008',
      assetType: [listAssetType[25]._id],
      purchaseDate: new Date('2000-05-20'),
      warrantyExpirationDate: new Date('2077-06-20'),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,

      location: listAsset1[1]._id,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: 'd3-103',
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        nvPhongHC._id,
        truongPhongHC._id,
        phoPhongHC._id,
      ],
      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [],
      //sự cố
      incidentLogs: [
        {
          createdAt: new Date('2020-05-20'),
          dateOfIncident: new Date('2020-05-20'),
          description: 'broken',
          incidentCode: 'icd01',
          statusIncident: '1',
          type: '1',
          updatedAt: new Date('2020-05-20'),
        },
        {
          createdAt: new Date('2020-08-20'),
          dateOfIncident: new Date('2020-08-20'),
          description: 'cháy',
          incidentCode: 'icd01',
          statusIncident: '2',
          type: '1',
          updatedAt: new Date('2020-08-20'),
        },
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date('2020-06-20'), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: 'straight_line', // thời gian trích khấu hao
      //thanh lý
      disposalDate: null,
      disposalType: '2',
      disposalCost: null,
      disposalDesc: '',
      //tài liệu đính kèm
      documents: [],
    },
  ]);

  console.log(`Xong! Thông tin tài sản đã được tạo`);
  //END

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU ĐĂNG KÝ SỬ DỤNG TÀI SẢN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu đăng ký sử dụng tài sản!');
  var recommmenddistribute = await RecommendDistribute(vnistDB).insertMany([
    {
      company: vnist._id,
      asset: asset._id,
      recommendNumber: 'CP0001',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      reqContent: 'Đăng ký sử dụng tài sản',
      dateStartUse: new Date('2020-05-19'),
      dateEndUse: new Date('2020-06-19'),
      approver: users[1]._id,
      note: '',
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      asset: assetManagedByEmployee1._id,
      recommendNumber: 'CP0002',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      reqContent: 'Đăng ký sử dụng tài sản',
      dateStartUse: new Date('2020-05-19'),
      dateEndUse: new Date('2020-07-19'),
      approver: users[5]._id,
      note: '',
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      asset: assetManagedByEmployee2._id,
      recommendNumber: 'CP0003',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      reqContent: 'Đăng ký sử dụng tài sản',
      dateStartUse: new Date('2020-05-19'),
      dateEndUse: new Date('2020-06-19'),
      approver: users[5]._id,
      note: '',
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      asset: listAsset2[4]._id,
      recommendNumber: 'CP0003',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      reqContent: 'Đăng ký sử dụng tài sản',
      dateStartUse: '8:00 AM 10-09-2020',
      dateEndUse: '10:00 AM 10-09-2020',
      approver: users[5]._id,
      note: '',
      status: 'waiting_for_approval',
    },
    {
      company: vnist._id,
      asset: listAsset2[4]._id,
      recommendNumber: 'CP0003',
      dateCreate: new Date('2020-05-19'),
      proponent: users[4]._id,
      reqContent: 'Đăng ký sử dụng tài sản',
      dateStartUse: '1:00 PM 10-09-2020',
      dateEndUse: '5:00 PM 10-09-2020',
      approver: users[5]._id,
      note: '',
      status: 'waiting_for_approval',
    },
  ]);
  console.log(`Xong! Thông tin đăng ký sử dụng tài sản đã được tạo`);

  /*---------------------------------------------------------------------------------------------
     -----------------------------------------------------------------------------------------------
         TẠO DỮ LIỆU VẬT TƯ
     -----------------------------------------------------------------------------------------------
     ----------------------------------------------------------------------------------------------- */

  // TẠO DỮ LIỆU ĐĂNG KÝ CẤP VẬT TƯ
  const suppliesPurchaseRequests = await SuppliesPurchaseRequest(vnistDB).insertMany([
    {
      company: vnist._id,
      recommendNumber: 'DNMS20220421.231192',
      dateCreate: Date.now(),
      proponent: users[4]._id, // Người đề nghị
      suppliesName: 'Máy tính Lenovo',
      suppliesDescription: 'None',
      supplier: 'Công ty ABC',
      approver: [users[1]._id], // Người phê duyệt
      total: 12,
      unit: 5,
      estimatePrice: 10000000,
      note: null,
      status: 'waiting_for_approval',
      files: null,
      recommendUnits: [new ObjectId('6260be256c016d1b48a23fd1')],
    },
    {
      company: vnist._id,
      recommendNumber: 'DNMS20220421.231194',
      dateCreate: Date.now(),
      proponent: users[4]._id, // Người đề nghị
      suppliesName: 'Máy tính Dell',
      suppliesDescription: 'None',
      supplier: 'Công ty ABC',
      approver: [users[1]._id], // Người phê duyệt
      total: 12,
      unit: 5,
      estimatePrice: 10000000,
      note: null,
      status: 'approved',
      files: null,
      recommendUnits: [new ObjectId('6260be256c016d1b48a23fd1')],
    },
    {
      company: vnist._id,
      recommendNumber: 'DNMS20220421.231196',
      dateCreate: Date.now(),
      proponent: users[2]._id, // Người đề nghị
      suppliesName: 'Máy tính Asus',
      suppliesDescription: 'None',
      supplier: 'Công ty ABC',
      approver: [users[1]._id], // Người phê duyệt
      total: 12,
      unit: 5,
      estimatePrice: 10000000,
      note: null,
      status: 'approved',
      files: null,
      recommendUnits: [new ObjectId('6260be256c016d1b48a23fd1')],
    },
    {
      company: vnist._id,
      recommendNumber: 'DNMS20220421.231196',
      dateCreate: Date.now(),
      proponent: users[2]._id, // Người đề nghị
      suppliesName: 'Máy tính Macbook',
      suppliesDescription: 'None',
      supplier: 'Công ty ABC',
      approver: [users[1]._id], // Người phê duyệt
      total: 12,
      unit: 5,
      estimatePrice: 10000000,
      note: null,
      status: 'waiting_for_approval',
      files: null,
      recommendUnits: [new ObjectId('6260be256c016d1b48a23fd1')],
    },
  ]);

  // TẠO DỮ LIỆU VẬT TƯ
  const supplies = await Supplies(vnistDB).insertMany([
    {
      company: vnist._id,
      code: 'VVTM20220421.162431',
      suppliesName: 'Macbook',
      totalPurchase: 4,
      totalAllocation: 2,
      price: 10000000,
    },
    {
      company: vnist._id,
      code: 'VVTM20220421.162433',
      suppliesName: 'Surface',
      totalPurchase: 4,
      totalAllocation: 2,
      price: 10000000,
    },
    {
      company: vnist._id,
      code: 'VVTM20220421.162435',
      suppliesName: 'Apple watch',
      totalPurchase: 4,
      totalAllocation: 2,
      price: 10000000,
    },
    {
      company: vnist._id,
      code: 'VVTM20220421.162437',
      suppliesName: 'Tables',
      totalPurchase: 4,
      totalAllocation: 2,
      price: 10000000,
    },
  ]);

  // TẠO DỮ LIỆU HÓA ĐƠN MUA VẬT TƯ
  const purchaseInvoice = await PurchaseInvoice(vnistDB).insertMany([
    {
      codeInvoice: 'DNMS20220421.253013',
      date: '2022-04-21T00:00:00.000Z',
      price: '1213',
      quantity: '12',
      supplier: 'Công ty A',
      supplies: supplies[0]._id,
    },
    {
      codeInvoice: 'DNMS20220421.253015',
      date: '2022-04-21T00:00:00.000Z',
      price: '1213',
      quantity: '12',
      supplier: 'Công ty A',
      supplies: supplies[1]._id,
    },
    {
      codeInvoice: 'DNMS20220421.253017',
      date: '2022-04-21T00:00:00.000Z',
      price: '1213',
      quantity: '12',
      supplier: 'Công ty A',
      supplies: supplies[2]._id,
    },
    {
      codeInvoice: 'DNMS20220421.253019',
      date: '2022-04-21T00:00:00.000Z',
      price: '1213',
      quantity: '12',
      supplier: 'Công ty A',
      supplies: supplies[3]._id,
    },
  ]);

  // TẠO DỮ LIỆU LỊCH SỬ CẤP PHÁT
  const allocationHistory = await AllocationHistory(vnistDB).insertMany([
    {
      allocationToOrganizationalUnit: '6260be256c016d1b48a23fcf',
      allocationToUser: users[4]._id,
      date: '2022-04-21T00:00:00.000Z',
      quantity: '12',
      supplies: supplies[0]._id,
    },
    {
      allocationToOrganizationalUnit: '6260be256c016d1b48a23fcf',
      allocationToUser: users[4]._id,
      date: '2022-04-21T00:00:00.000Z',
      quantity: '12',
      supplies: supplies[1]._id,
    },
    {
      allocationToOrganizationalUnit: '6260be256c016d1b48a23fcf',
      allocationToUser: users[2]._id,
      date: '2022-04-21T00:00:00.000Z',
      quantity: '12',
      supplies: supplies[2]._id,
    },
    {
      allocationToOrganizationalUnit: '6260be256c016d1b48a23fcf',
      allocationToUser: users[2]._id,
      date: '2022-04-21T00:00:00.000Z',
      quantity: '12',
      supplies: supplies[3]._id,
    },
  ]);
  /*---------------------------------------------------------------------------------------------
    console.log("Khởi tạo dữ liệu đăng ký sử dụng tài sản!");
    var recommmenddistribute = await RecommendDistribute(vnistDB).insertMany([
      {
        company: vnist._id,
        asset: asset._id,
        recommendNumber: "CP0001",
        dateCreate: new Date("2020-05-19"),
        proponent: users[4]._id,
        reqContent: "Đăng ký sử dụng tài sản",
        dateStartUse: new Date("2020-05-19"),
        dateEndUse: new Date("2020-06-19"),
        approver: users[1]._id,
        note: "",
        status: "waiting_for_approval",
      },
      {
        company: vnist._id,
        asset: assetManagedByEmployee1._id,
        recommendNumber: "CP0002",
        dateCreate: new Date("2020-05-19"),
        proponent: users[4]._id,
        reqContent: "Đăng ký sử dụng tài sản",
        dateStartUse: new Date("2020-05-19"),
        dateEndUse: new Date("2020-07-19"),
        approver: users[5]._id,
        note: "",
        status: "waiting_for_approval",
      },
      {
        company: vnist._id,
        asset: assetManagedByEmployee2._id,
        recommendNumber: "CP0003",
        dateCreate: new Date("2020-05-19"),
        proponent: users[4]._id,
        reqContent: "Đăng ký sử dụng tài sản",
        dateStartUse: new Date("2020-05-19"),
        dateEndUse: new Date("2020-06-19"),
        approver: users[5]._id,
        note: "",
        status: "waiting_for_approval",
      },
      {
        company: vnist._id,
        asset: listAsset2[4]._id,
        recommendNumber: "CP0003",
        dateCreate: new Date("2020-05-19"),
        proponent: users[4]._id,
        reqContent: "Đăng ký sử dụng tài sản",
        dateStartUse: "8:00 AM 10-09-2020",
        dateEndUse: "10:00 AM 10-09-2020",
        approver: users[5]._id,
        note: "",
        status: "waiting_for_approval",
      },
      {
        company: vnist._id,
        asset: listAsset2[4]._id,
        recommendNumber: "CP0003",
        dateCreate: new Date("2020-05-19"),
        proponent: users[4]._id,
        reqContent: "Đăng ký sử dụng tài sản",
        dateStartUse: "1:00 PM 10-09-2020",
        dateEndUse: "5:00 PM 10-09-2020",
        approver: users[5]._id,
        note: "",
        status: "waiting_for_approval",
      },
    ]);
    console.log(`Xong! Thông tin đăng ký sử dụng tài sản đã được tạo`);
    /*---------------------------------------------------------------------------------------------
     -----------------------------------------------------------------------------------------------
         TẠO DỮ LIỆU NHÀ MÁY VÀ XƯỞNG SẢN XUẤT
     -----------------------------------------------------------------------------------------------
     ----------------------------------------------------------------------------------------------- */
  const manufacturingWorksData = [
    {
      code: 'NMSX202011111',
      name: 'Nhà máy sản xuất thuốc bột',
      phoneNumber: '0337479966',
      status: 1,
      address: 'Bắc Ninh',
      description:
        'Nhà máy sản xuất thuốc bột của công ty trách nhiệm hữu hạn VNIST Việt Nam',
      organizationalUnit: nhamaythuocbot._id,
      manageRoles: [roleSuperAdmin._id, roleAdmin._id],
    },
    {
      code: 'NMSX202011112',
      name: 'Nhà máy sản xuất thuốc nước',
      phoneNumber: '372109881',
      status: 1,
      address: 'Hà Nội',
      description:
        'Nhà máy sản xuất thuốc nước của công ty trách nhiệm hữu hạn VNIST Việt Nam',
      organizationalUnit: nhamaythuocnuoc._id,
      manageRoles: [roleSuperAdmin._id, roleAdmin._id],
    },
    {
      code: 'NMSX202011113',
      name: 'Nhà máy sản xuất thực phẩm chức năng',
      phoneNumber: '03669916015',
      status: 1,
      address: 'Thành phố Hồ Chí Minh',
      description:
        'Nhà máy sản xuất thực phẩm chức năng của công ty trách nhiệm hữu hạn VNIST Việt Nam',
      organizationalUnit: nhamaythucphamchucnang._id,
      manageRoles: [roleSuperAdmin._id, roleAdmin._id],
    },
  ];
  const manufacturingWorks = await ManufacturingWorks(vnistDB).insertMany(
    manufacturingWorksData
  );
  console.log('Tạo dữ liệu nhà máy');

  // ****************** Tạo mẫu dữ liệu mẫu xưởng sản xuất********************
  const manufacturingMillsData = [
    {
      code: 'XSX202010000',
      name: 'Xưởng thuốc viên',
      description:
        'Xưởng thuốc viên sản xuất tập trung của nhà máy sản xuất thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[14]._id,
    },
    {
      code: 'XSX202010001',
      name: 'Xưởng thuốc cốm',
      description: 'Xưởng thuốc cốm của nhà máy sản xuất thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[15]._id,
    },
    {
      code: 'XSX202010002',
      name: 'Xưởng thuốc bổ',
      description: 'Xưởng thuốc bổ của nhà máy sản xuất thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[16]._id,
    },
    {
      code: 'XSX202010003',
      name: 'Xưởng thuốc nước uống',
      description: 'Xưởng thuốc nước uống của nhà máy sản xuất thuốc nước',
      manufacturingWorks: manufacturingWorks[1]._id,
      status: 1,
      teamLeader: users[5]._id,
    },
    {
      code: 'XSX202010004',
      name: 'Xưởng thuốc tiêm',
      description: 'Xưởng thuốc tiêm của nhà máy sản xuất thuốc nước',
      manufacturingWorks: manufacturingWorks[1]._id,
      status: 1,
      teamLeader: users[6]._id,
    },
    {
      code: 'XSX202010005',
      name: 'Xưởng thuốc dinh dưỡng',
      description:
        'Xưởng thuốc dinh dưỡng của nhà máy sản xuất thực phẩm chức năng',
      manufacturingWorks: manufacturingWorks[2]._id,
      status: 1,
      teamLeader: users[8]._id,
    },
    {
      code: 'XSX202010006',
      name: 'Xưởng thuốc tăng trưởng',
      description:
        'Xưởng thuốc tăng trưởng của nhà máy sản xuất thực phẩm chức năng',
      manufacturingWorks: manufacturingWorks[2]._id,
      status: 1,
      teamLeader: users[9]._id,
    },
    {
      code: 'XSX202404007',
      name: 'Xưởng nguyên liệu',
      description: 'Xưởng nguyên liệu của nhà máy sản thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[19]._id,
    },
    {
      code: 'XSX202404008',
      name: 'Xưởng xay nghiền',
      description: 'Xưởng xay nghiền của nhà máy sản thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[19]._id,
    },
    {
      code: 'XSX202404009',
      name: 'Xưởng trộn',
      description: 'Xưởng trộn nguyên liệu của nhà máy sản thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[19]._id,
    },
    {
      code: 'XSX202404010',
      name: 'Xưởng nén hạt',
      description: 'Xưởng nén hạt của nhà máy sản thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[19]._id,
    },
    {
      code: 'XSX202404011',
      name: 'Xưởng đóng gói',
      description: 'Xưởng đóng gói của nhà máy sản thuốc bột',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[19]._id,
    },
    {
      code: 'XSX202404012',
      name: 'Xưởng may',
      description: 'Xưởng may quần áo của nhà máy sản xuất thời trang',
      manufacturingWorks: manufacturingWorks[0]._id,
      status: 1,
      teamLeader: users[19]._id,
    },
  ];

  const manufacturingMills = await ManufacturingMill(vnistDB).insertMany(manufacturingMillsData);

  console.log('Tạo dữ liệu xưởng sản xuất');

  const manufacturingWorks0 = await ManufacturingWorks(vnistDB).findById(manufacturingWorks[0]._id);
  manufacturingWorks0.manufacturingMills = [
    manufacturingMills[0]._id,
    manufacturingMills[1]._id,
    manufacturingMills[2]._id,

    // Xưởng sản xuất nằm trong định tuyến sản xuất
    manufacturingMills[7]._id,
    manufacturingMills[8]._id,
    manufacturingMills[9]._id,
    manufacturingMills[10]._id,
    manufacturingMills[11]._id,
  ];
  await manufacturingWorks0.save();

  const manufacturingWorks1 = await ManufacturingWorks(vnistDB).findById(manufacturingWorks[1]._id);
  manufacturingWorks1.manufacturingMills = [manufacturingMills[3]._id, manufacturingMills[4]._id];
  await manufacturingWorks1.save();

  const manufacturingWorks2 = await ManufacturingWorks(vnistDB).findById(manufacturingWorks[2]._id);
  manufacturingWorks2.manufacturingMills = [manufacturingMills[5]._id, manufacturingMills[6]._id];
  await manufacturingWorks2.save();

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU DANH MỤC HÀNG HÓA
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu danh mục hàng hóa cha');
  var listCategory = await Category(vnistDB).insertMany([
    {
      name: 'Sản phẩm',
      code: 'CT001',
      parent: null,
      description: 'Những mặt hàng được sản xuất xong',
    },
    {
      name: 'Công cụ dụng cụ',
      code: 'CT002',
      parent: null,
      description: 'Những mặt hàng chỉ mới hoàn thành một giai đoạn sản xuất',
    },
    {
      name: 'Nguyên vật liệu',
      code: 'CT003',
      parent: null,
      description: 'Những mặt hàng phục vụ cho sản xuất tạo sản phẩm',
    },
  ]);

  // console.log('Khởi tạo dữ liệu danh mục hàng hóa cha');
  // var listCategoryChild = await Category(vnistDB).insertMany([
  //   {
  //     name: 'Dạng bột',
  //     code: 'CTP001',
  //     parent: listCategory[0]._id,
  //     description: 'Thuốc dạng bột',
  //   },
  //   {
  //     name: 'Dạng viên',
  //     code: 'CTP002',
  //     parent: listCategory[0]._id,
  //     description: 'Thuốc dạng viên',
  //   },
  //   {
  //     name: 'Dạng nước',
  //     code: 'CTP003',
  //     parent: listCategory[0]._id,
  //     description: 'Thuốc dạng nước',
  //   },
  //   {
  //     name: 'Dạng cốm',
  //     code: 'CTP004',
  //     parent: listCategory[0]._id,
  //     description: 'Thuốc dạng cốm',
  //   },
  // ]);
  

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU HÀNG HÓA
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */

  // Now you can save newProducts to your database

  var listGood = await Good(vnistDB).insertMany([
    {
      company: vnist._id,
      category: listCategory[2]._id,
      name: 'Jucca Nước',
      code: 'MT001',
      type: 'material',
      baseUnit: 'ml',
      unit: [],
      sourceType: '1',
      quantity: 20,
      description: 'Nguyên liệu thuốc thú u',
    },
    {
      company: vnist._id,
      category: listCategory[2]._id,
      name: 'Propylen Glycon',
      code: 'MT002',
      type: 'material',
      baseUnit: 'kg',
      unit: [],
      sourceType: '1',
      quantity: 30,
      description: 'Nguyên vật liệu thuốc thú y',
    },
    {
      company: vnist._id,
      category: listCategory[2]._id,
      name: 'Bình ắc quy',
      code: 'EQ001',
      type: 'material',
      baseUnit: 'Chiếc',
      unit: [],
      sourceType: '1',
      quantity: 10,
      description: 'Công cụ dụng cụ thuốc thú y',
    },
    {
      company: vnist._id,
      category: listCategory[2]._id,
      name: 'Máy nén',
      code: 'EQ002',
      type: 'material',
      baseUnit: 'Chiếc',
      unit: [],
      sourceType: '1',
      quantity: 10,
      description: 'Công cụ dụng cụ thuốc thú y',
    },
    {
      company: vnist._id,
      category: listCategory[2]._id,
      name: 'Vải may quần áo, giày',
      code: 'VT001',
      type: 'material',
      baseUnit: 'kg',
      unit: [],
      sourceType: '1',
      quantity: 20000,
      description: 'Nguyên liệu may quần áo, giày',
    },
  ]);

  var listProduct = await Good(vnistDB).insertMany([
    {
      company: vnist._id,
      category: listCategory[0]._id,
      name: 'ĐƯỜNG ACESULFAME K',
      code: 'PR001',
      type: 'product',
      baseUnit: 'Thùng',
      unit: [],
      quantity: 20,
      materials: [
        {
          good: listGood[4]._id,
          quantity: 5,
        },
        {
          good: listGood[4]._id,
          quantity: 3,
        },
      ],
      numberExpirationDate: 800,
      description: 'Sản phẩm thuốc thú y',
      manufacturingMills: [
        {
          manufacturingMill: manufacturingMills[0]._id,
          productivity: 100,
          personNumber: 3,
        },
        {
          manufacturingMill: manufacturingMills[1]._id,
          productivity: 50,
          personNumber: 4,
        },
      ],
      pricePerBaseUnit: 90000,
      salesPriceVariance: 9000,
    },
    {
      company: vnist._id,
      category: listCategory[0]._id,
      name: 'ACID CITRIC MONO',
      code: 'PR002',
      type: 'product',
      baseUnit: 'Bao',
      unit: [],
      quantity: 20,
      materials: [
        {
          good: listGood[0]._id,
          quantity: 2,
        },
        {
          good: listGood[1]._id,
          quantity: 3,
        },
      ],
      numberExpirationDate: 900,
      description: 'Sản phẩm thuốc thú y',
      manufacturingMills: [
        {
          manufacturingMill: manufacturingMills[1]._id,
          productivity: 200,
          personNumber: 2,
        },
        {
          manufacturingMill: manufacturingMills[2]._id,
          productivity: 150,
          personNumber: 3,
        },
      ],
      pricePerBaseUnit: 80000,
      salesPriceVariance: 8000,
    },
    {
      company: vnist._id,
      category: listCategory[0]._id,
      name: 'TIFFY',
      code: 'PR003',
      type: 'product',
      baseUnit: 'Gói',
      unit: [],
      quantity: 100,
      materials: [
        {
          good: listGood[0]._id,
          quantity: 10,
        },
        {
          good: listGood[1]._id,
          quantity: 12,
        },
      ],
      numberExpirationDate: 1000,
      description: 'Sản phẩm trị cảm cúm',
      manufacturingMills: [
        {
          manufacturingMill: manufacturingMills[3]._id,
          productivity: 100,
          personNumber: 3,
        },
        {
          manufacturingMill: manufacturingMills[4]._id,
          productivity: 100,
          personNumber: 2,
        },
        {
          manufacturingMill: manufacturingMills[1]._id,
          productivity: 50,
          personNumber: 1,
        },
      ],
      pricePerBaseUnit: 100000,
      salesPriceVariance: 10000,
    },
  ]);

  
  const list_goods_in_stock = await Good(vnistDB).find({});

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU THÔNG TIN KHO
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu thông tin kho');
  var listStock = await Stock(vnistDB).insertMany([
    {
      company: vnist._id,
      name: 'Trần Đại Nghĩa',
      code: 'ST001',
      address: 'Trần Đại Nghĩa - Hai Bà Trưng - Hà Nội',
      description: 'D5',
      startTime: '07:00 AM',
      endTime: '07:00 PM',
      organizationalUnit: khoTDN._id,
      managementLocation: [
        {
          role: roleSuperAdmin._id,
          managementGood: ['product', 'material', 'waste'],
        },
        {
          role: roleAdmin._id,
          managementGood: ['material'],
        },
      ],
      status: '1',
      goods:
        // [
        //     {
        //         good: listGood[0]._id,
        //         maxQuantity: 100,
        //         minQuantity: 10,
        //     },
        //     {
        //         good: listGood[1]._id,
        //         maxQuantity: 200,
        //         minQuantity: 30,
        //     },
        //     {
        //         good: listProduct[0]._id,
        //         maxQuantity: 100,
        //         minQuantity: 10,
        //     },
        // ],
        Array.from({ length: 20 }, (_, index) => ({
          good: list_goods_in_stock[index]._id,
          maxQuantity: 1000,
          minQuantity: 10,
        })),
    },
    {
      company: vnist._id,
      name: 'Tạ Quang Bửu',
      code: 'ST002',
      address: 'Tạ Quang Bửu - Hai Bà Trưng - Hà Nội',
      description: 'B1',
      startTime: '07:00 AM',
      endTime: '07:00 PM',
      organizationalUnit: khoTQB._id,
      managementLocation: [
        {
          role: roleSuperAdmin._id,
          managementGood: ['product', 'material', 'waste'],
        },
        {
          role: roleAdmin._id,
          managementGood: ['product'],
        },
      ],
      status: '1',
      goods: [
        {
          good: listGood[0]._id,
          maxQuantity: 200,
          minQuantity: 50,
        },
        {
          good: listGood[1]._id,
          maxQuantity: 200,
          minQuantity: 30,
        },
        {
          good: listProduct[1]._id,
          maxQuantity: 50,
          minQuantity: 4,
        },
      ],
    },
  ]);
  console.log('Khởi tạo xong danh sách thông tin kho');

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU THÔNG TIN KHO
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu thông tin lưu trữ kho');
  var listBinLocations = await BinLocation(vnistDB).insertMany([
    {
      code: 'T1',
      name: 'Tầng 1',
      description: 'Dãy nhà dùng cho việc nghiên cứu',
      stock: listStock[1]._id,
      status: '1',
      parent: null,
      path: 'ST002-T1',
      unit: 'mét khối',
      capacity: '',
      contained: '',
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 200,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[1]._id,
          contained: 0,
          capacity: 100,
        },
      ],
    },
    {
      code: 'T2',
      name: 'Tầng 2',
      description: 'Dãy nhà dùng cho việc học tập',
      stock: listStock[1]._id,
      status: '1',
      parent: null,
      path: 'ST002-T2',
      unit: 'mét khối',
      capacity: '',
      contained: '',
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 200,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[1]._id,
          contained: 0,
          capacity: 100,
        },
      ],
    },
    {
      code: 'T3',
      name: 'Tầng 3',
      description: 'Dãy nhà dùng cho việc hội họp',
      stock: listStock[1]._id,
      status: '1',
      parent: null,
      path: 'ST002-T3',
      unit: 'mét khối',
      capacity: '',
      contained: '',
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[1]._id,
          contained: 0,
          capacity: 100,
        },
      ],
    },
  ]);

  var listBinLocationChilds = await BinLocation(vnistDB).insertMany([
    {
      code: 'P101',
      name: 'Phòng 101',
      description: 'Phòng thí nghiệm hóa',
      stock: listStock[1]._id,
      status: '1',
      parent: listBinLocations[0]._id,
      path: 'ST002-T1-P101',
      unit: 'mét khối',
      capacity: 200,
      contained: 10,
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 200,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[0]._id,
          contained: 80,
          capacity: 100,
        },
      ],
    },
    {
      code: 'P102',
      name: 'Phòng 102',
      description: 'Phòng thí nghiệm',
      stock: listStock[1]._id,
      status: '1',
      parent: listBinLocations[0]._id,
      path: 'ST002-T1-P102',
      unit: 'mét khối',
      capacity: 200,
      contained: 20,
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 200,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[0]._id,
          contained: 120,
          capacity: 200,
        },
      ],
    },
    {
      code: 'P103',
      name: 'Phòng 103',
      description: 'Phòng học toán',
      stock: listStock[1]._id,
      status: '1',
      parent: listBinLocations[0]._id,
      path: 'ST002-T1-P103',
      unit: 'mét khối',
      capacity: 200,
      contained: 0,
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[1]._id,
          contained: 0,
          capacity: 100,
        },
      ],
    },
    {
      code: 'T1',
      name: 'Tầng 1',
      description: 'Dãy nhà dùng cho việc nghiên cứu',
      stock: listStock[0]._id,
      status: '1',
      parent: null,
      path: 'ST001-T1',
      unit: 'khối',
      capacity: 200,
      contained: 0,
      child: [],
      enableGoods:
        // [
        //     {
        //         good: listGood[0]._id,
        //         contained: 0,
        //         capacity: 200,
        //     },
        //     {
        //         good: listGood[1]._id,
        //         contained: 0,
        //         capacity: 300,
        //     },
        //     {
        //         good: listProduct[1]._id,
        //         contained: 0,
        //         capacity: 100,
        //     },
        //     {
        //         good: list_goods[1]._id
        //     }
        // ],
        Array.from({ length: 300 }, (_, index) => ({
          good: list_goods_in_stock[index]._id,
          contained: 500,
          capacity: 1000,
        })),
    },
    {
      code: 'T2',
      name: 'Tầng 2',
      description: 'Dãy nhà dùng cho việc học tập',
      stock: listStock[0]._id,
      status: '1',
      parent: null,
      path: 'ST001-T2',
      unit: 'mét khối',
      capacity: 200,
      contained: 0,
      child: [],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 200,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[1]._id,
          contained: 0,
          capacity: 100,
        },
      ],
    },
  ]);

  console.log('Cập nhật nút con của thông tin lưu trữ kho');
  var listBin = await BinLocation(vnistDB).updateOne(
    {
      _id: listBinLocations[0]._id,
    },
    {
      code: 'T1',
      name: 'Tầng 1',
      description: 'Dãy nhà dùng cho việc nghiên cứu',
      stock: listStock[1]._id,
      status: '1',
      parent: null,
      path: 'ST002-T1',
      unit: 'mét khối',
      capacity: 200,
      contained: 10,
      child: [listBinLocationChilds[0]._id, listBinLocationChilds[1]._id, listBinLocationChilds[2]._id],
      enableGoods: [
        {
          good: listGood[0]._id,
          contained: 0,
          capacity: 200,
        },
        {
          good: listGood[1]._id,
          contained: 0,
          capacity: 300,
        },
        {
          good: listProduct[0]._id,
          contained: 80,
          capacity: 100,
        },
      ],
    }
  );

  /*---------------------------------------------------------------------------------------------
         -----------------------------------------------------------------------------------------------
             TẠO DỮ LIỆU THÔNG TIN MODULE SẢN XUẤT
         -----------------------------------------------------------------------------------------------
         ----------------------------------------------------------------------------------------------- */

  // ****************** Tạo mẫu dữ liệu mẫu kế hoạch sản xuất********************

  const manufacturingPlansData = [
    {
      code: 'KHSX202400001',
      manufacturingOrder: '5fa4fa483b746017bca19a3d',
      manufacturingWorks: [manufacturingWorks[0]._id],
      goods: [
        {
          good: listProduct[0]._id,
          quantity: 200,
          orderedQuantity: 150,
        },
      ],

      approvers: [
        {
          approver: users[0]._id,
        },
      ],
      creator: users[13]._id,
      startDate: '2024-04-16',
      endDate: '2024-04-22',
      description: 'Kế hoạch sản xuất trong tháng 4 năm 2024',
      logs: [
        {
          creator: users[13]._id,
          title: 'Tạo kế hoạch sản xuất',
          description: 'Tạo kế hoạch sản xuất KHSX202400001',
        },
      ],
    },
  ];

  const manufacturingPlans = await ManufacturingPlan(vnistDB).insertMany(manufacturingPlansData);

  console.log('Tạo kế hoạch sản xuất');

  // ****************** Tạo mẫu dữ liệu mẫu lệnh sản xuất sản xuất********************
  const manufacturingCommandData = [
    {
      code: 'LSX202400001',
      manufacturingPlan: manufacturingPlans[0]._id,
      startDate: '2024-04-16',
      endDate: '2024-04-20',
      startTurn: 1,
      endTurn: 3,
      good: listProduct[0],
      quantity: 20,
      workOrders: [
        {
          operation: 'Nhập nguyên liệu',
          manufacturingMill: manufacturingMills[7]._id,
          startDate: '2024-04-16',
          startHour: 6,
          endDate: '2024-04-16',
          endHour: 22,
          responsibles: [users[19]._id],
          machines: [],
        },
        {
          operation: 'Xay nguyên liệu',
          manufacturingMill: manufacturingMills[8]._id,
          startDate: '2024-04-16',
          startHour: 22,
          endDate: '2024-04-18',
          endHour: 6,
          responsibles: [users[20]._id],
          machines: [listAsset[6]._id],
        },
        {
          operation: 'Trộn nguyên liệu',
          startDate: '2024-04-18',
          startHour: 6,
          endDate: '2024-04-19',
          endHour: 6,
          manufacturingMill: manufacturingMills[9]._id,
          responsibles: [users[21]._id],
          machines: [listAsset[7]._id],
        },
        {
          operation: 'Nén hạt',
          startDate: '2024-04-19',
          startHour: 6,
          endDate: '2024-04-20',
          endHour: 14,
          manufacturingMill: manufacturingMills[10]._id,
          responsibles: [users[22]._id],
          machines: [listAsset[8]._id],
        },
        {
          operation: 'Đóng gói',
          startDate: '2024-04-20',
          startHour: 14,
          endDate: '2024-04-21',
          endHour: 6,
          manufacturingMill: manufacturingMills[11]._id,
          responsibles: [users[23]._id],
        },
      ],
      qualityControlStaffs: [
        {
          staff: users[0]._id,
          time: new Date('2024-04-20 6:00:00'),
          status: 3,
        },
      ],
      status: 3,
      creator: users[13]._id,
      accountables: [users[11]._id, users[0]._id],
      description: 'Lệnh sản xuất đường ACK của nhà máy sản xuất thuốc bột',
    },
  ];

  const manufacturingCommands = await ManufacturingCommand(vnistDB).insertMany(manufacturingCommandData);

  console.log('Tạo lệnh sản xuất');

  // Gán lệnh SX vào trong kế hoạch sản xuất

  const manufacturingPlansNumber0 = await ManufacturingPlan(vnistDB).findById(manufacturingPlans[0]._id);
  manufacturingPlansNumber0.manufacturingCommands.push(manufacturingCommands[0]._id);
  await manufacturingPlansNumber0.save();

  // ****************** Tạo mẫu dữ liệu mẫu lịch làm việc cho xưởng và công nhân********************
  let array30days = [];
  for (let i = 0; i < 30; i++) {
    // if (i == 2 || i == 3) {
    //     array30days.push(manufacturingCommands[0]._id);
    // } else {
    //     array30days.push(null);
    // }
    array30days.push(null);
  }
  let array31days = [];
  for (let i = 0; i < 31; i++) {
    array31days.push(null);
  }

  const workScheduleData = [
    {
      manufacturingMill: manufacturingMills[7]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
    {
      manufacturingMill: manufacturingMills[8]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
    {
      manufacturingMill: manufacturingMills[9]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
    {
      manufacturingMill: manufacturingMills[10]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
    {
      manufacturingMill: manufacturingMills[11]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
    {
      user: users[19]._id,
      month: '2024-04',
      turns: [array30days, array30days, array30days],
    },
    {
      user: users[20]._id,
      month: '2024-04',
      turns: [array30days, array30days, array30days],
    },
    {
      user: users[21]._id,
      month: '2024-04',
      turns: [array30days, array30days, array30days],
    },
    {
      user: users[22]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
    {
      user: users[23]._id,
      month: '2024-04',
      turns: [array31days, array31days, array31days],
    },
  ];

  const workSchedules = await WorkSchedule(vnistDB).insertMany(workScheduleData);

  let workSchedule0 = await WorkSchedule(vnistDB).find({
    _id: {
      $in: [workSchedules[0]._id, workSchedules[5]._id],
    },
  });

  for (let i = 0; i < workSchedule0.length; i++) {
    workSchedule0[i].turns[0][15] = manufacturingCommands[0]._id;
    workSchedule0[i].turns[1][15] = manufacturingCommands[0]._id;
    await workSchedule0[i].markModified('turns');
    await workSchedule0[i].save();
  }

  let workSchedule1 = await WorkSchedule(vnistDB).find({
    _id: {
      $in: [workSchedules[1]._id, workSchedules[6]._id],
    },
  });
  for (let i = 0; i < workSchedule0.length; i++) {
    workSchedule1[i].turns[2][15] = manufacturingCommands[0]._id;
    workSchedule1[i].turns[0][16] = manufacturingCommands[0]._id;
    workSchedule1[i].turns[1][16] = manufacturingCommands[0]._id;
    workSchedule1[i].turns[2][16] = manufacturingCommands[0]._id;

    await workSchedule1[i].markModified('turns');
    await workSchedule1[i].save();
  }

  let workSchedule2 = await WorkSchedule(vnistDB).find({
    _id: {
      $in: [workSchedules[2]._id, workSchedules[7]._id],
    },
  });
  for (let i = 0; i < workSchedule0.length; i++) {
    workSchedule2[i].turns[0][17] = manufacturingCommands[0]._id;
    workSchedule2[i].turns[1][17] = manufacturingCommands[0]._id;
    workSchedule2[i].turns[2][17] = manufacturingCommands[0]._id;

    await workSchedule2[i].markModified('turns');
    await workSchedule2[i].save();
  }

  let workSchedule3 = await WorkSchedule(vnistDB).find({
    _id: {
      $in: [workSchedules[3]._id, workSchedules[8]._id],
    },
  });

  for (let i = 0; i < workSchedule0.length; i++) {
    workSchedule3[i].turns[0][18] = manufacturingCommands[0]._id;
    workSchedule3[i].turns[1][18] = manufacturingCommands[0]._id;
    workSchedule3[i].turns[2][18] = manufacturingCommands[0]._id;
    workSchedule3[i].turns[0][19] = manufacturingCommands[0]._id;

    await workSchedule3[i].markModified('turns');
    await workSchedule3[i].save();
  }

  let workSchedule4 = await WorkSchedule(vnistDB).find({
    _id: {
      $in: [workSchedules[4]._id, workSchedules[9]._id],
    },
  });

  for (let i = 0; i < workSchedule0.length; i++) {
    workSchedule4[i].turns[1][19] = manufacturingCommands[0]._id;
    workSchedule4[i].turns[2][19] = manufacturingCommands[0]._id;
    ``;
    await workSchedule4[i].markModified('turns');
    await workSchedule4[i].save();
  }

  console.log('Tạo dữ liệu lịch làm việc cho xưởng và công nhân');

  //************Tạo mẫu dữ liệu lô hàng******************* */
  console.log('Tạo mẫu dữ liệu lô hàng');
  const listLot = await Lot(vnistDB).insertMany([
    {
      code: 'LOT001',
      lotType: 2,
      good: listProduct[0]._id,
      type: 'product',
      stocks: [
        {
          stock: listStock[0]._id,
          quantity: 100,
          binLocations: [
            {
              binLocation: listBinLocationChilds[3]._id,
              quantity: 40,
            },
            {
              binLocation: listBinLocationChilds[4]._id,
              quantity: 60,
            },
          ],
        },
        {
          stock: listStock[1]._id,
          quantity: 200,
          binLocations: [
            {
              binLocation: listBinLocationChilds[0]._id,
              quantity: 80,
            },
            {
              binLocation: listBinLocationChilds[1]._id,
              quantity: 120,
            },
          ],
        },
      ],
      originalQuantity: 300,
      quantity: 300,
      expirationDate: new Date('12-12-2021'),
      description: 'Lô hàng tự tạo',
      lotLogs: [
        {
          quantity: 200,
          description: 'Nhập hàng lần đầu',
          type: '2',
          createdAt: new Date('05-06-2020'),
          stock: listStock[1]._id,
          binLocations: [
            {
              binLocation: listBinLocationChilds[0]._id,
              quantity: 80,
            },
            {
              binLocation: listBinLocationChilds[1]._id,
              quantity: 120,
            },
          ],
        },
        {
          quantity: 100,
          description: 'Nhập hàng lần hai',
          type: '2',
          createdAt: new Date('05-10-2020'),
          stock: listStock[0]._id,
          binLocations: [
            {
              binLocation: listBinLocationChilds[3]._id,
              quantity: 40,
            },
            {
              binLocation: listBinLocationChilds[4]._id,
              quantity: 60,
            },
          ],
        },
      ],
    },
    {
      code: 'LTP0001',
      lotType: 1,
      good: listProduct[0]._id,
      type: 'product',
      originalQuantity: 300,
      quantity: 300,
      expirationDate: new Date('12-12-2021'),
      description: 'Lô thành phẩm',
      status: 1,
      creator: users[0]._id,
      manufacturingCommand: manufacturingCommands[0]._id,
      productType: 1,
    },
    {
      code: 'LPP0001',
      lotType: 1,
      good: listProduct[0]._id,
      type: 'product',
      originalQuantity: 20,
      quantity: 20,
      expirationDate: new Date('12-12-2021'),
      description: 'Lô phế phẩm',
      status: 1,
      creator: users[0]._id,
      manufacturingCommand: manufacturingCommands[0]._id,
      productType: 2,
    },
  ]);
  console.log('Tạo xong mẫu dữ liệu lô hàng');

  //*********************Tạo mẫu dữ liệu các loại phiếu nhập, xuất ****** */
  console.log('Tạo dữ liệu mẫu các loại phiếu');
  var listBill = await Bill(vnistDB).insertMany([
    {
      code: 'BI001',
      type: '2',
      group: '1',
      fromStock: listStock[0]._id,
      users: [],
      creator: users[1]._id,
      partner: {
        customer: null,
        supplier: null,
      },
      approver: users[1]._id,
      receiver: {
        name: 'Phạm Đại Tài',
        phone: '0344213030',
        email: 'thangbao2698@gmail.com',
        address: 'Thuần Thiện - Can Lộc - Hà Tĩnh',
      },
      status: '2',
      timestamp: '02-06-2020',
      description: 'Nhập kho thành phẩm',
      goods: [
        {
          good: listProduct[0]._id,
          quantity: 200,
          lots: [
            {
              lot: listLot[0]._id,
              quantity: 200,
            },
          ],
          description: 'Nhập hàng',
        },
      ],
    },
    // {
    //     code: "BI002",
    //     type: "3",
    //     group: "2",
    //     fromStock: listStock[0]._id,
    //     users: [],
    //     creator: users[5]._id,
    //     partner: {
    //         customer: null,
    //         supplier: null,
    //     },
    //     approver: users[2]._id,
    //     receiver: {
    //         name: "Nguyễn Văn Thắng",
    //         phone: 0344213030,
    //         email: "thangbao2698@gmail.com",
    //         address: "Thuần Thiện - Can Lộc - Hà Tĩnh",
    //     },
    //     status: "2",
    //     timestamp: "10-12-2020",
    //     description: "Xuất kho thành phẩm",
    //     goods: [
    //         {
    //             good: listProduct[0]._id,
    //             quantity: 275,
    //             lots: [
    //                 {
    //                     lot: listLot[0]._id,
    //                     quantity: 135,
    //                 },
    //                 {
    //                     lot: listLot[2]._id,
    //                     quantity: 140,
    //                 },
    //             ],
    //             description: "Xuất hàng",
    //         },
    //         {
    //             good: listProduct[1]._id,
    //             quantity: 345,
    //             lots: [
    //                 {
    //                     lot: listLot[1]._id,
    //                     quantity: 345,
    //                 },
    //             ],
    //             description: "Xuất thành phẩm",
    //         },
    //     ],
    // },
    // {
    //     code: "BI003",
    //     type: "4",
    //     group: "2",
    //     fromStock: listStock[0]._id,
    //     users: [],
    //     creator: users[0]._id,
    //     partner: {
    //         customer: null,
    //         supplier: null,
    //     },
    //     approvers: [{
    //         approver: users[2]._id,
    //         approvedTime: null
    //     }],
    //     receiver: {
    //         name: "Nguyễn Văn Thắng",
    //         phone: 0344213030,
    //         email: "thangbao2698@gmail.com",
    //         address: "Thuần Thiện - Can Lộc - Hà Tĩnh",
    //     },
    //     status: "1",
    //     timestamp: "10-12-2020",
    //     description: "Xuất kho nguyên vật liệu",
    //     goods: [
    //         {
    //             good: listGood[0]._id,
    //             quantity: 275,
    //             lots: [
    //                 {
    //                     lot: listLot[0]._id,
    //                     quantity: 135,
    //                 },
    //                 {
    //                     lot: listLot[2]._id,
    //                     quantity: 140,
    //                 },
    //             ],
    //             description: "Xuất xuất nguyên vật liệu",
    //         },
    //         {
    //             good: listGood[1]._id,
    //             quantity: 345,
    //             lots: [
    //                 {
    //                     lot: listLot[1]._id,
    //                     quantity: 345,
    //                 },
    //             ],
    //             description: "Xuất nguyên vật liệu theo đúng tiêu chuẩn",
    //         },
    //     ],
    //     manufacturingCommand: manufacturingCommands[0]._id,
    //     manufacturingMill: manufacturingMills[0]._id
    // },
    // {
    //     code: "BI004",
    //     type: "4",
    //     group: "2",
    //     fromStock: listStock[1]._id,
    //     users: [],
    //     creator: users[0]._id,
    //     partner: {
    //         customer: null,
    //         supplier: null,
    //     },
    //     approvers: [{
    //         approver: users[2]._id,
    //         approvedTime: null
    //     }],
    //     receiver: {
    //         name: "Nguyễn Văn Thắng",
    //         phone: 0344213030,
    //         email: "thangbao2698@gmail.com",
    //         address: "Thuần Thiện - Can Lộc - Hà Tĩnh",
    //     },
    //     status: "1",
    //     timestamp: "10-12-2020",
    //     description: "Xuất kho nguyên vật liệu",
    //     goods: [
    //         {
    //             good: listGood[0]._id,
    //             quantity: 275,
    //             lots: [
    //                 {
    //                     lot: listLot[0]._id,
    //                     quantity: 135,
    //                 },
    //                 {
    //                     lot: listLot[2]._id,
    //                     quantity: 140,
    //                 },
    //             ],
    //             description: "Xuất xuất nguyên vật liệu",
    //         },
    //         {
    //             good: listGood[1]._id,
    //             quantity: 345,
    //             lots: [
    //                 {
    //                     lot: listLot[1]._id,
    //                     quantity: 345,
    //                 },
    //             ],
    //             description: "Xuất nguyên vật liệu theo đúng tiêu chuẩn",
    //         },
    //     ],
    //     manufacturingCommand: manufacturingCommands[0]._id,
    //     manufacturingMill: manufacturingMills[0]._id
    // },
  ]);

  console.log('Tạo xong dữ liệu mẫu các loại phiếu');

  var lotUpdate = await Lot(vnistDB).updateOne(
    {
      _id: listLot[0]._id,
    },
    {
      name: 'LOT001',
      good: listProduct[0]._id,
      type: 'product',
      stocks: [
        {
          stock: listStock[1]._id,
          quantity: 200,
          binLocations: [
            {
              binLocation: listBinLocationChilds[0]._id,
              quantity: 80,
            },
            {
              binLocation: listBinLocationChilds[1]._id,
              quantity: 120,
            },
          ],
        },
      ],
      originalQuantity: 200,
      quantity: 200,
      expirationDate: new Date('12-12-2021'),
      description: 'Lô hàng tự tạo',
      lotLogs: [
        {
          bill: listBill[0]._id,
          quantity: 200,
          description: 'Nhập hàng lần đầu',
          type: 'Nhập kho thành phẩm',
          createdAt: new Date('05-06-2020'),
          stock: listStock[1]._id,
          binLocations: [
            {
              binLocation: listBinLocationChilds[0]._id,
              quantity: 80,
            },
            {
              binLocation: listBinLocationChilds[1]._id,
              quantity: 120,
            },
          ],
        },
      ],
    }
  );

  // *********** Tạo mẫu dữ liệu tiêu chí kiểm tra chất lượng sản phẩm *********
  const manufacturingQualityCriteriaData = [
    {
      code: 'TC25032024',
      name: 'Tiêu chí kiểm định nén thuốc viên',
      operation: 'Nén viên',
      goods: [listProduct[0]._id],
      checklist: [
        {
          name: 'Lực nén',
          method: 'Máy đo lực nén',
          acceptedValue: '100N',
        },
        {
          name: 'Độ dày',
          method: 'Thước đo độ dày',
          acceptedValue: '3mm',
        },
        {
          name: 'Trọng lượng',
          method: 'Cân',
          acceptedValue: '350mg',
        },
        {
          name: 'Độ tan rã',
          method: 'Máy kiểm tra độ tan rã',
          acceptedValue: '15p',
        },
      ],
      status: 1,
      creator: users[19]._id,
    },
    {
      code: 'TC26032024',
      name: 'Tiêu chí kiểm định chia nguyên liệu',
      operation: 'Chia nguyên liệu',
      products: [listProduct[0]._id],
      checklist: [
        {
          name: 'Kích thước hạt',
          method: 'Máy sàng hạt',
          acceptedValue: 'Phù hợp với tiêu chuẩn',
        },
        {
          name: 'Tỷ lệ phần trăm rây',
          method: 'Máy sàng hạt',
          acceptedValue: 'Phù hợp với tiêu chuẩn',
        },
      ],
      status: 1,
      creator: users[19]._id,
    },
    {
      code: 'TC27032024',
      name: 'Tiêu chí kiểm định trộn nguyên liệu',
      operation: 'Trộn nguyên liệu',
      products: [listProduct[0]._id],
      checklist: [
        {
          name: 'Đồng nhất',
          method: 'Kiểm tra bằng mắt',
          acceptedValue: 'Phân bố đều',
        },
        {
          name: 'Độ ẩm',
          method: 'Máy đo độ ẩm',
          acceptedValue: '<= 5%',
        },
      ],
      status: 1,
      creator: users[19]._id,
    },
    {
      code: 'TC28032024',
      name: 'Tiêu chí kiểm định bao phim thuốc',
      operation: 'Bao phim',
      products: [listProduct[0]._id],
      checklist: [
        {
          name: 'Độ dày',
          method: 'Máy đo độ dày',
          acceptedValue: '3mm - 5mm',
        },
        {
          name: 'Độ hòa tan',
          method: 'Máy kiểm tra độ hòa tan',
          acceptedValue: '100S - 150S',
        },
      ],
      status: 1,
      creator: users[19]._id,
    },
    {
      code: 'TC29032024',
      name: 'Tiêu chí kiểm định đóng gói sản phẩm',
      operation: 'Đóng gói',
      products: [listProduct[0]._id],
      checklist: [
        {
          name: 'Chất lượng bao bì',
          method: 'Kiểm tra bằng mắt',
          acceptedValue: '100% không nứt, vỡ',
        },
        {
          name: 'In ấn',
          method: 'Kiểm tra bằng mắt',
          acceptedValue: 'Rõ ràng, sắc nét',
        },
      ],
      status: 1,
      creator: users[19]._id,
    },
    {
      code: 'TC230032024',
      name: 'Tiêu chí kiểm định thành phẩm',
      operation: 'Kiểm tra thành phẩm',
      products: [listProduct[0]._id],
      checklist: [
        {
          name: 'Hàm lượng hoạt chất',
          method: 'HPLC, UV-Vis',
          acceptedValue: 'Phù hợp với tiêu chuẩn',
        },
        {
          name: 'Độ pH',
          method: 'Máy đo pH',
          acceptedValue: 'Phù hợp với tiêu chuẩn',
        },
      ],
      status: 1,
      creator: users[19]._id,
    },
  ];

  const manufacturingQualityCriterias = await ManufacturingQualityCriteria(vnistDB).insertMany(manufacturingQualityCriteriaData);

  console.log('Tạo dữ liệu tiêu chí kiểm tra chất lượng sản phẩm');

  // ******************* Tạo mẫu dữ liệu lôi sản phẩm ************************
  const manufacturingQualityErrorData = [
    {
      code: 'LSP25032024',
      group: 'Nhân lực',
      name: 'Sai lệch hàm lượng hoạt chất',
      description:
        'Hàm lượng hoạt chất trong sản phẩm không nằm trong phạm vi cho phép',
      recognize: [
        'Kết quả kiểm nghiệm không đạt yêu cầu',
        'Khả năng ảnh hưởng đến hiệu quả và độ an toàn của thuốc',
      ],
      resolution: [
        'Đào tạo lại nhân viên về quy trình cân nguyên liệu và trộn nguyên liệu',
        'Nâng cao kỹ năng thao tác và tập trung của nhân viên',
      ],
      cause: 'Nhân viên thao tác sai quy trình',
      reporter: users[19]._id,
      aql: 0.15,
    },
    {
      code: 'LSP26032024',
      group: 'Nhân lực',
      name: 'Nhầm lẫn nguyên liệu',
      description: 'Các nguyên liệu bị nhầm trong cùng một nhóm',
      recognize: ['Sản phẩm có màu sắc, mùi vị khác thường'],
      resolution: [
        'Đào tạo lại nhân viên về cách nhận biết nguyên liệu',
        'Làm rõ nhãn mác nguyên liệu',
      ],
      cause: 'Nhãn mác nguyên liệu không rõ ràng',
      reporter: users[19]._id,
      aql: 0.05,
      created_at: '16/03/2024',
    },
    {
      code: 'LSP27032024',
      group: 'Máy móc',
      name: 'Vi sinh vật vượt quá giới hạn cho phép',
      description: 'Số lượng vi sinh vật trong sản phẩm cao hơn mức cho phép',
      recognize: ['Kết quả kiểm nghiệm vi sinh vật không đạt yêu cầu'],
      resolution: [
        'Bảo trì, bảo dưỡng thiết bị sản xuất định kỳ.',
        'Khử trùng thiết bị sản xuất bằng phương pháp hiệu quả',
      ],
      cause: 'Thiết bị sản xuất không được khử trùng hoặc bảo trì đúng cách',
      reporter: users[19]._id,
      aql: 0.05,
      created_at: '16/03/2024',
    },
    {
      code: 'LSP28032024',
      group: 'Nguyên vật liệu',
      name: 'Bao bì bị rách, nứt',
      description: 'Bao bì sản phẩm không đảm bảo chất lượng',
      recognize: ['Bao bì sản phẩm bị rách, nứt'],
      resolution: ['Kiểm tra chất lượng bao bì đầu vào'],
      cause: 'Nguyên liệu bao bì không đạt chất lượng',
      reporter: users[19]._id,
      aql: 0.05,
      created_at: '16/03/2024',
    },
    {
      code: 'LSP30032024',
      group: 'Nguyên vật liệu',
      name: 'Sản phẩm bị biến màu',
      description: 'Màu sắc của thuốc khác so với tiêu chuẩn',
      recognize: ['Không đạt kiểm tra thành phẩn sản phẩm'],
      resolution: [
        'Kiểm tra chất lượng nguyên liệu đầu vào',
        'Bảo quản nguyên liệu và thành phẩm ở điều kiện phù hợp',
      ],
      cause: 'Bảo quản nguyên liệu hoặc thành phẩm không đúng cách',
      reporter: users[19]._id,
      aql: 0.05,
      created_at: '16/03/2024',
    },
    {
      code: 'LSP31032024',
      group: 'Máy móc',
      name: 'Viên thuốc bị nứt, vỡ',
      description: 'Viên thuốc không nguyên vẹn',
      recognize: ['Sản phẩm bị nứt, vỡ'],
      resolution: [
        'Bảo trì, bảo dưỡng máy móc sản xuất định kỳ',
        'Kiểm tra và điều chỉnh lực nén viên thuốc',
      ],
      cause: 'Lực nén viên thuốc quá cao',
      reporter: users[19]._id,
      aql: 0.05,
      created_at: '16/03/2024',
    },
  ];

  const manufacturingQualityErrors = await ManufacturingQualityError(vnistDB).insertMany(manufacturingQualityErrorData);

  console.log('Tạo dữ liệu lỗi sản phẩm');

  // ******************* Tạo mẫu dữ liệu phiếu QC ****************************
  const manufacturingQualityInspectionData = [
    {
      code: 'PQC190302024',
      manufacturingCommand: manufacturingCommands[0]._id,
      type: 1,
      responsible: users[19]._id,
      criteria: manufacturingQualityCriterias[0]._id,
      result: {
        inspectionNum: 80,
        passedNum: 75,
        errorNum: 5,
        errorList: [manufacturingQualityErrors[0]._id, manufacturingQualityErrors[1]._id],
        final: 1,
      },
    },
    {
      code: 'PQC200302024',
      manufacturingCommand: manufacturingCommands[0]._id,
      type: 1,
      responsible: users[19]._id,
      criteria: manufacturingQualityCriterias[0]._id,
      result: {
        inspectionNum: 80,
        passedNum: 75,
        errorNum: 5,
        errorList: [manufacturingQualityErrors[2]._id],
        final: 1,
      },
    },
    {
      code: 'PQC210302024',
      manufacturingCommand: manufacturingCommands[0]._id,
      type: 1,
      responsible: users[19]._id,
      criteria: manufacturingQualityCriterias[0]._id,
      result: {
        inspectionNum: 80,
        passedNum: 75,
        errorNum: 5,
        errorList: [manufacturingQualityErrors[3]._id],
        final: 1,
      },
    },
  ];

  const manufacturingQualityInspections = await ManufacturingQualityInspection(vnistDB).insertMany(manufacturingQualityInspectionData);

  /***************** Tạo dữ liệu định tuyến sản xuất ************************/
  const manufacturingRoutingData = [
    {
      code: 'DT19032024',
      name: 'Quy trình sản xuất đường ACK',
      manufacturingWorks: manufacturingWorks[0]._id,
      goods: [listProduct[0]._id],
      creator: users[19]._id,
      status: 1,
      description: 'Quy trình sản xuất đường ACK của nhà máy thuốc bột',
      operations: [
        {
          id: 1,
          name: 'Nhập nguyên liệu',
          manufacturingMill: manufacturingMills[7]._id,
          setupTime: 1,
          hourProduction: 200,
          workers: [
            {
              workerRole: nvXuongNguyenLieu._id,
              expYear: 1,
              number: 2,
            },
          ],
          nextOperation: 2,
        },
        {
          id: 2,
          name: 'Xay nguyên liệu',
          manufacturingMill: manufacturingMills[8]._id,
          setupTime: 1,
          hourProduction: 200,
          workers: [
            {
              workerRole: nvXuongXay._id,
              expYear: 1,
              number: 1,
            },
          ],
          machines: [
            {
              machine: listAsset[6]._id,
              operatingCost: 40000,
              number: 1,
            },
          ],

          preOperation: 1,
          nextOperation: 3,
        },
        {
          id: 3,
          name: 'Trộn nguyên liệu',
          manufacturingMill: manufacturingMills[9]._id,
          setupTime: 1,
          hourProduction: 200,
          workers: [
            {
              workerRole: nvXuongTron._id,
              expYear: 1,
              number: 1,
            },
          ],
          machines: [
            {
              machine: listAsset[7]._id,
              operatingCost: 20000,
              number: 1,
            },
          ],

          preOperation: 2,
          nextOperation: 4,
        },
        {
          id: 4,
          name: 'Dập viên nén',
          manufacturingMill: manufacturingMills[10]._id,
          setupTime: 1,
          hourProduction: 200,
          workers: [
            {
              workerRole: nvXuongNen._id,
              expYear: 1,
              number: 1,
            },
          ],
          machines: [
            {
              machine: listAsset[8]._id,
              operatingCost: 40000,
              number: 1,
            },
          ],

          preOperation: 3,
          nextOperation: 5,
        },
        {
          id: 5,
          name: 'Đóng gói',
          manufacturingMill: manufacturingMills[11]._id,
          setupTime: 1,
          hourProduction: 200,
          workers: [
            {
              workerRole: nvXuongDongGoi._id,
              expYear: 1,
              number: 1,
            },
          ],
          preOperation: 4,
        },
      ],
    },
  ];

  const manufacturingRoutings = await ManufacturingRouting(vnistDB).insertMany(manufacturingRoutingData);

  console.log('Tạo dữ liệu định tuyến sản xuất');

  //**********************************Tạo dữ liệu đơn vị chăm sóc khách hàng */
  const CustomerUnitData = [
    {
      organizationalUnit: boPhanCSKH[0]._id,
      creator: users[5]._id,
      createdAt: new Date(),
    },
  ];
  const customerCareUnits = await CustomerCareUnit(vnistDB).insertMany(CustomerUnitData);

  // ****************** Tạo mẫu dữ liệu khách hàng********************
  console.log('Tạo mẫu dữ liệu nhóm khách hàng');

  const customerGroupData = [
    {
      name: 'Khách bán buôn',
      code: 'NHKHKBB',
      description: 'Nhóm khách chỉ bán buôn',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Sỉ lẻ',
      code: 'NKHBBSL',
      description: 'Nhóm khách chỉ bán sĩ lẻ',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Nhóm khách theo khu vực',
      code: 'NKHKV',
      description: 'Nhóm khách theo khu vực',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Khách VIP',
      code: 'KHVIP1',
      description: 'Khách VIP',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
  ];
  const customerGroups = await CustomerGroup(vnistDB).insertMany(
    customerGroupData
  );
  console.log('Xong! Đã tạo mẫu dữ liệu nhóm khách hàng');

  // ****************** Tạo mẫu dữ liệu trạng thái khách hàng********************
  console.log('Tạo mẫu dữ liệu trạng thái khách hàng');
  const customerStatusData = [
    {
      code: 'ST001',
      name: 'Tiềm năng',
      description: 'Khách hàng mới toanh',
      active: false,
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      code: 'ST002',
      name: 'Quan tâm sản phẩm',
      description: 'Khách hàng hứng thú với sản phẩm của công ty',
      active: false,
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      code: 'ST003',
      name: 'Đã báo giá',
      description: 'Khách hàng đã được báo giá',
      active: false,
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      code: 'ST005',
      name: 'Đã kí hợp đồng',
      description: 'Khách hàng đã kỹ hợp đồng với công ty',
      active: false,
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      code: 'ST004',
      name: 'Đã mua sản phẩm',
      description: 'Khách hàng đã mua sản phẩm',
      active: false,
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
  ];
  const customerStatuss = await CustomerStatus(vnistDB).insertMany(
    customerStatusData
  );
  console.log('Xong! Đã tạo mẫu dữ liệu trạng thái khách hàng');

  // ****************** Tạo mẫu dữ liệu hình thức chăm sóc khách hàng********************
  console.log('Tạo mẫu dữ liệu hình thức chăm sóc khách hàng');
  const customerCareType = [
    {
      name: 'Gọi điện tư vấn',
      description: 'Gọi điện tư vấn',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Gửi Email',
      description: 'Gửi Email giới thiệu ...',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Gặp mặt trực tiếp',
      description: 'Hẹn gặp khách hàng trực tiếp',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
  ];
  const customerCareTypes = await CustomerCareType(vnistDB).insertMany(
    customerCareType
  );
  console.log('Xong! Đã tạo mẫu dữ liệu hình thức chăm sóc khách hàng');
  // ****************** Tạo mẫu dữ liệu xếp hạng khách hàng********************

  const customerRankPoints = [
    {
      name: 'Đồng',
      point: 0,
      description: 'Xếp hạng đồng',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    /* 2 */
    {
      name: 'Bạc',
      point: 500,
      description: 'Xếp hạng bạc',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Vàng',
      point: 1000,
      description: 'Xếp hạng bạc',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
    {
      name: 'Bạch kim',
      point: 10000,
      description: 'Xếp hạng bạch kim ',
      creator: users[5]._id,
      updatedBy: users[5]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerCareUnit: customerCareUnits[0]._id,
    },
  ];

  await CustomerRankPoint(vnistDB).insertMany(customerRankPoints);
  console.log('Xong! Đã tạo mẫu dữ liệu hình thức chăm sóc khách hàng');

  // ****************** Tạo mẫu dữ liệu khách hàng********************
  var surname = ['Ngô', 'Đinh', 'Lê', 'Lý', 'Trần', 'Hồ', 'Trịnh', 'Nguyễn'];
  var middleName = [
    'Văn',
    'Thị',
    'Hương',
    'Bá',
    'Trung',
    'Duy',
    'Viết',
    'An',
    'Xuân',
    'Hoàng',
  ];
  var name = [
    'Thái',
    'Quyền',
    'Lĩnh',
    'Hoàn',
    'Cảnh',
    'Ly',
    'Ánh',
    'Trực',
    'An',
    'Tùng',
    'Nam',
    'Việt',
  ];
  const getRandomCustomerName = () => {
    var surnameIndex = Math.floor(Math.random() * 8);
    var middleNameIndex = Math.floor(Math.random() * 10);
    var nameIndex = Math.floor(Math.random() * 12);
    return `${surname[surnameIndex]} ${middleName[middleNameIndex]} ${name[nameIndex]}`;
  };
  let listCustomerData = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 50; j++) {
      const name = await getRandomCustomerName();
      const now = new Date();
      const month = now.getMonth() - i > 0 ? now.getMonth() - i : now.getMonth() - i + 12;
      const year = now.getMonth() - i > 0 ? now.getFullYear() : now.getFullYear() - 1;
      const customer = {
        owner: [users[(j % 3) + 5]._id],
        customerStatus: [customerStatuss[j % 5]._id],
        point: 0,
        isDeleted: false,
        code: `KH${i * 50 + j + 1}`,
        name: name,
        customerType: 1,
        customerGroup: customerGroups[j % 4]._id,
        gender: 2,
        birthDate: new Date('1998-09-03'),
        mobilephoneNumber: 123456789,
        email: 'ThaiNguyen@gmail.com',
        address: 'Nghệ An',
        telephoneNumber: 123456789,
        taxNumber: 'Tax 123456789',
        location: 1,
        customerSource: 'FaceBook',
        statusHistories: [
          {
            createdAt: new Date(),
            oldValue: customerStatuss[1]._id,
            newValue: customerStatuss[1]._id,
            createdBy: users[(j % 3) + 5]._id,
            description: 'Khách hàng được khởi tạo',
          },
          {
            oldValue: customerStatuss[1]._id,
            newValue: customerStatuss[j % 5]._id,
            createdAt: new Date(),
            createdBy: users[(j % 3) + 5]._id,
            description: 'Khách hàng đã được chuyển trạng thái',
          },
        ],
        creator: users[(j % 3) + 5]._id,
        rankPoints: [
          {
            point: Math.floor(Math.random() * 9876),
            expirationDate: new Date(year, 12),
          },
          {
            point: Math.floor(Math.random() * 98),
            expirationDate: new Date(year, 12),
          },
        ],
        files: [],
        promotions: [],
        createdAt: new Date(year, month),
        updatedAt: new Date(),
        __v: 0,
        address2: '',
        company: '',
        companyEstablishmentDate: null,
        email2: '',
        linkedIn: '',
        note: '',
        represent: '',
        website: '',
        customerCareUnit: customerCareUnits[0]._id,
      };
      listCustomerData = [...listCustomerData, customer];
    }
  }

  var listCustomers = await Customer(vnistDB).insertMany(listCustomerData);
  console.log('Xong! Đã tạo mẫu dữ liệu khách hàng');

  let listCustomerData1 = [];
  for (let i = 0; i < 200; i++) {
    const now = new Date();
    const month = now.getMonth() - i > 0 ? now.getMonth() - i : now.getMonth() - i + 12;
    const year = now.getMonth() - i > 0 ? now.getFullYear() : now.getFullYear() - 1;
    await Customer(vnistDB).create({
      owner: [users[(i % 3) + 5]._id],
      customerStatus: [customerStatuss[i % 5]._id],
      point: 0,
      isDeleted: false,
      code: listCustomer[i].code,
      name: listCustomer[i].name,
      customerType: listCustomer[i].customerType,
      customerGroup: customerGroups[i % 4]._id,
      gender: listCustomer[i].gender,
      birthDate: listCustomer[i].birthDate,
      mobilephoneNumber: listCustomer[i].mobilephoneNumber,
      email: listCustomer[i].email,
      address: listCustomer[i].address,
      telephoneNumber: listCustomer[i].telephoneNumber,
      taxNumber: 'Tax 123456789',
      location: 1,
      customerSource: listCustomer[i].customerSource,
      statusHistories: [
        {
          createdAt: new Date(),
          oldValue: customerStatuss[1]._id,
          newValue: customerStatuss[1]._id,
          createdBy: users[(i % 3) + 5]._id,
          description: 'Khách hàng được khởi tạo',
        },
        {
          oldValue: customerStatuss[1]._id,
          newValue: customerStatuss[i % 5]._id,
          createdAt: new Date(),
          createdBy: users[(i % 3) + 5]._id,
          description: 'Khách hàng đã được chuyển trạng thái',
        },
      ],
      creator: users[(i % 3) + 5]._id,
      rankPoints: [
        {
          point: Math.floor(Math.random() * 9876),
          expirationDate: new Date(year, 12),
        },
        {
          point: Math.floor(Math.random() * 98),
          expirationDate: new Date(year, 12),
        },
      ],
      files: [],
      promotions: [],
      createdAt: new Date(year, month),
      updatedAt: new Date(),
      __v: 0,
      address2: '',
      company: '',
      companyEstablishmentDate: null,
      email2: '',
      linkedIn: '',
      note: '',
      represent: '',
      website: '',
      customerCareUnit: customerCareUnits[0]._id,
    });
    console.log(`Tạo dữ liệu khách hàng thứ ${i + 1}/${listCustomer.length}`);
  }

  console.log('Xong! Đã tạo mẫu dữ liệu khách hàng');

  // ****************** Tạo mẫu dữ liệu chăm sóc khách hàng********************
  const getRamdomCareName = () => {
    const first = ['Gọi điện', 'Email', 'Gặp mặt'];
    const middle = ['tư vấn', 'phản hồi khiếu nại', 'trả lời thắc mắc'];
    const last = ['về dịch vụ', 'về sản phẩm', 'về công ty'];
    const firstIndex = Math.floor(Math.random() * 3);
    const middleIndex = Math.floor(Math.random() * 3);
    const lastIndex = Math.floor(Math.random() * 3);
    return `${first[firstIndex]} ${middle[middleIndex]} ${last[lastIndex]}`;
  };
  let customerCareData = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 50; j++) {
      const careName = await getRamdomCareName();
      const now = new Date();
      const month = now.getMonth() - i > 0 ? now.getMonth() - i : now.getMonth() - i + 12;
      const year = now.getMonth() - i > 0 ? now.getFullYear() : now.getFullYear() - 1;
      let care = {
        customerCareStaffs: [users[(j % 3) + 5]._id],
        customerCareTypes: [customerCareTypes[j % 3]._id],
        status: (j % 5) + 1,
        name: careName,
        description: `<p>${careName} </p>`,
        priority: 2,
        startDate: new Date(year, month, 5),
        endDate: new Date(year, month, 25),
        customer: listCustomers[j % 10]._id,
        creator: users[(j % 3) + 5]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        customerCareUnit: customerCareUnits[0]._id,
        __v: 0,
      };
      if ((j % 5) + 1 == 3 || (j % 5) + 1 == 5)
        care = {
          ...care,
          evaluation: {
            point: 8.9,
            comment: '<p>khách hàng không có nhận xét về phản hồi</p>',
            result: Math.floor(Math.random() * 2) + 1,
          },
        };
      customerCareData = [...customerCareData, care];
    }
  }

  await CustomerCare(vnistDB).insertMany(customerCareData);
  console.log('Xong! Đã tạo mẫu dữ liệu  chăm sóc khách hàng');

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU THÔNG TIN THUẾ
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo dữ liệu thông tin thuế');
  var listTaxs = await Tax(vnistDB).insertMany([
    {
      name: 'VAT',
      code: 'TAX_2011112342',
      description: 'Thuế giá trị gia tăng',
      creator: users[1]._id,
      goods: [
        {
          good: listProduct[0]._id,
          percent: 5,
        },
        {
          good: listProduct[1]._id,
          percent: 10,
        },
        {
          good: listProduct[2]._id,
          percent: 10,
        },
      ],
      status: true,
      lastVersion: true,
      version: 1,
    },
  ]);
  console.log('Khởi tạo xong danh sách thông tin thuế');

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU THÔNG TIN CAM KẾT CHẤT LƯỢNG
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu thông tin cam kết chất lượng');
  var listServiceLevelAgreements = await ServiceLevelAgreement(
    vnistDB
  ).insertMany([
    {
      title: 'Chất lượng sản phẩm đi đầu',
      code: 'SLA_201124144445',
      descriptions: [
        'Sản phẩm đi đầu về chất lượng',
        'Đóng gói đúng quy trình',
      ],
      creator: users[1]._id,
      goods: [listProduct[0]._id, listProduct[1]._id, listProduct[2]._id],
      status: true,
      lastVersion: true,
      version: 1,
    },
    {
      title: 'Quy cách về hàng hóa',
      code: 'SLA_20111219136',
      descriptions: [
        'Sản phẩm đạt tiêu chuẩn an toàn',
        'Sản phẩm được đóng gói theo tiêu chuẩn quốc tế',
      ],
      creator: users[1]._id,
      goods: [listProduct[0]._id, listProduct[1]._id],
      status: true,
      lastVersion: true,
      version: 1,
    },
  ]);
  console.log('Khởi tạo xong danh sách thông tin cam kết chất lượng');

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU THÔNG TIN KHUYẾN MÃI
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo dữ liệu thông tin khuyến mãi');
  var listDistcounts = await Discount(vnistDB).insertMany([
    {
      code: 'DIS_20111384718',
      name: 'Tặng 2 bao ACID CITRIC MONO với đơn hàng trên 1 triệu đồng',
      description: '',
      effectiveDate: null,
      expirationDate: null,
      type: 0,
      creator: users[1]._id,
      formality: '4',
      discounts: [
        {
          minimumThresholdToBeApplied: 1000000,
          customerType: 2,
          bonusGoods: [
            {
              good: listProduct[1],
              quantityOfBonusGood: 2,
            },
          ],
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_20111384718',
      name: 'Tặng 3 gói TIFFY Khi mua từ 10 thùng Đường ACESULFAME K',
      description: '',
      effectiveDate: null,
      expirationDate: null,
      type: 1,
      creator: users[1]._id,
      formality: '4',
      discounts: [
        {
          minimumThresholdToBeApplied: 10,
          customerType: 2,
          bonusGoods: [
            {
              good: listProduct[2],
              quantityOfBonusGood: 3,
            },
          ],
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_20112095557',
      name: 'giảm giá 10% khi mua 10 sản phẩm',
      description: '',
      effectiveDate: null,
      expirationDate: null,
      type: 1,
      creator: users[1]._id,
      formality: '1',
      discounts: [
        {
          discountedPercentage: 10,
          minimumThresholdToBeApplied: 10,
          customerType: 0,
          discountOnGoods: [
            {
              good: listProduct[0]._id,
            },
            {
              good: listProduct[1]._id,
            },
            {
              good: listProduct[2]._id,
            },
          ],
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_2011209559',
      name: 'giảm 10k khi mua từ 10 sản phẩm',
      description: '',
      effectiveDate: null,
      expirationDate: null,
      type: 1,
      creator: users[1]._id,
      formality: '0',
      discounts: [
        {
          discountedCash: 10000,
          minimumThresholdToBeApplied: 10,
          customerType: 2,
          discountOnGoods: [
            {
              good: listProduct[0]._id,
            },
            {
              good: listProduct[1]._id,
            },
            {
              good: listProduct[2]._id,
            },
          ],
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },

    {
      code: 'DIS_20111382649',
      name: 'Tồn kho',
      description: '',
      effectiveDate: '2020-11-16T00:00:00.000Z',
      expirationDate: '2021-01-29T00:00:00.000Z',
      type: 1,
      creator: users[1]._id,
      formality: '5',
      discounts: [
        {
          minimumThresholdToBeApplied: 10,
          maximumThresholdToBeApplied: 15,
          customerType: 2,
          bonusGoods: [],
          discountOnGoods: [
            {
              good: listProduct[0],
              discountedPrice: 60000,
            },
            {
              good: listProduct[0],
              discountedPrice: 65000,
            },
            {
              good: listProduct[0],
              discountedPrice: 69000,
            },
          ],
        },
        {
          minimumThresholdToBeApplied: 16,
          customerType: 2,
          bonusGoods: [],
          discountOnGoods: [
            {
              good: listProduct[0],
              discountedPrice: 50000,
            },
            {
              good: listProduct[0],
              discountedPrice: 55000,
            },
            {
              good: listProduct[0],
              discountedPrice: 65000,
            },
          ],
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_20121163953',
      name: 'Miễn phí vận chuyển đơn hàng từ 0 đồng',
      description: '',
      effectiveDate: null,
      expirationDate: null,
      type: 0,
      creator: users[1]._id,
      formality: '3',
      discounts: [
        {
          maximumFreeShippingCost: 20000,
          minimumThresholdToBeApplied: 0,
          customerType: 2,
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_2012120451',
      name: 'giảm 10% cho đơn hàng từ 100000',
      description: 'Chưa có mô tả',
      effectiveDate: null,
      expirationDate: null,
      type: 0,
      creator: users[1]._id,
      formality: '1',
      discounts: [
        {
          discountedPercentage: 10,
          minimumThresholdToBeApplied: 100000,
          customerType: 2,
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_2012275644',
      name: 'Tặng 1000 xu cho đơn hàng từ 30k',
      description: '',
      effectiveDate: '2020-12-01T00:00:00.000Z',
      expirationDate: '2020-12-31T00:00:00.000Z',
      type: 0,
      creator: users[1]._id,
      formality: '2',
      discounts: [
        {
          loyaltyCoin: 1000,
          minimumThresholdToBeApplied: 30000,
          customerType: 2,
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
    {
      code: 'DIS_20123142627',
      name: 'Tặng xu 1000 xu khi mua 10 sản phẩm',
      description: '',
      effectiveDate: '2020-12-01T00:00:00.000Z',
      expirationDate: '2020-12-26T00:00:00.000Z',
      type: 1,
      creator: users[1]._id,
      formality: '2',
      discounts: [
        {
          loyaltyCoin: 1000,
          minimumThresholdToBeApplied: 10,
          customerType: 2,
          discountOnGoods: [
            {
              good: listProduct[0]._id,
            },
            {
              good: listProduct[1]._id,
            },
            {
              good: listProduct[2]._id,
            },
          ],
        },
      ],
      version: 1,
      status: true,
      lastVersion: true,
    },
  ]);
  console.log('Khởi tạo xong danh sách thông tin khuyến mãi');

  /*---------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------
   TẠO DỮ LIỆU CẤU HÌNH ĐƠN VỊ KINH DOANH
  -----------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo dữ liệu cấu hình đơn vị kinh doanh');
  var listBusinessDepartments = await BusinessDepartment(vnistDB).insertMany([
    {},
  ]);
  console.log('Khởi tạo xong cấu hình đơn vị kinh doanh');

  console.log('Khởi tạo dữ liệu đơn bán hàng');
  const BATCH_SIZE = 10; // Số lượng bản ghi trong mỗi lô
  const CONCURRENCY_LIMIT = 5; // Số lượng kết nối song song
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  async function insertSalesOrdersInBatches(saleOrders, newProducts, listMarketing) {
    let listSales = [];
    let batchPromises = [];
    let products_in_stock = await Good(vnistDB).find({});
    for (let i = 0; i < 100; i++) {
      let salesOrder = saleOrders[i];
      let product = products_in_stock.find((product) => product.code === String(salesOrder.product_id));
      let marketingCampaign = listMarketing.find((marketing) => marketing.code == salesOrder.campaign_id);

      let customer = getRandomElement(listCustomers);
      let user = getRandomElement(users);
      let newSaleOrder = {
        code: salesOrder.code,
        status: salesOrder.status,
        creator: user._id,
        customer: customer._id,
        customerName: customer.name,
        customerPhone: customer.mobilephoneNumber,
        customerAddress: customer.address,
        customerRepresent: customer.represent,
        customerTaxNumber: customer.taxNumber,
        customerEmail: customer.email,
        approvers: [
          {
            approver: users[1]._id,
            status: 2,
          },
        ],
        priority: 1,
        goods: [
          {
            good: product._id,
            pricePerBaseUnit: salesOrder.price,
            quantity: salesOrder.orders,
            productionCost: salesOrder.purchase_price,
            pricePerBaseUnitOrigin: product.pricePerBaseUnit,
            salesPriceVariance: product.salesPriceVariance,
            serviceLevelAgreements: [
              {
                descriptions: [
                  'Đóng gói đúng quy trình',
                  'Sản phẩm đi đầu về chất lượng',
                ],
                _id: listServiceLevelAgreements[0]._id,
                title: 'Chất lượng sản phẩm đi đầu',
              },
            ],
            taxs: [
              {
                _id: listTaxs[0]._id,
                code: listTaxs[0]._id,
                name: 'VAT',
                description: listTaxs[0]._id,
                percent: 5,
              },
            ],
            amount: salesOrder.price,
            amountAfterDiscount: salesOrder.price,
            amountAfterTax: (salesOrder.price * 11) / 10,
          },
        ],
        discounts: [
          {
            _id: listDistcounts[5]._id,
            code: listDistcounts[5].code,
            type: listDistcounts[5].type,
            formality: listDistcounts[5].formality,
            name: listDistcounts[5].name,
            effectiveDate: listDistcounts[5].effectiveDate,
            expirationDate: listDistcounts[5].expirationDate,
            maximumFreeShippingCost: 20000,
          },
          {
            _id: listDistcounts[6]._id,
            code: listDistcounts[6].code,
            type: listDistcounts[6].type,
            formality: listDistcounts[6].formality,
            name: listDistcounts[6].name,
            effectiveDate: listDistcounts[6].effectiveDate,
            expirationDate: listDistcounts[6].expirationDate,
            discountedPercentage: 10,
          },
          {
            _id: listDistcounts[7]._id,
            code: listDistcounts[7].code,
            type: listDistcounts[7].type,
            formality: listDistcounts[7].formality,
            name: listDistcounts[7].name,
            effectiveDate: listDistcounts[7].effectiveDate,
            expirationDate: listDistcounts[7].expirationDate,
            loyaltyCoin: 1000,
          },
        ],
        shippingFee: 10000,
        deliveryTime: salesOrder.date,
        coin: 500,
        paymentAmount: (salesOrder.price * salesOrder.orders * 11) / 10 + 10000,
        note: 'Khách hàng quen thuộc',
        marketingCampaign: marketingCampaign._id,
      };

      listSales.push(newSaleOrder);

      // Khi đạt đến BATCH_SIZE hoặc khi đến bản ghi cuối cùng
      if (listSales.length === BATCH_SIZE || i === saleOrders.length - 1) {
        console.log(`Adding batch of size: ${listSales.length}`);
        batchPromises.push(insertBatch(listSales));
        listSales = []; // Reset danh sách cho lô tiếp theo

        // Nếu đạt đến giới hạn kết nối song song, chờ cho các kết nối hoàn thành
        if (batchPromises.length >= CONCURRENCY_LIMIT) {
          console.log('Waiting for batch promises to resolve');
          await Promise.all(batchPromises);
          batchPromises = [];
        }
      }
    }

    // Chờ tất cả các batch còn lại hoàn thành
    await Promise.all(batchPromises);
    console.log('All data inserted');
  }

  async function insertBatch(batch) {
    try {
      console.log('Inserting batch:', batch);
      await SalesOrder(vnistDB).insertMany(batch);
      console.log('Inserted batch of size:', batch.length);
    } catch (error) {
      console.error('Error inserting batch:', error);
    }
  }

  // Gọi hàm chính để chèn dữ liệu
  insertSalesOrdersInBatches(saleOrders, newProducts, listMarketing)
    .then(() => {
      console.log('All data inserted');
    })
    .catch((err) => {
      console.error('Error inserting data:', err);
    });

  /*---------------------------------------------------------------------------------------------
         -----------------------------------------------------------------------------------------------
             TẠO DỮ LIỆU THÔNG TIN BÁO GIÁ
         -----------------------------------------------------------------------------------------------
         ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo dữ liệu thông tin báo giá');
  var listQuote = await Quote(vnistDB).insertMany([
    {
      status: 1,
      code: 'QUOTE_201249330',
      creator: users[1]._id,
      effectiveDate: '2020-12-07T00:00:00.000Z',
      expirationDate: '2020-12-19T00:00:00.000Z',
      customer: listCustomers[0]._id,
      customerName: listCustomers[0].name,
      customerPhone: listCustomers[0].mobilephoneNumber,
      customerAddress: listCustomers[0].address,
      customerRepresent: listCustomers[0].represent,
      customerTaxNumber: listCustomers[0].taxNumber,
      customerEmail: listCustomers[0].email,
      goods: [
        {
          good: listProduct[0]._id,
          pricePerBaseUnit: 60000,
          pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
          salesPriceVariance: listProduct[0].salesPriceVariance,
          quantity: 12,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          discounts: [],
          amount: 720000,
          amountAfterDiscount: 720000,
          amountAfterTax: 792000,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 100000,
      deliveryTime: '2020-12-18T00:00:00.000Z',
      coin: 500,
      paymentAmount: 871500,
      note: 'Khách hàng quen thuộc',
    },
    {
      status: 1,
      code: 'QUOTE_201249331',
      creator: users[1]._id,
      effectiveDate: '2021-01-07T00:00:00.000Z',
      expirationDate: '2020-01-19T00:00:00.000Z',
      customer: listCustomers[1]._id,
      customerName: listCustomers[1].name,
      customerPhone: listCustomers[1].mobilephoneNumber,
      customerAddress: listCustomers[1].address,
      customerRepresent: listCustomers[1].represent,
      customerTaxNumber: listCustomers[1].taxNumber,
      customerEmail: listCustomers[1].email,
      goods: [
        {
          good: listProduct[0]._id,
          pricePerBaseUnit: 60000,
          pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
          salesPriceVariance: listProduct[0].salesPriceVariance,
          quantity: 12,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          discounts: [],
          amount: 720000,
          amountAfterDiscount: 720000,
          amountAfterTax: 792000,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 100000,
      deliveryTime: '2020-12-18T00:00:00.000Z',
      coin: 500,
      paymentAmount: 871500,
      note: 'Khách hàng quen thuộc',
    },
    {
      status: 1,
      code: 'QUOTE_201249333',
      creator: users[1]._id,
      effectiveDate: '2020-11-05T00:00:00.000Z',
      expirationDate: '2020-12-20T00:00:00.000Z',
      customer: listCustomers[0]._id,
      customerName: listCustomers[0].name,
      customerPhone: listCustomers[0].mobilephoneNumber,
      customerAddress: listCustomers[0].address,
      customerRepresent: listCustomers[0].represent,
      customerTaxNumber: listCustomers[0].taxNumber,
      customerEmail: listCustomers[0].email,
      goods: [
        {
          good: listProduct[0]._id,
          pricePerBaseUnit: 60000,
          pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
          salesPriceVariance: listProduct[0].salesPriceVariance,
          quantity: 12,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          discounts: [],
          amount: 720000,
          amountAfterDiscount: 720000,
          amountAfterTax: 792000,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 100000,
      deliveryTime: '2020-12-18T00:00:00.000Z',
      coin: 500,
      paymentAmount: 871500,
      note: 'Khách hàng quen thuộc',
    },
    {
      status: 1,
      code: 'QUOTE_201249334',
      creator: users[1]._id,
      effectiveDate: '2020-12-04T00:00:00.000Z',
      expirationDate: '2020-12-22T00:00:00.000Z',
      customer: listCustomers[1]._id,
      customerName: listCustomers[1].name,
      customerPhone: listCustomers[1].mobilephoneNumber,
      customerAddress: listCustomers[1].address,
      customerRepresent: listCustomers[1].represent,
      customerTaxNumber: listCustomers[1].taxNumber,
      customerEmail: listCustomers[1].email,
      goods: [
        {
          good: listProduct[0]._id,
          pricePerBaseUnit: 60000,
          pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
          salesPriceVariance: listProduct[0].salesPriceVariance,
          quantity: 12,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          discounts: [],
          amount: 720000,
          amountAfterDiscount: 720000,
          amountAfterTax: 792000,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 100000,
      deliveryTime: '2020-12-18T00:00:00.000Z',
      coin: 500,
      paymentAmount: 871500,
      note: 'Khách hàng quen thuộc',
    },
    {
      status: 2,
      code: 'QUOTE_201249335',
      creator: users[1]._id,
      effectiveDate: '2020-12-01T00:00:00.000Z',
      expirationDate: '2020-12-28T00:00:00.000Z',
      customer: listCustomers[0]._id,
      customerName: listCustomers[0].name,
      customerPhone: listCustomers[0].mobilephoneNumber,
      customerAddress: listCustomers[0].address,
      customerRepresent: listCustomers[0].represent,
      customerTaxNumber: listCustomers[0].taxNumber,
      customerEmail: listCustomers[0].email,
      goods: [
        {
          good: listProduct[0]._id,
          pricePerBaseUnit: 60000,
          pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
          salesPriceVariance: listProduct[0].salesPriceVariance,
          quantity: 12,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          discounts: [],
          amount: 720000,
          amountAfterDiscount: 720000,
          amountAfterTax: 792000,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 100000,
      deliveryTime: '2020-12-18T00:00:00.000Z',
      coin: 500,
      paymentAmount: 871500,
      note: 'Khách hàng quen thuộc',
    },
    {
      status: 2,
      code: 'QUOTE_201249330',
      creator: users[1]._id,
      effectiveDate: '2020-12-07T00:00:00.000Z',
      expirationDate: '2020-12-19T00:00:00.000Z',
      customer: listCustomers[0]._id,
      customerName: listCustomers[0].name,
      customerPhone: listCustomers[0].mobilephoneNumber,
      customerAddress: listCustomers[0].address,
      customerRepresent: listCustomers[0].represent,
      customerTaxNumber: listCustomers[0].taxNumber,
      customerEmail: listCustomers[0].email,
      goods: [
        {
          good: listProduct[0]._id,
          pricePerBaseUnit: 60000,
          pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
          salesPriceVariance: listProduct[0].salesPriceVariance,
          quantity: 12,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          discounts: [],
          amount: 720000,
          amountAfterDiscount: 720000,
          amountAfterTax: 792000,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 100000,
      deliveryTime: '2020-12-18T00:00:00.000Z',
      coin: 500,
      paymentAmount: 871500,
      note: 'Khách hàng quen thuộc',
    },
  ]);
  console.log('Khởi tạo xong danh sách thông tin báo giá');

  //------------------------- Dữ liệu vận chuyển -------------------------------------//

  const transportGetNextNDates = (n) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + n);
    return new Date(currentDate);
  };

  const newTransportAssetVehicle = await Asset(vnistDB).insertMany([
    {
      assetType: [listAssetType[23]._id],
      readByRoles: [vcTruongPhong._id],
      cost: 0,
      usefulLife: 0,
      startDepreciation: null,
      residualValue: null,
      company: vnist._id,
      avatar: '',
      assetName: 'Xe tải 1 ',
      code: 'VVTM20210603.182181',
      serial: '123',
      group: 'vehicle',
      purchaseDate: new Date().toISOString(),
      warrantyExpirationDate: transportGetNextNDates(100).toISOString(),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      location: null,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: '',
      detailInfo: [
        {
          nameField: 'volume',
          value: '16',
        },
        {
          nameField: 'payload',
          value: '3000',
        },
      ],
      depreciationType: 'none',
      maintainanceLogs: [],
      usageLogs: [],
      incidentLogs: [],
      locationLogs: [],
      disposalDate: null,
      disposalType: '',
      disposalCost: null,
      disposalDesc: '',
      documents: [],
      unitsProducedDuringTheYears: [],
      informations: [],
    },
    {
      assetType: [listAssetType[23]._id],
      readByRoles: [vcTruongPhong._id],
      cost: 0,
      usefulLife: 0,
      startDepreciation: null,
      residualValue: null,
      company: vnist._id,
      avatar: '',
      assetName: 'Xe tải 2 ',
      code: 'VVTM20210603.182182',
      serial: '1234',
      group: 'vehicle',
      purchaseDate: new Date().toISOString(),
      warrantyExpirationDate: transportGetNextNDates(101).toISOString(),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      location: null,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: '',
      detailInfo: [
        {
          nameField: 'volume',
          value: '20',
        },
        {
          nameField: 'payload',
          value: '2000',
        },
      ],
      depreciationType: 'none',
      maintainanceLogs: [],
      usageLogs: [],
      incidentLogs: [],
      locationLogs: [],
      disposalDate: null,
      disposalType: '',
      disposalCost: null,
      disposalDesc: '',
      documents: [],
      unitsProducedDuringTheYears: [],
      informations: [],
    },
    {
      assetType: [listAssetType[23]._id],
      readByRoles: [vcTruongPhong._id],
      cost: 0,
      usefulLife: 0,
      startDepreciation: null,
      residualValue: null,
      company: vnist._id,
      avatar: '',
      assetName: 'Xe tải 3 ',
      code: 'VVTM20210603.182183',
      serial: '1235',
      group: 'vehicle',
      purchaseDate: new Date().toISOString(),
      warrantyExpirationDate: transportGetNextNDates(100).toISOString(),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      location: null,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: '',
      detailInfo: [
        {
          nameField: 'volume',
          value: '16',
        },
        {
          nameField: 'payload',
          value: '3000',
        },
      ],
      depreciationType: 'none',
      maintainanceLogs: [],
      usageLogs: [],
      incidentLogs: [],
      locationLogs: [],
      disposalDate: null,
      disposalType: '',
      disposalCost: null,
      disposalDesc: '',
      documents: [],
      unitsProducedDuringTheYears: [],
      informations: [],
    },
    {
      assetType: [listAssetType[23]._id],
      readByRoles: [vcTruongPhong._id],
      cost: 0,
      usefulLife: 0,
      startDepreciation: null,
      residualValue: null,
      company: vnist._id,
      avatar: '',
      assetName: 'Xe tải 4 ',
      code: 'VVTM20210603.189184',
      serial: '12445',
      group: 'vehicle',
      purchaseDate: new Date().toISOString(),
      warrantyExpirationDate: transportGetNextNDates(100).toISOString(),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      location: null,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: '',
      detailInfo: [
        {
          nameField: 'volume',
          value: '16',
        },
        {
          nameField: 'payload',
          value: '3000',
        },
      ],
      depreciationType: 'none',
      maintainanceLogs: [],
      usageLogs: [],
      incidentLogs: [],
      locationLogs: [],
      disposalDate: null,
      disposalType: '',
      disposalCost: null,
      disposalDesc: '',
      documents: [],
      unitsProducedDuringTheYears: [],
      informations: [],
    },
    {
      assetType: [listAssetType[23]._id],
      readByRoles: [vcTruongPhong._id],
      cost: 0,
      usefulLife: 0,
      startDepreciation: null,
      residualValue: null,
      company: vnist._id,
      avatar: '',
      assetName: 'Xe tải 5 ',
      code: 'VVTM20220603.189185',
      serial: '12425',
      group: 'vehicle',
      purchaseDate: new Date().toISOString(),
      warrantyExpirationDate: transportGetNextNDates(100).toISOString(),
      managedBy: users[1]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      location: null,
      status: 'ready_to_use',
      typeRegisterForUse: 3,
      description: '',
      detailInfo: [
        {
          nameField: 'volume',
          value: '16',
        },
        {
          nameField: 'payload',
          value: '3000',
        },
      ],
      depreciationType: 'none',
      maintainanceLogs: [],
      usageLogs: [],
      incidentLogs: [],
      locationLogs: [],
      disposalDate: null,
      disposalType: '',
      disposalCost: null,
      disposalDesc: '',
      documents: [],
      unitsProducedDuringTheYears: [],
      informations: [],
    },
  ]);

  const transportDepartment = await TransportDepartment(vnistDB).insertMany([
    {
      organizationalUnit: phongVanChuyen._id,
      type: [
        {
          roleOrganizationalUnit: vcTruongPhong._id,
          roleTransport: 1,
        },
        {
          roleOrganizationalUnit: vcNvGiamSat._id,
          roleTransport: 2,
        },
        {
          roleOrganizationalUnit: vcNvVanChuyen._id,
          roleTransport: 3,
        },
      ],
    },
  ]);

  const transportVehicle = await TransportVehicle(vnistDB).insertMany([
    {
      asset: newTransportAssetVehicle[0]._id,
      code: newTransportAssetVehicle[0].code,
      name: newTransportAssetVehicle[0].assetName,
      payload: 3000,
      volume: 16,
      usable: 1,
      department: transportDepartment[0]._id,
    },
    {
      asset: newTransportAssetVehicle[1]._id,
      code: newTransportAssetVehicle[1].code,
      name: newTransportAssetVehicle[1].assetName,
      payload: 2000,
      volume: 20,
      usable: 1,
      department: transportDepartment[0]._id,
    },
  ]);

  const transportRequirement = await TransportRequirement(vnistDB).insertMany([
    {
      //0
      geocode: {
        fromAddress: {
          lat: 21.1256643,
          lng: 105.4758682,
        },
        toAddress: {
          lat: 20.6639930000001,
          lng: 105.787069,
        },
      },
      status: 3,
      code: 'YCVC20210602.244971',
      type: 5,
      creator: users[7]._id,
      fromAddress: 'Sơn tây hà nội',
      toAddress: 'thanh oai hà nội',
      goods: [
        {
          good: listGood[2]._id,
          quantity: 10,
          volume: 2,
          payload: 10,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(5).toISOString(),
          description: '',
        },
      ],
      volume: 2,
      payload: 10,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
    {
      //1
      geocode: {
        fromAddress: {
          lat: 11.20385642,
          lng: 107.356440853,
        },
        toAddress: {
          lat: 11.3130384470001,
          lng: 106.024041001,
        },
      },
      status: 1,
      code: 'YCVC20210602.224869',
      type: 5,
      creator: users[6]._id,
      fromAddress: 'định quán đồng nai',
      toAddress: 'châu thành tây ninh',
      goods: [
        {
          good: listGood[1]._id,
          quantity: 10,
          volume: 2,
          payload: 10,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(6),
          description: '',
        },
      ],
      volume: 2,
      payload: 10,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
    {
      //2
      geocode: {
        fromAddress: {
          lat: 20.9991964035554,
          lng: 105.845662549979,
        },
        toAddress: {
          lat: 20.988961633,
          lng: 105.628865767,
        },
      },
      status: 3,
      code: 'YCVC20210602.185942',
      type: 5,
      creator: users[8]._id,
      fromAddress: 'Trần đại nghĩa hai bà trưng hà nội',
      toAddress: 'ngọc mỹ quốc oai hà nội',
      goods: [
        {
          good: listGood[3]._id,
          quantity: 10,
          volume: 3,
          payload: 20,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(7),
          description: '',
        },
      ],
      volume: 3,
      payload: 20,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
    {
      //3
      geocode: {
        fromAddress: {
          lat: 21.0077937,
          lng: 105.84602459,
        },
        toAddress: {
          lat: 21.005383514547,
          lng: 105.93770476731,
        },
      },
      status: 1,
      code: 'YCVC20210602.141576',
      type: 5,
      creator: users[7]._id,
      fromAddress: 'vĩnh phú hai bà trưng hà nội',
      toAddress: 'trâu quỳ gia lâm hà nội',
      goods: [
        {
          good: listGood[3]._id,
          quantity: 15,
          volume: 5,
          payload: 25,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(14).toISOString(),
          description: '',
        },
      ],
      volume: 5,
      payload: 25,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
    {
      //4
      geocode: {
        fromAddress: {
          lat: 21.032005984,
          lng: 105.909988812,
        },
        toAddress: {
          lat: 20.984650683,
          lng: 105.842763967,
        },
      },
      status: 1,
      code: 'YCVC20210602.257818',
      type: 5,
      creator: users[7]._id,
      fromAddress: 'long biên hà nội',
      toAddress: 'kim đồng giáp bát hà nội',
      goods: [
        {
          good: listGood[3]._id,
          quantity: 10,
          volume: 100,
          payload: 100,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(4).toISOString(),
          description: '',
        },
      ],
      volume: 100,
      payload: 100,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
    {
      //5
      geocode: {
        fromAddress: {
          lat: 20.9830403964559,
          lng: 105.73100465623,
        },
        toAddress: {
          lat: 20.997942715,
          lng: 105.816376617,
        },
      },
      status: 1,
      code: 'YCVC20210602.257918',
      type: 5,
      creator: users[7]._id,
      fromAddress: 'la phù hoài đức hà nội',
      toAddress: 'thanh xuân hà nội',
      goods: [
        {
          good: listGood[3]._id,
          quantity: 10,
          volume: 6,
          payload: 40,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(4).toISOString(),
          description: '',
        },
      ],
      volume: 6,
      payload: 40,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
    {
      //6
      geocode: {
        fromAddress: {
          lat: 20.9826710470001,
          lng: 105.825478283,
        },
        toAddress: {
          lat: 21.0874567001676,
          lng: 105.661148675343,
        },
      },
      status: 1,
      code: 'YCVC20210602.181053',
      type: 5,
      creator: users[7]._id,
      fromAddress: 'hoàng mai hà nội',
      toAddress: 'nguyễn thái học hà nội',
      goods: [
        {
          good: listGood[3]._id,
          quantity: 10,
          volume: 4,
          payload: 30,
        },
      ],
      timeRequests: [
        {
          timeRequest: transportGetNextNDates(8).toISOString(),
          description: '',
        },
      ],
      volume: 4,
      payload: 30,
      approver: users[2]._id,
      department: transportDepartment[0]._id,
    },
  ]);

  const transportPlan = await TransportPlan(vnistDB).insertMany([
    {
      transportRequirements: [
        transportRequirement[0]._id,
        transportRequirement[2]._id,
      ],
      code: 'KHVC20210603.237299',
      supervisor: users[3]._id,
      creator: users[2]._id,
      name: 'Kế hoạch vận chuyển seed',
      status: 2,
      startTime: transportGetNextNDates(4),
      endTime: transportGetNextNDates(4),
      transportVehicles: [
        {
          vehicle: transportVehicle[0]._id,
          carriers: [
            {
              carrier: users[4]._id,
              pos: 1,
            },
            {
              carrier: users[5]._id,
            },
          ],
        },
        {
          vehicle: transportVehicle[1]._id,
          carriers: [
            {
              carrier: users[6]._id,
              pos: 1,
            },
          ],
        },
      ],
      department: transportDepartment[0]._id,
    },
  ]);
  await TransportRequirement(vnistDB).updateOne({ _id: transportRequirement[0]._id }, { $set: { transportPlan: transportPlan[0]._id } });
  await TransportRequirement(vnistDB).updateOne({ _id: transportRequirement[2]._id }, { $set: { transportPlan: transportPlan[0]._id } });

  const transportSchedule = await TransportSchedule(vnistDB).insertMany([
    {
      transportPlan: transportPlan[0]._id,
      route: [
        {
          transportVehicle: transportVehicle[1]._id,
          routeOrdinal: [
            {
              transportRequirement: transportRequirement[2]._id,
              type: 1,
              distance: 0,
              duration: 0,
            },
            {
              transportRequirement: transportRequirement[2]._id,
              type: 2,
              distance: 26,
              duration: 61,
            },
          ],
        },
        {
          transportVehicle: transportVehicle[0]._id,
          routeOrdinal: [
            {
              transportRequirement: transportRequirement[0]._id,
              type: 1,
              distance: 0,
              duration: 0,
            },
            {
              transportRequirement: transportRequirement[0]._id,
              type: 2,
              distance: 75,
              duration: 174,
            },
          ],
        },
      ],
      transportVehicles: [
        {
          transportRequirements: [transportRequirement[0]._id],
          transportVehicle: transportVehicle[0]._id,
        },
        {
          transportRequirements: [transportRequirement[2]._id],
          transportVehicle: transportVehicle[1]._id,
        },
      ],
    },
  ]);

  console.log('Khởi tạo xong dữ liệu vận chuyển');

  // /*---------------------------------------------------------------------------------------------
  //     -----------------------------------------------------------------------------------------------
  //         TẠO DỮ LIỆU CẤU HÌNH GIẢI THUẬT CHO GIẢI THUẬT PHÂN BỔ KPI
  //     -----------------------------------------------------------------------------------------------
  //     ----------------------------------------------------------------------------------------------- */
  // console.log('Khởi tạo cấu hình giải thuật cho giải thuật phân bổ KPI');

  // await AllocationConfigSetting(vnistDB).create({
  //   company: vnist._id,
  //   numberGeneration: 200,
  //   solutionSize: 50,
  //   isAutomatically: true,
  //   defaultSetting: {
  //     numberGeneration: 200,
  //     solutionSize: 50,
  //     isAutomatically: true,
  //   },
  // });

  // console.log('Khởi tạo xong cấu hình giải thuật cho giải thuật phân bổ KPI');

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU QUẢN LÝ YÊU CẦU VẬN CHUYỂN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo quản lý yêu cầu vận chuyển');

  await ProductRequestManagement(vnistDB).create({
    code: 'GHA123',
    creator: [new ObjectId('664b013089db9c86025cef5c')],
    approvers: [
      {
        // Người phê duyệt
        information: [
          {
            approver: [new ObjectId('664b013089db9c86025cef5f')],
            approvedTime: new Date('2024-05-20T07:45:44.691Z'),
            note: '',
          },
        ],
        approveType: 3,
      },
    ],
    refuser: {
      // Người từ chối yêu cầu
      refuser: null,
      refuserTime: new Date('2024-05-20T07:45:44.691Z'),
      note: '',
    },

    goods: [
      {
        good: [new ObjectId('664b013289db9c86025cf62a')],
        quantity: 1,
        lots: [
          {
            lot: listLot[0]._id,
            quantity: 0,
            returnQuantity: 0,
            note: '',
          },
        ],
      },
    ],
    manufacturingWork: manufacturingWorks[0]._id,
    stock: [new ObjectId('664b013289db9c86025cf63b')],
    toStock: null,
    requestingDepartment: null,
    orderUnit: null,
    supplier: [new ObjectId('664b013289db9c86025cf6f6')],
    customer: new ObjectId('664b064a73be139a586b851d'),
    requestType: 1,
    type: 1,

    desiredTime: null,
    status: 1,
    description: '',
    purchaseOrder: null,
    saleOrder: null,
    bill: null,
  });

  console.log('Khởi tạo xong kế hoạch vận chuyển');

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU ĐƠN HÀNG
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu đơn van chuyen');
  const transport3Order = await Transport3Order(vnistDB).create(
    listTransport3Orders.map((order, index) => {
      return {
        code: order.code,
        customer: listCustomers[index]._id,
        customerPhone: listCustomers[index].mobilephoneNumber,
        address: order.address,
        lat: order.lat,
        lng: order.lng,
        deliveryTime: order.deliveryTime,
        note: order.note,
        noteAddress: order.noteAddress,
        priority: order.priority,
        status: order.status,
        transportType: order.transportType,
        goods: [
          {
            good: listGood[0]._id,
            code: "G01",
            goodName: listGood[0].name,
            baseUnit: null,
            quantity: 5,
          }
        ]
      }
    })
  )
  console.log('Khởi tạo xong dữ liệu đơn vận chuyển');

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU PHƯƠNG TIỆN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  let list_transport3Vehicle = await Asset(vnistDB).find({ group: 'vehicle' });
  for (let i = 0; i < list_transport3Vehicle.length; i++) {
    await Transport3Vehicle(vnistDB).insertMany([
      {
        code: list_transport3Vehicle[i].code,
        asset: list_transport3Vehicle[i]._id,
        // Trọng tải xe
        tonnage: 1000,
        // Thể tích thùng xe
        volume: 8.58,
        // Rộng, cao , sâu của thùng xe
        width: 1.65,
        height: 1.65,
        depth: 3.15,
        // Mức tiêu thụ nhiên liệu của xe/1km
        averageGasConsume: 0.06,
        // Trung bình chi phí vận chuyển của xe
        traverageFeeTransport: 800000,
        // Tốc độ tối thiểu
        minVelocity: 0,
        // Tốc độ tối đa
        maxVelocity: 80
      }])
  }
  console.log('Khởi tạo xong dữ liệu phương tiện');
  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KẾ HOẠCH VẬN CHUYỂN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  const transport3Vehicle = await Transport3Vehicle(vnistDB).find({});
  const listDepots = await Stock(vnistDB).find({});
  await Transport3Schedule(vnistDB).create(
    listTransport3Schedules.map((schedule, index) => {
      return {
        code: 'SC_20240621.132' + index,
        employee: null,
        status: 1,
        vehicle: transport3Vehicle[Math.floor(Math.random() * transport3Vehicle.length)]._id,
        depot: listDepots[Math.floor(Math.random() * listDepots.length)]._id,
        orders: [
          transport3Order[index]._id
        ]
      }
    })
  )
  console.log('Khởi tạo xong kế hoạch vận chuyển');

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU KẾ HOẠCH VẬN CHUYỂN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  //   console.log('Khởi tạo kế hoạch vận chuyển');

  //   await DeliverySchedule(vnistDB).create({
  //     code: 'Kế hoạch 01',
  //     carrierDate: new Date('2024-05-20T07:45:44.691Z'),
  //     orders: [new ObjectId('664b086a174b9b9ec20ec536') ],
  //     status: 3,
  //     shippers: [new ObjectId('664affa60f190284e84a640b')],
  //     estimatedDeliveryDate: new Date('2024-05-20T07:45:44.691Z'),
  //     actualDeliveryDate: new Date('2024-05-20T07:45:44.691Z'),
  //     estimatedOntime: 1
  //   })

  //   console.log('Khởi tạo xong kế hoạch vận chuyển');

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU ĐƠN BÁN HÀNG
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  // var listSalesOrder = await SalesOrder(vnistDB).insertMany([
  //     {
  //         code: "DA_20240608.236431",
  //         status: 3,
  //         creator: users[1]._id,
  //         customer: listCustomers[1]._id,
  //         customerName: listCustomers[1].name,
  //         customerPhone: listCustomers[1].mobilephoneNumber,
  //         customerAddress: listCustomers[1].address,
  //         customerRepresent: listCustomers[1].represent,
  //         customerTaxNumber: listCustomers[1].taxNumber,
  //         customerEmail: listCustomers[1].email,
  //         approvers: [{
  //             approver: users[1]._id,
  //             status: 2
  //         }],
  //         priority: 1,
  //         goods: [
  //             {
  //                 good: listProduct[0]._id,
  //                 pricePerBaseUnit: 60000,
  //                 pricePerBaseUnitOrigin: listProduct[0].pricePerBaseUnit,
  //                 salesPriceVariance: listProduct[0].salesPriceVariance,
  //                 quantity: 12,
  //                 serviceLevelAgreements: [
  //                     {
  //                         descriptions: [
  //                             "Đóng gói đúng quy trình",
  //                             "Sản phẩm đi đầu về chất lượng",
  //                         ],
  //                         _id: listServiceLevelAgreements[0]._id,
  //                         title: "Chất lượng sản phẩm đi đầu",
  //                     },
  //                 ],
  //                 taxs: [
  //                     {
  //                         _id: listTaxs[0]._id,
  //                         code: listTaxs[0]._id,
  //                         name: "VAT",
  //                         description: listTaxs[0]._id,
  //                         percent: 5,
  //                     },
  //                 ],
  //                 discounts: [],
  //                 amount: 720000,
  //                 amountAfterDiscount: 720000,
  //                 amountAfterTax: 792000,
  //             },
  //         ],
  //         discounts: [
  //             {
  //                 _id: listDistcounts[5]._id,
  //                 code: listDistcounts[5].code,
  //                 type: listDistcounts[5].type,
  //                 formality: listDistcounts[5].formality,
  //                 name: listDistcounts[5].name,
  //                 effectiveDate: listDistcounts[5].effectiveDate,
  //                 expirationDate: listDistcounts[5].expirationDate,
  //                 maximumFreeShippingCost: 20000,
  //             },
  //             {
  //                 _id: listDistcounts[6]._id,
  //                 code: listDistcounts[6].code,
  //                 type: listDistcounts[6].type,
  //                 formality: listDistcounts[6].formality,
  //                 name: listDistcounts[6].name,
  //                 effectiveDate: listDistcounts[6].effectiveDate,
  //                 expirationDate: listDistcounts[6].expirationDate,
  //                 discountedPercentage: 10,
  //             },
  //             {
  //                 _id: listDistcounts[7]._id,
  //                 code: listDistcounts[7].code,
  //                 type: listDistcounts[7].type,
  //                 formality: listDistcounts[7].formality,
  //                 name: listDistcounts[7].name,
  //                 effectiveDate: listDistcounts[7].effectiveDate,
  //                 expirationDate: listDistcounts[7].expirationDate,
  //                 loyaltyCoin: 1000,
  //             },
  //         ],
  //         shippingFee: 100000,
  //         deliveryTime: "2020-12-18T00:00:00.000Z",
  //         coin: 500,
  //         paymentAmount: 871500,
  //         note: "Khách hàng quen thuộc",

  //     },
  // ]);

  console.log('Khởi tạo xong danh sách đơn bán hàng');

  /*---------------------------------------------------------------------------------------------
   -----------------------------------------------------------------------------------------------
     TẠO DỮ LIỆU ĐƠN MUA NGUYÊN VẬT LIỆU
   -----------------------------------------------------------------------------------------------
   ----------------------------------------------------------------------------------------------- */

  // console.log("Khởi tạo dữ liệu đơn mua nguyên vật liệu");
  // var listPurchaseOrder = await PurchaseOrder(vnistDB).insertMany([
  //     {

  //     },

  // ]);
  // console.log("Khởi tạo xong danh sách đơn mua nguyên vật liệu");

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU THÔNG TIN THANH TOÁN ĐƠN MUA HÀNG, ĐƠN MUA NGUYÊN VẬT LIỆU
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */
  // console.log("Khởi tạo dữ liệu thông tin thanh toán đơn hàng, đơn mua nvl");
  // var listPurchaseOrders = await purchaseDate(vnistDB).insertMany([
  //     {

  //     },
  // ]);
  // console.log("Khởi tạo xong danh sách thông tin thanh toán đơn hàng, đơn mua nvl");

  /**
   * Ngắt kết nối db
   */

  systemDB.close();
  vnistDB.close();

  console.log('End init sample company database!');
};

initSampleCompanyDB().catch((err) => {
  console.log(err);
  process.exit(0);
});
