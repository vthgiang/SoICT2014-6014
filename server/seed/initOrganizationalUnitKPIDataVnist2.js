const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('dotenv').config();

const {
  EmployeeKpi,
  EmployeeKpiSet,
  OrganizationalUnitKpi,
  OrganizationalUnitKpiSet,
  User,
  UserRole,
  Role,
  OrganizationalUnit,
  Task,
  TaskPackageAllocation,
  TaskType,
  Company,
  TaskTemplate,
  Certificate,
  Major,
  Employee,
  Field,
  CareerPosition,
} = require('../models');

const initSampleCompanyDB = async () => {
  console.log('Init sample company database, ...');

  /**
   * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
   */

  const connectOptions =
    process.env.DB_AUTHENTICATION === 'true'
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
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`,
    connectOptions
  );

  if (!systemDB) throw 'DB vnist cannot connect';
  console.log('DB vnist connected');

  const connectVnistOptions =
    process.env.DB_AUTHENTICATION === 'true'
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
  const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`, connectVnistOptions);
  if (!vnistDB) throw 'DB vnist cannot connect';
  console.log('DB vnist connected');

  /**
   * 1.1 Khởi tạo model cho db
   */
  const initModels = (db) => {
    if (!db.models.EmployeeKpi) EmployeeKpi(db);
    if (!db.models.EmployeeKpiSet) EmployeeKpiSet(db);
    if (!db.models.OrganizationalUnitKpi) OrganizationalUnitKpi(db);
    if (!db.models.OrganizationalUnitKpiSet) OrganizationalUnitKpiSet(db);
    if (!db.models.User) User(db);
    if (!db.models.UserRole) UserRole(db);
    if (!db.models.Role) Role(db);
    if (!db.models.OrganizationalUnit) OrganizationalUnit(db);
    if (!db.models.Task) Task(db);
    if (!db.models.TaskPackageAllocation) TaskPackageAllocation(db);
    if (!db.models.TaskType) TaskType(db);
    if (!db.models.Company) Company(db);
    if (!db.models.TaskTemplate) TaskTemplate(db);
    if (!db.models.Certificate) Certificate(db);
    if (!db.models.Major) Major(db);
    if (!db.models.Employee) Employee(db);
    if (!db.models.Field) Field(db);
    if (!db.models.CareerPosition) CareerPosition(db);
  };
  initModels(vnistDB);

  console.log('Tạo dữ liệu cho ban giám đốc vnist 2');

  const giamDoc2 = await User(vnistDB).findOne({ name: 'Lê Thanh Giang' });
  const phoGiamDoc2 = await User(vnistDB).findOne({ name: 'Uông Hồng Minh' });
  const thanhVienBanGiamDoc2_1 = await User(vnistDB).findOne({ name: 'Đinh Thị Ngọc Anh' });
  const organizationalUnit_1 = await OrganizationalUnit(vnistDB).findOne({ name: 'Ban giám đốc công ty VNIST 2' });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  console.log('Đang tạo dữ liệu ...');

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi Set
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo Organizational Unit Kpi Set');
  // Thêm độ quan trọng đơn vị
  let organizationalUnitImportances = await OrganizationalUnit(vnistDB).find({
    parent: organizationalUnit_1,
  });

  if (organizationalUnitImportances && organizationalUnitImportances.length > 0) {
    organizationalUnitImportances = organizationalUnitImportances.map((item) => {
      return {
        organizationalUnit: new ObjectId(item?._id),
        importance: 100,
      };
    });
  }

  // Thêm độ quan trọng nhân viên
  let employeeImportances = [];
  let organizationalUnit = await OrganizationalUnit(vnistDB).findById(organizationalUnit_1);

  let allRoles = [...organizationalUnit.employees, ...organizationalUnit.managers, ...organizationalUnit.deputyManagers];
  let employees = await UserRole(vnistDB)
    .find({
      roleId: {
        $in: allRoles,
      },
    })
    .populate('userId roleId');
  for (let j in employees) {
    let check = 0;
    for (let k in employeeImportances) {
      if (String(employees[j].userId._id) == String(employeeImportances[k].userId._id)) {
        check = 1;
        break;
      }
    }
    if (check == 0) {
      let employee = {
        _id: employees[j]._id,
        idUnit: organizationalUnit_1,
        userId: employees[j].userId,
        roleId: employees[j].roleId,
      };
      employeeImportances.push(employee);
    }
  }
  if (employeeImportances && employeeImportances.length !== 0) {
    employeeImportances = employeeImportances.map((item) => {
      return {
        employee: item?.userId?._id,
        importance: 100,
      };
    });
  }
  var organizationalUnitKpiSet = await OrganizationalUnitKpiSet(vnistDB).insertMany([
    {
      organizationalUnit: organizationalUnit_1,
      creator: giamDoc2,
      date: new Date(currentYear, currentMonth - 1 + 1, 0),
      kpis: [],
      automaticPoint: 85,
      employeePoint: 89,
      approvedPoint: 79,
      status: 1,
      employeeImportances: employeeImportances,
      organizationalUnitImportances: organizationalUnitImportances,
    },
    {
      organizationalUnit: organizationalUnit_1,
      creator: giamDoc2,
      date: new Date(currentYear, currentMonth + 1, 0),
      kpis: [],
      automaticPoint: 86,
      employeePoint: 94,
      approvedPoint: 81,
      status: 0,
      employeeImportances: employeeImportances,
      organizationalUnitImportances: organizationalUnitImportances,
    },
  ]);
  //END

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU Organizational Unit Kpi
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  console.log('Khởi tạo Organizational Unit Kpi');

  var organizationalUnitKpiArray_1 = []; // organizationalUnitKpiArray_1[i] là mảng các kpi ban giám đốc

  organizationalUnitKpiArray_1[0] = await OrganizationalUnitKpi(vnistDB).insertMany([
    {
      name: 'Phê duyệt công việc',
      parent: null,
      weight: 5,
      criteria: 'Phê duyệt công việc',
      type: 1,
      automaticPoint: 79,
      employeePoint: 90,
      approvedPoint: 83,
    },
    {
      name: 'Tư vấn thực hiện công việc',
      parent: null,
      weight: 5,
      criteria: 'Tư vấn thực hiện công việc',
      type: 2,
      automaticPoint: 89,
      employeePoint: 90,
      approvedPoint: 88,
    },
    {
      name: 'Tăng doanh số bán hàng 20 tỷ',
      parent: null,
      weight: 40,
      criteria: 'Doanh số bán hàng',
      type: 0,
      automaticPoint: 85,
      employeePoint: 88,
      approvedPoint: 78,
    },
    {
      name: 'Phát triển chuỗi bán hàng ở Đà Nẵng',
      parent: null,
      weight: 50,
      criteria: 'Tăng số lượng cửa hàng',
      type: 0,
      automaticPoint: 85,
      employeePoint: 90,
      approvedPoint: 79,
    },
  ]);

  organizationalUnitKpiArray_1[1] = await OrganizationalUnitKpi(vnistDB).insertMany([
    {
      name: 'Phê duyệt công việc',
      parent: null,
      weight: 5,
      criteria: 'Phê duyệt công việc',
      type: 1,
      automaticPoint: 84,
      employeePoint: 90,
      approvedPoint: 81,
    },
    {
      name: 'Tư vấn thực hiện công việc',
      parent: null,
      weight: 5,
      criteria: 'Tư vấn thực hiện công việc',
      type: 2,
      automaticPoint: 93,
      employeePoint: 93,
      approvedPoint: 88,
    },
    {
      name: 'Doanh thu',
      parent: null,
      weight: 30,
      criteria: 'Tổng doanh thu thuần',
      type: 0,
      automaticPoint: 93,
      employeePoint: 95,
      approvedPoint: 88,
      target: 480,
      unit: 'Tỷ đồng',
    },
    {
      name: 'Tỷ lệ phế phẩm',
      parent: null,
      weight: 30,
      criteria: 'Tống số tỷ lệ phế phẩm / sản phẩm',
      type: 0,
      automaticPoint: 80,
      employeePoint: 93,
      approvedPoint: 75,
      target: 1000000,
      unit: 'Sản phẩm',
    },
    {
      name: 'Tỉ lệ nhân viên được đào tạo chuyên sâu về chuyên môn ít nhất 1 khóa trong năm',
      parent: null,
      weight: 30,
      criteria: 'Số lượng nhân viên được đào tạo chuyên môn / tổng số nhân sự',
      type: 0,
      automaticPoint: 80,
      employeePoint: 93,
      approvedPoint: 75,
      target: 95,
      unit: 'Nhân viên',
    },
  ]);

  /**
   * Gắn các KPI vào tập KPI của đơn vị
   */
  for (let i = 0; i < 2; i++) {
    organizationalUnitKpiSet[i] = await OrganizationalUnitKpiSet(vnistDB).findByIdAndUpdate(
      organizationalUnitKpiSet[i],
      {
        $push: {
          kpis: organizationalUnitKpiArray_1[i].map((x) => {
            return x._id;
          }),
        },
      },
      { new: true }
    );
  }

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU CÔNG VIỆC
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  // Phòng chăm sóc khách hàng
  const phongChamSocKhachHang = await OrganizationalUnit(vnistDB).find({ name: 'Phòng Chăm sóc khách hàng công ty VNIST 2' });
  const phongNhanSu = await OrganizationalUnit(vnistDB).find({ name: 'Phòng Nhân sự công ty VNIST 2' });
  const boPhanKinhDoanh = await OrganizationalUnit(vnistDB).find({ name: 'Bộ phận kinh doanh công ty VNIST 2' });
  // const phongKeHoach = await OrganizationalUnit(vnistDB).find({ name: 'Phòng Kế hoạch công ty VNIST 2' });

  const truongPhongChamSocKhachHang = await User(vnistDB).find({ name: 'Lê Thanh Giang' });
  const truongphongNhanSu = await User(vnistDB).find({ name: 'Lê Thanh Giang' });
  const truongboPhanKinhDoanh = await User(vnistDB).find({ name: 'Lê Thanh Giang' });
  // const truongphongKeHoach = await User(vnistDB).find({ name: 'Lê Thanh Giang' });

  const doanhthu = await OrganizationalUnitKpi(vnistDB).find({ name: 'Doanh thu' });
  const phepham = await OrganizationalUnitKpi(vnistDB).find({ name: 'Tỷ lệ phế phẩm' });
  const chuyenmon = await OrganizationalUnitKpi(vnistDB).find({
    name: 'Tỉ lệ nhân viên được đào tạo chuyên sâu về chuyên môn ít nhất 1 khóa trong năm',
  });

  const generateRandomScore = () => {
    return (Math.random() * (5 - 1) + 1).toFixed(2);
  };

  const taskTemplates = await TaskTemplate(vnistDB).insertMany([
    {
      type: 'Mở rộng mạng Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Mở rộng mạng Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Mở rộng mạng lưới phân phối',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 0.74,
          unit: 'tỷ đồng',
          startDate: '2024-06-02',
          endDate: '2024-07-25',
          durations: 53,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Mở rộng mạng lưới phân phối</p>',
        },
      ],
    },
    {
      type: 'Kiểm tra chất Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Kiểm tra chất Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Kiểm tra chất lượng sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 0.88,
          unit: 'Sản phẩm',
          startDate: '2024-06-09',
          endDate: '2024-08-05',
          durations: 57,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Kiểm tra chất lượng sản phẩm</p>',
        },
        {
          taskName: 'Kiểm tra chất lượng sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 1.05,
          unit: 'Sản phẩm',
          startDate: '2024-06-24',
          endDate: '2024-08-13',
          durations: 50,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Kiểm tra chất lượng sản phẩm</p>',
        },
      ],
    },
    {
      type: 'Giảm tỷ lệ Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Giảm tỷ lệ Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Giảm tỷ lệ lỗi sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 1.1,
          unit: 'Sản phẩm',
          startDate: '2024-06-23',
          endDate: '2024-07-24',
          durations: 31,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Giảm tỷ lệ lỗi sản phẩm</p>',
        },
      ],
    },
    {
      type: 'Đào tạo nhân Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Đào tạo nhân Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Đào tạo nhân viên về kiểm soát chất lượng',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 1.04,
          unit: 'Sản phẩm',
          startDate: '2024-06-27',
          endDate: '2024-08-08',
          durations: 42,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Đào tạo nhân viên về kiểm soát chất lượng</p>',
        },
      ],
    },
    {
      type: 'Mời chuyên gia Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Mời chuyên gia Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Mời chuyên gia đào tạo',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 1.01,
          unit: 'Nhân viên',
          startDate: '2024-05-31',
          endDate: '2024-07-24',
          durations: 54,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Mời chuyên gia đào tạo</p>',
        },
        {
          taskName: 'Mời chuyên gia đào tạo',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 1.29,
          unit: 'Nhân viên',
          startDate: '2024-06-11',
          endDate: '2024-07-30',
          durations: 49,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Mời chuyên gia đào tạo</p>',
        },
      ],
    },
    {
      type: 'Tổ chức khóa Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Tổ chức khóa Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Tổ chức khóa đào tạo chuyên môn',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 1.36,
          unit: 'Nhân viên',
          startDate: '2024-06-02',
          endDate: '2024-07-22',
          durations: 50,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Tổ chức khóa đào tạo chuyên môn</p>',
        },
        {
          taskName: 'Tổ chức khóa đào tạo chuyên môn',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 0.88,
          unit: 'Nhân viên',
          startDate: '2024-06-17',
          endDate: '2024-07-31',
          durations: 44,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Tổ chức khóa đào tạo chuyên môn</p>',
        },
      ],
    },
    {
      type: 'Đánh giá hiệu Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongChamSocKhachHang[0]._id),
      name: 'Đánh giá hiệu Group',
      creator: new ObjectId(truongPhongChamSocKhachHang[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Đánh giá hiệu quả đào tạo',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 0.75,
          unit: 'Nhân viên',
          startDate: '2024-06-15',
          endDate: '2024-08-11',
          durations: 57,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Đánh giá hiệu quả đào tạo</p>',
        },
      ],
    },
    {
      type: 'Đào tạo kỹ Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongNhanSu[0]._id),
      name: 'Đào tạo kỹ Group',
      creator: new ObjectId(truongphongNhanSu[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Đào tạo kỹ năng bán hàng',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 0.59,
          unit: 'tỷ đồng',
          startDate: '2024-06-11',
          endDate: '2024-07-12',
          durations: 31,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Đào tạo kỹ năng bán hàng</p>',
        },
      ],
    },
    {
      type: 'Giảm tỷ lệ Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongNhanSu[0]._id),
      name: 'Giảm tỷ lệ Group',
      creator: new ObjectId(truongphongNhanSu[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Giảm tỷ lệ lỗi sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 1.49,
          unit: 'Sản phẩm',
          startDate: '2024-06-25',
          endDate: '2024-08-01',
          durations: 37,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Giảm tỷ lệ lỗi sản phẩm</p>',
        },
        {
          taskName: 'Giảm tỷ lệ lỗi sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 0.66,
          unit: 'Sản phẩm',
          startDate: '2024-06-09',
          endDate: '2024-07-15',
          durations: 36,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Giảm tỷ lệ lỗi sản phẩm</p>',
        },
        {
          taskName: 'Giảm tỷ lệ lỗi sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 1.2,
          unit: 'Sản phẩm',
          startDate: '2024-06-19',
          endDate: '2024-08-08',
          durations: 50,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Giảm tỷ lệ lỗi sản phẩm</p>',
        },
      ],
    },
    {
      type: 'Kiểm tra chất Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongNhanSu[0]._id),
      name: 'Kiểm tra chất Group',
      creator: new ObjectId(truongphongNhanSu[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Kiểm tra chất lượng sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 0.88,
          unit: 'Sản phẩm',
          startDate: '2024-06-12',
          endDate: '2024-08-01',
          durations: 50,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Kiểm tra chất lượng sản phẩm</p>',
        },
        {
          taskName: 'Kiểm tra chất lượng sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 1.11,
          unit: 'Sản phẩm',
          startDate: '2024-06-03',
          endDate: '2024-07-20',
          durations: 47,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Kiểm tra chất lượng sản phẩm</p>',
        },
      ],
    },
    {
      type: 'Tổ chức khóa Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(phongNhanSu[0]._id),
      name: 'Tổ chức khóa Group',
      creator: new ObjectId(truongphongNhanSu[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Tổ chức khóa đào tạo chuyên môn',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 1.18,
          unit: 'Nhân viên',
          startDate: '2024-06-15',
          endDate: '2024-08-08',
          durations: 54,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Tổ chức khóa đào tạo chuyên môn</p>',
        },
      ],
    },
    {
      type: 'Tăng cường hoạt Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(boPhanKinhDoanh[0]._id),
      name: 'Tăng cường hoạt Group',
      creator: new ObjectId(truongboPhanKinhDoanh[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Tăng cường hoạt động marketing',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 1.01,
          unit: 'tỷ đồng',
          startDate: '2024-05-29',
          endDate: '2024-07-15',
          durations: 47,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Tăng cường hoạt động marketing</p>',
        },
      ],
    },
    {
      type: 'Phân tích nguyên Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(boPhanKinhDoanh[0]._id),
      name: 'Phân tích nguyên Group',
      creator: new ObjectId(truongboPhanKinhDoanh[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Phân tích nguyên nhân gây phế phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 0.72,
          unit: 'Sản phẩm',
          startDate: '2024-06-08',
          endDate: '2024-08-03',
          durations: 56,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Phân tích nguyên nhân gây phế phẩm</p>',
        },
      ],
    },
    {
      type: 'Kiểm tra chất Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(boPhanKinhDoanh[0]._id),
      name: 'Kiểm tra chất Group',
      creator: new ObjectId(truongboPhanKinhDoanh[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Kiểm tra chất lượng sản phẩm',
          organizationalUnitKpi: new ObjectId(phepham[0]._id),
          target: 0.73,
          unit: 'Sản phẩm',
          startDate: '2024-05-30',
          endDate: '2024-07-24',
          durations: 55,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Kiểm tra chất lượng sản phẩm</p>',
        },
      ],
    },
    {
      type: 'Mời chuyên gia Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(boPhanKinhDoanh[0]._id),
      name: 'Mời chuyên gia Group',
      creator: new ObjectId(truongboPhanKinhDoanh[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Mời chuyên gia đào tạo',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 0.95,
          unit: 'Nhân viên',
          startDate: '2024-06-28',
          endDate: '2024-08-20',
          durations: 53,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Mời chuyên gia đào tạo</p>',
        },
      ],
    },
    {
      type: 'Xây dựng chương Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(boPhanKinhDoanh[0]._id),
      name: 'Xây dựng chương Group',
      creator: new ObjectId(truongboPhanKinhDoanh[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Xây dựng chương trình đào tạo nội bộ',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 1.47,
          unit: 'Nhân viên',
          startDate: '2024-06-22',
          endDate: '2024-07-27',
          durations: 35,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Xây dựng chương trình đào tạo nội bộ</p>',
        },
      ],
    },
    {
      type: 'Đánh giá hiệu Group',
      collaboratedWithOrganizationalUnits: [],
      numberOfDaysTaken: 1,
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      status: false,
      numberOfUse: 0,
      isMappingTask: true,
      organizationalUnit: new ObjectId(boPhanKinhDoanh[0]._id),
      name: 'Đánh giá hiệu Group',
      creator: new ObjectId(truongboPhanKinhDoanh[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Đánh giá hiệu quả đào tạo',
          organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
          target: 1.41,
          unit: 'Nhân viên',
          startDate: '2024-06-25',
          endDate: '2024-08-14',
          durations: 50,
          affected_factor: [
            {
              affected_factor_type: 'Product',
              score: parseFloat(generateRandomScore()),
            },
            {
              affected_factor_type: 'Environment',
              score: parseFloat(generateRandomScore()),
            },
          ],
          taskDescription: '<p>Mô tả công việc về Đánh giá hiệu quả đào tạo</p>',
        },
      ],
    },
    // {
    //   type: 'Tối ưu hóa Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Tối ưu hóa Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Tối ưu hóa quy trình bán hàng',
    //       organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
    //       target: 0.72,
    //       unit: 'tỷ đồng',
    //       startDate: '2024-06-16',
    //       endDate: '2024-07-24',
    //       durations: 38,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Tối ưu hóa quy trình bán hàng</p>',
    //     },
    //   ],
    // },
    // {
    //   type: 'Phát triển thị Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Phát triển thị Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Phát triển thị trường mới',
    //       organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
    //       target: 1.26,
    //       unit: 'tỷ đồng',
    //       startDate: '2024-06-03',
    //       endDate: '2024-07-25',
    //       durations: 52,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Phát triển thị trường mới</p>',
    //     },
    //   ],
    // },
    // {
    //   type: 'Phân tích nguyên Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Phân tích nguyên Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Phân tích nguyên nhân gây phế phẩm',
    //       organizationalUnitKpi: new ObjectId(phepham[0]._id),
    //       target: 1.38,
    //       unit: 'Sản phẩm',
    //       startDate: '2024-06-08',
    //       endDate: '2024-07-14',
    //       durations: 36,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Phân tích nguyên nhân gây phế phẩm</p>',
    //     },
    //   ],
    // },
    // {
    //   type: 'Đào tạo nhân Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Đào tạo nhân Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Đào tạo nhân viên về kiểm soát chất lượng',
    //       organizationalUnitKpi: new ObjectId(phepham[0]._id),
    //       target: 0.9,
    //       unit: 'Sản phẩm',
    //       startDate: '2024-06-27',
    //       endDate: '2024-08-16',
    //       durations: 50,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Đào tạo nhân viên về kiểm soát chất lượng</p>',
    //     },
    //     {
    //       taskName: 'Đào tạo nhân viên về kiểm soát chất lượng',
    //       organizationalUnitKpi: new ObjectId(phepham[0]._id),
    //       target: 0.64,
    //       unit: 'Sản phẩm',
    //       startDate: '2024-06-02',
    //       endDate: '2024-07-09',
    //       durations: 37,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Đào tạo nhân viên về kiểm soát chất lượng</p>',
    //     },
    //   ],
    // },
    // {
    //   type: 'Xây dựng chương Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Xây dựng chương Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Xây dựng chương trình đào tạo nội bộ',
    //       organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
    //       target: 1.26,
    //       unit: 'Nhân viên',
    //       startDate: '2024-06-15',
    //       endDate: '2024-08-14',
    //       durations: 60,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Xây dựng chương trình đào tạo nội bộ</p>',
    //     },
    //   ],
    // },
    // {
    //   type: 'Đánh giá hiệu Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Đánh giá hiệu Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Đánh giá hiệu quả đào tạo',
    //       organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
    //       target: 1.42,
    //       unit: 'Nhân viên',
    //       startDate: '2024-06-17',
    //       endDate: '2024-07-27',
    //       durations: 40,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Đánh giá hiệu quả đào tạo</p>',
    //     },
    //   ],
    // },
    // {
    //   type: 'Phát triển tài Group',
    //   collaboratedWithOrganizationalUnits: [],
    //   numberOfDaysTaken: 1,
    //   readByEmployees: [],
    //   responsibleEmployees: [],
    //   accountableEmployees: [],
    //   consultedEmployees: [],
    //   informedEmployees: [],
    //   status: false,
    //   numberOfUse: 0,
    //   isMappingTask: true,
    //   organizationalUnit: new ObjectId(phongKeHoach[0]._id),
    //   name: 'Phát triển tài Group',
    //   creator: new ObjectId(truongphongKeHoach[0]._id),
    //   description: '<p>Mô tả mẫu </p>',
    //   formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
    //   priority: 3,
    //   taskActions: [],
    //   taskInformations: [],
    //   listMappingTask: [
    //     {
    //       taskName: 'Phát triển tài liệu đào tạo',
    //       organizationalUnitKpi: new ObjectId(chuyenmon[0]._id),
    //       target: 0.52,
    //       unit: 'Nhân viên',
    //       startDate: '2024-06-27',
    //       endDate: '2024-08-07',
    //       durations: 41,
    //       affected_factor: [
    //         {
    //           affected_factor_type: 'Product',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //         {
    //           affected_factor_type: 'Environment',
    //           score: parseFloat(generateRandomScore()),
    //         },
    //       ],
    //       taskDescription: '<p>Mô tả công việc về Phát triển tài liệu đào tạo</p>',
    //     },
    //   ],
    // },
  ]);

  const vnist = await Company(systemDB).findOne({
    shortName: 'vnist',
  });

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU BẰNG CẤP
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  const majors = await Major(vnistDB).insertMany([
    {
      name: 'Quản trị Kinh doanh',
      code: 'QTKD',
      score: 5,
      description: 'QTKD',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Marketing',
      code: 'MKT',
      score: 5,
      description: 'MKT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Anh',
      code: 'NNA',
      score: 5,
      description: 'NNA',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị Dịch vụ Du lịch và Lữ hành',
      code: 'QTDVDL&LH',
      score: 4,
      description: 'QTDVDL&LH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quan hệ Công chúng',
      code: 'QHCC',
      score: 4,
      description: 'QHCC',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Học',
      code: 'NN',
      score: 3,
      description: 'NN',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kinh doanh Quốc tế',
      code: 'KDQT',
      score: 4,
      description: 'KDQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Tâm lý học',
      code: 'TLH',
      score: 4,
      description: 'TLH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị Nhân sự',
      code: 'QTNS',
      score: 3,
      description: 'QTNS',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Luật',
      code: 'L',
      score: 3,
      description: 'L',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Việt Nam học',
      code: 'VNH',
      score: 3,
      description: 'VNH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kinh tế Quốc tế',
      code: 'KTQT',
      score: 3,
      description: 'KTQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Xã hội học',
      code: 'XHH',
      score: 3,
      description: 'XHH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị Truyền thông và Đa phương tiện',
      code: 'QTTT&ĐPT',
      score: 4,
      description: 'QTTT&ĐPT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị nhân sự',
      code: 'QTNH',
      score: 5,
      description: 'QTNH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị kinh doanh',
      code: 'QTKD',
      score: 4,
      description: 'QTKD',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kinh tế lao động',
      code: 'KTLD',
      score: 4,
      description: 'KTLD',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Luật học',
      code: 'LH',
      score: 4,
      description: 'LH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Anh',
      code: 'NNA',
      score: 4,
      description: 'NNA',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ học',
      code: 'NNH',
      score: 3,
      description: 'NNH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Tâm lý học',
      code: 'TLH',
      score: 4,
      description: 'TLH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Công nghệ thông tin',
      code: 'CNTT',
      score: 3,
      description: 'CNTT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kế toán',
      code: 'KT',
      score: 3,
      description: 'KT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Xã hội học',
      code: 'XHH',
      score: 3,
      description: 'XHH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Giáo dục học',
      code: 'GDH',
      score: 3,
      description: 'GDH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Truyền thông và quan hệ công chúng',
      code: 'TT&QHCC',
      score: 4,
      description: 'TT&QHCC',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Khoa học quản lý',
      code: 'KHQL',
      score: 4,
      description: 'KHQL',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Hành chính công',
      code: 'HCC',
      score: 3,
      description: 'HCC',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị kinh doanh',
      code: 'QTKD',
      score: 5,
      description: 'QTKD',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Marketing',
      code: 'MKT',
      score: 5,
      description: 'MKT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kinh doanh quốc tế',
      code: 'KDQT',
      score: 5,
      description: 'KDQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Tài chính ngân hàng',
      code: 'TCNH',
      score: 4,
      description: 'TCNH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kinh tế học',
      code: 'KTH',
      score: 4,
      description: 'KTH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị nhân lực',
      code: 'QTNL',
      score: 4,
      description: 'QTNL',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Anh',
      code: 'NNA',
      score: 5,
      description: 'NNA',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Trung Quốc',
      code: 'NNTQ',
      score: 4,
      description: 'NNTQ',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Nhật',
      code: 'NNN',
      score: 4,
      description: 'NNN',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngôn ngữ Hàn Quốc',
      code: 'NNHQ',
      score: 4,
      description: 'NNHQ',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Thương mại điện tử',
      code: 'TMĐT',
      score: 4,
      description: 'TMĐT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quan hệ quốc tế',
      code: 'QHQT',
      score: 4,
      description: 'QHQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kế toán',
      code: 'KT',
      score: 3,
      description: 'KT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý chuỗi cung ứng',
      code: 'QLCCC',
      score: 3,
      description: 'QLCCC',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Logistics và Quản lý chuỗi cung ứng',
      code: 'LQCCC',
      score: 3,
      description: 'LQCCC',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị du lịch và lữ hành',
      code: 'QTDLLH',
      score: 3,
      description: 'QTDLLH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Thương mại quốc tế',
      code: 'TMQT',
      score: 4,
      description: 'TMQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kinh tế',
      code: 'KT',
      score: 5,
      description: 'KT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị kinh doanh',
      code: 'QTKD',
      score: 5,
      description: 'QTKD',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Ngoại ngữ',
      code: 'NN',
      score: 4,
      description: 'NN',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quan hệ quốc tế',
      code: 'QHQT',
      score: 4,
      description: 'QHQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Marketing',
      code: 'MKT',
      score: 5,
      description: 'MKT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Tài chính',
      code: 'TC',
      score: 4,
      description: 'TC',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kế toán',
      code: 'KT',
      score: 3,
      description: 'KT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Luật kinh tế',
      code: 'LK',
      score: 4,
      description: 'LK',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị nhân lực',
      code: 'QTHR',
      score: 3,
      description: 'QTHR',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Thương mại quốc tế',
      code: 'TMQT',
      score: 5,
      description: 'TMQT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Công nghệ thông tin',
      code: 'CNTT',
      score: 3,
      description: 'CNTT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Khoa học dữ liệu',
      code: 'KHDL',
      score: 4,
      description: 'KHDL',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Truyền thông đa phương tiện',
      code: 'TTĐPT',
      score: 4,
      description: 'TTĐPT',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Kỹ thuật hệ thống công nghiệp',
      code: 'KTHSCN',
      score: 3,
      description: 'KTHSCN',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Quản trị dịch vụ du lịch và lữ hành',
      code: 'QT-DVDLLH',
      score: 3,
      description: 'QT-DVDLLH',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Logistics và Quản lý chuỗi cung ứng',
      code: 'L&QLCCU',
      score: 5,
      description: 'L&QLCCU',
      parents: [],
      company: vnist._id,
    },
    {
      name: 'Tâm lý học',
      code: 'TLH',
      score: 3,
      description: 'TLH',
      parents: [],
      company: vnist._id,
    },
  ]);

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU CHỨNG CHỈ
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  const certificates = await Certificate(vnistDB).insertMany([
    {
      name: 'Six Sigma',
      abbreviation: 'SS',
      score: 5,
      description: 'SS',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Information Technology Infrastructure Library',
      abbreviation: 'ITIL',
      score: 5,
      description: 'ITIL',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Dale Carnegie Training',
      abbreviation: 'DCT',
      score: 4,
      description: 'DCT',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'International Business Communication Standards',
      abbreviation: 'IBCS',
      score: 4,
      description: 'IBCS',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Salesforce',
      abbreviation: 'SF',
      score: 4,
      description: 'SF',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'HubSpot',
      abbreviation: 'HS',
      score: 3,
      description: 'HS',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Zendesk',
      abbreviation: 'ZD',
      score: 2,
      description: 'ZD',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Project Management Professional (PMP)',
      abbreviation: 'PMP',
      score: 5,
      description: 'PMP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Human Resource Certification Institute (HRCI)',
      abbreviation: 'HRCI',
      score: 4,
      description: 'HRCI',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Society for Human Resource Management (SHRM)',
      abbreviation: 'SHRM',
      score: 4,
      description: 'SHRM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Global Professional in Human Resources (GPHR)',
      abbreviation: 'GPHR',
      score: 4,
      description: 'GPHR',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Professional in Human Resources (PHR)',
      abbreviation: 'PHR',
      score: 3,
      description: 'PHR',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Senior Professional in Human Resources (SPHR)',
      abbreviation: 'SPHR',
      score: 3,
      description: 'SPHR',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified Compensation Professional (CCP)',
      abbreviation: 'CCP',
      score: 3,
      description: 'CCP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'International Foundation of Employee Benefit Plans (IFEBP)',
      abbreviation: 'IFEBP',
      score: 3,
      description: 'IFEBP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Diversity and Inclusion Certificate (D&I)',
      abbreviation: 'D&I',
      score: 3,
      description: 'D&I',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified Global Business Professional (CGBP)',
      abbreviation: 'CGBP',
      score: 2,
      description: 'CGBP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Language Proficiency Certificates (various)',
      abbreviation: 'LP',
      score: 5,
      description: 'LP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý dự án',
      abbreviation: 'PMP',
      score: 5,
      description: 'PMP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý sản phẩm',
      abbreviation: 'PLM',
      score: 4,
      description: 'PLM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Kinh doanh quốc tế',
      abbreviation: 'IBD',
      score: 4,
      description: 'IBD',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý chuỗi cung ứng',
      abbreviation: 'SCM',
      score: 4,
      description: 'SCM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Kinh doanh toàn cầu',
      abbreviation: 'GBD',
      score: 4,
      description: 'GBD',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Marketing kỹ thuật số',
      abbreviation: 'DMT',
      score: 4,
      description: 'DMT',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý nguồn nhân lực',
      abbreviation: 'HRM',
      score: 3,
      description: 'HRM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Phân tích tài chính',
      abbreviation: 'FMA',
      score: 3,
      description: 'FMA',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý chất lượng',
      abbreviation: 'QLM',
      score: 3,
      description: 'QLM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Quản lý rủi ro',
      abbreviation: 'RLM',
      score: 3,
      description: 'RLM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified ScrumMaster (CSM)',
      abbreviation: 'CSM',
      score: 4,
      description: 'CSM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Six Sigma Green Belt',
      abbreviation: 'SSGB',
      score: 3,
      description: 'SSGB',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified Associate in Project Management (CAPM)',
      abbreviation: 'CAPM',
      score: 3,
      description: 'CAPM',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'PRINCE2 Foundation',
      abbreviation: 'PRINCE2 F',
      score: 3,
      description: 'PRINCE2 F',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Agile Certified Practitioner (PMI-ACP)',
      abbreviation: 'PMI-ACP',
      score: 4,
      description: 'PMI-ACP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified Business Analysis Professional (CBAP)',
      abbreviation: 'CBAP',
      score: 4,
      description: 'CBAP',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'ITIL Foundation',
      abbreviation: 'ITIL F',
      score: 2,
      description: 'ITIL F',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified Management Accountant (CMA)',
      abbreviation: 'CMA',
      score: 3,
      description: 'CMA',
      majors: [],
      company: vnist._id,
    },
    {
      name: 'Certified Supply Chain Professional (CSCP)',
      abbreviation: 'CSCP',
      score: 4,
      description: 'CSCP',
      majors: [],
      company: vnist._id,
    },
  ]);

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU NHÂN VIÊN
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */
  const fields = await Field(vnistDB).find({});
  const careerPositions = await CareerPosition(vnistDB).find({});
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const days = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];
  const listUserVnist2 = [
    {
      name: 'Trần Hữu Hiến',
      email: 'thh.vnist@gmail.com',
    },
    {
      name: 'Bùi Mạnh Dũng',
      email: 'bmd.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Thị Minh Châu',
      email: 'ntmc.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Mạnh Hiếu',
      email: 'nmh.vnist@gmail.com',
    },
    {
      name: 'Trịnh Phú Quang',
      email: 'tpq.vnist@gmail.com',
    },
    {
      name: 'Ngô Văn Thức',
      email: 'nvt.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Tài Khoa',
      email: 'ntk.vnist@gmail.com',
    },
    {
      name: 'Dương Đức Huy',
      email: 'ddh.vnist@gmail.com',
    },
    {
      name: 'Lê Bá Trọng',
      email: 'lbt.vnist@gmail.com',
    },
    {
      name: 'Đinh Huy Dương',
      email: 'dhd.vnist@gmail.com',
    },
    {
      name: 'Lê Đàm Quân',
      email: 'ldq.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Minh Chiến',
      email: 'nmc.vnist@gmail.com',
    },
    {
      name: 'Chu Văn Thành',
      email: 'cvt.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Hoàng Thương',
      email: 'nht.vnist@gmail.com',
    },
    {
      name: 'Dương Đăng Quang',
      email: 'ddq.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Khánh Duy',
      email: 'nkd.vnist@gmail.com',
    },
    {
      name: 'Tô Duy Tường',
      email: 'tdt.vnist@gmail.com',
    },
    {
      name: 'Trần Tiến Đạt',
      email: 'ttd.vnist@gmail.com',
    },
    {
      name: 'Lâm Anh Quân',
      email: 'laq.vnist@gmail.com',
    },
    {
      name: 'Hoàng Sĩ Vương',
      email: 'hsv.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Vũ Thục Anh',
      email: 'nvta.vnist@gmail.com',
    },
    {
      name: 'Lê Quang Minh',
      email: 'lqm.vnist@gmail.com',
    },
  ];

  const generateEmployeeNumber = () => {
    const prefix = 'MS';
    const year = Math.floor(Math.random() * 5) + 2020;
    const day = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');

    return `${prefix}${year}${day}`;
  };

  const generateEmployeeTimesheetId = () => {
    const min = 10000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  };

  const generateRandomGender = () => {
    const genders = ['male', 'female'];
    const randomIndex = Math.floor(Math.random() * genders.length);
    return genders[randomIndex];
  };

  const generateRandomBirthdate = () => {
    const start = new Date(1950, 0, 1); // January 1, 1950
    const end = new Date(2000, 11, 31); // December 31, 2000
    const birthdate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    const year = birthdate.getFullYear();
    const month = String(birthdate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(birthdate.getDate()).padStart(2, '0');

    return new Date(`${year}-${month}-${day}`);
  };

  const generateRandomIdentityCardNumber = () => {
    const min = 100000000; // Minimum value for identity card number
    const max = 999999999; // Maximum value for identity card number
    const randomIdentityCardNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomIdentityCardNumber;
  };

  const generateRandomVietnamesePhoneNumber = () => {
    const prefixes = ['03', '05', '07', '08', '09']; // Common mobile phone prefixes in Vietnam
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const mainPart = Math.floor(Math.random() * 90000000 + 10000000); // Random 8-digit number for main part

    return `${prefix}${mainPart}`;
  };

  const removeDiacritics = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const generateRandomUniqueEmailFromVietnameseName = (fullName) => {
    const domain = 'gmail.com'; // You can change this to any domain you prefer
    const normalizedFullName = removeDiacritics(fullName);
    const nameParts = normalizedFullName.trim().split(' ');

    const lastName = nameParts.shift().toLowerCase();
    const firstName = nameParts.pop().toLowerCase();
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random 4-digit number
    const email = `${firstName}${lastName}${randomNumber}@${domain}`;

    return email;
  };

  const insertVnist2EmployeesData = listUserVnist2.map((item) => {
    return {
      avatar: '/upload/human-resource/avatars/avatar5.png',
      fullName: item.name,
      employeeNumber: generateEmployeeNumber(),
      status: 'active',
      company: vnist._id,
      employeeTimesheetId: generateEmployeeTimesheetId(),
      gender: generateRandomGender(),
      startingDate: new Date(`${currentYear}-02-19`),
      birthdate: generateRandomBirthdate(),
      birthplace: 'Hải An - Hải Hậu - Nam Định',
      identityCardNumber: generateRandomIdentityCardNumber(),
      identityCardDate: new Date('2015-10-20'),
      identityCardAddress: 'Nam Định',
      emailInCompany: item.email,
      nationality: 'Việt Nam',
      atmNumber: '102298653',
      bankName: 'ViettinBank',
      bankAddress: 'Hai Bà Trưng',
      ethnic: 'Kinh',
      religion: 'Không',
      maritalStatus: 'single',
      phoneNumber: generateRandomVietnamesePhoneNumber(),
      personalEmail: generateRandomUniqueEmailFromVietnameseName(item.name),
      phoneNumber2: generateRandomVietnamesePhoneNumber(),
      personalEmail2: generateRandomUniqueEmailFromVietnameseName(item.name),
      homePhone: generateRandomVietnamesePhoneNumber(),
      emergencyContactPerson: 'Nguyễn Văn Tài',
      relationWithEmergencyContactPerson: 'Em trai',
      emergencyContactPersonPhoneNumber: generateRandomVietnamesePhoneNumber(),
      emergencyContactPersonEmail: 'tai@gmail.com',
      emergencyContactPersonHomePhone: generateRandomVietnamesePhoneNumber(),
      emergencyContactPersonAddress: 'Hải Phương - Hải Hậu - Nam Định',
      permanentResidence: 'Hải Phương - Hải Hậu - Nam Định',
      permanentResidenceCountry: 'Việt Nam',
      permanentResidenceCity: 'Nam Định',
      permanentResidenceDistrict: 'Hải Hậu',
      permanentResidenceWard: 'Hải Phương',
      temporaryResidence: 'ngõ Trại Cá phường Trương Định',
      temporaryResidenceCountry: 'Việt Nam',
      temporaryResidenceCity: 'Hà Nội',
      temporaryResidenceDistrict: 'Hai Bà Trưng',
      temporaryResidenceWard: 'Bạch Mai',
      educationalLevel: '12/12',
      foreignLanguage: '700 Toeic',
      professionalSkill: 'university',
      healthInsuranceNumber: 'N1236589',
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: 'XH1569874',
      socialInsuranceDetails: [
        {
          company: 'Vnist',
          position: 'Nhân viên',
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: '12315',
      taxRepresentative: 'Nguyễn Văn Hưng',
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: 'Chi cục thuế Huyện Hải Hậu',
      degrees: [
        {
          name: 'Bằng tốt nghiệp',
          issuedBy: 'Đại học Bách Khoa',
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: 'good',
        },
        {
          name: 'Bằng tốt nghiệp',
          issuedBy: 'Đại học Khoa Học Tự Nhiên',
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: 'good',
        },
      ],
      certificates: [
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: 'PHP',
          issuedBy: 'Hà Nội',
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
        {
          certificate: certificates[Math.floor(Math.random() * 10)]._id,
          name: 'PHP 2',
          issuedBy: 'Hà Nội',
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      experiences: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: 'Vnist',
          position: 'Nhân viên',
        },
      ],
      careerPositions: [
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: 'Vnist',
          startDate: new Date(`${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
          endDate: new Date(`${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: 'Vnist',
          startDate: new Date(`${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
          endDate: new Date(`${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: 'Vnist',
          startDate: new Date(`${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
          endDate: new Date(`${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: 'Vnist',
          startDate: new Date(`${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
          endDate: new Date(`${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
        },
        {
          careerPosition: careerPositions[Math.floor(Math.random() * 15)]._id,
          company: 'Vnist',
          startDate: new Date(`${currentYear - 2}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
          endDate: new Date(`${currentYear - 1}-${months[Math.floor(Math.random() * 12)]}-${days[Math.floor(Math.random() * 19)]}`),
        },
      ],
      biddingPackages: [
        {
          startDate: new Date(`${currentYear - 1}-06`),
          endDate: new Date(`${currentYear}-02`),
          company: 'Vnist',
          position: 'Nhân viên',
        },
      ],
      contractType: 'Thử việc',
      contractEndDate: new Date(`${currentYear}-10-25`),
      contracts: [
        {
          name: 'Thực tập',
          contractType: 'Thử việc',
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
      ],
      archivedRecordNumber: 'T3 - 123698',
      files: [],
    };
  });

  await Employee(vnistDB).insertMany(insertVnist2EmployeesData);

  vnistDB.close();
  systemDB.close();
  console.log('End init sample company database!');
};

try {
  initSampleCompanyDB();
} catch (error) {
  console.log(error);
  process.exit(0);
}
