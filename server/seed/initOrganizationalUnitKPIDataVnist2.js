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
  AllocationConfigSetting,
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
    if (!db.models.AllocationConfigSetting) AllocationConfigSetting(db);
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
      name: 'Doanh số bán hàng',
      parent: null,
      weight: 30,
      criteria: 'Số lượng doanh thu từ bán hàng',
      type: 0,
      automaticPoint: 93,
      employeePoint: 95,
      approvedPoint: 88,
      target: 600000,
      unit: 'USD',
    },
    {
      name: 'Số lượng khách hàng mới',
      parent: null,
      weight: 30,
      criteria: 'Số lượng khách hàng kiếm được',
      type: 0,
      automaticPoint: 80,
      employeePoint: 93,
      approvedPoint: 75,
      target: 20000,
      unit: 'Khách hàng',
    },
    {
      name: 'Tỷ lệ chuyển đổi khách hàng',
      parent: null,
      weight: 30,
      criteria: 'Tỷ lệ chuyển đổi khách hàng',
      type: 0,
      automaticPoint: 80,
      employeePoint: 93,
      approvedPoint: 75,
      target: 90,
      unit: 'Phần trăm',
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
  const boPhanKinhDoanhA = await OrganizationalUnit(vnistDB).find({ name: 'Bộ phận kinh doanh A công ty VNIST 2' });
  const boPhanKinhDoanhB = await OrganizationalUnit(vnistDB).find({ name: 'Bộ phận kinh doanh B công ty VNIST 2' });
  const boPhanKinhDoanhC = await OrganizationalUnit(vnistDB).find({ name: 'Bộ phận kinh doanh C công ty VNIST 2' });

  const truongboPhanKinhDoanhA = await User(vnistDB).find({ name: 'Lê Thanh Giang' });
  const truongboPhanKinhDoanhB = await User(vnistDB).find({ name: 'Lê Thanh Giang' });
  const truongboPhanKinhDoanhC = await User(vnistDB).find({ name: 'Lê Thanh Giang' });

  const doanhthu = await OrganizationalUnitKpi(vnistDB).find({ name: 'Doanh số bán hàng' });
  const soluongkhachhangmoi = await OrganizationalUnitKpi(vnistDB).find({ name: 'Số lượng khách hàng mới' });
  const tylechuyendoikhachhang = await OrganizationalUnitKpi(vnistDB).find({ name: 'Tỷ lệ chuyển đổi khách hàng' });

  const generateRandomScore = () => {
    return (Math.random() * (5 - 1) + 1).toFixed(2);
  };

  const taskTemplates = await TaskTemplate(vnistDB).insertMany([
    {
      type: 'Phân tích thị trường',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhA[0]._id),
      name: 'Phân tích thị trường',
      creator: new ObjectId(truongboPhanKinhDoanhA[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Doanh thu mục tiêu',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 300000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Lợi nhuận mục tiêu',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 240000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Phân tích thị trường',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhB[0]._id),
      name: 'Phân tích thị trường',
      creator: new ObjectId(truongboPhanKinhDoanhB[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Doanh thu mục tiêu',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 300000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Lợi nhuận mục tiêu',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 240000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Phân tích thị trường',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhC[0]._id),
      name: 'Phân tích thị trường',
      creator: new ObjectId(truongboPhanKinhDoanhC[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Doanh thu mục tiêu',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 300000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Lợi nhuận mục tiêu',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 240000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Quan hệ công chúng',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhA[0]._id),
      name: 'Quan hệ công chúng',
      creator: new ObjectId(truongboPhanKinhDoanhA[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Tìm kiếm khách hàng',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 18750.0,
          unit: 'Người',
          startDate: '2024-06-01',
          endDate: '2024-08-05',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tham gia sự kiện',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 700.0,
          unit: 'Sự kiện',
          startDate: '2024-06-01',
          endDate: '2024-08-05',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Xây dựng mối quan hệ và đề xuất sản phẩm',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 2500.0,
          unit: 'Cuộc gọi',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Đàm phán và thuyết phục khách hàng',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 25000.0,
          unit: 'Người',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tư vấn chuyển đổi dịch vụ',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 3500.0,
          unit: 'Cuộc gọi',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Quan hệ công chúng',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhB[0]._id),
      name: 'Quan hệ công chúng',
      creator: new ObjectId(truongboPhanKinhDoanhB[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Tìm kiếm khách hàng',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 18750.0,
          unit: 'Người',
          startDate: '2024-06-01',
          endDate: '2024-08-05',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tham gia sự kiện',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 700.0,
          unit: 'Sự kiện',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Xây dựng mối quan hệ và đề xuất sản phẩm',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 2500.0,
          unit: 'Cuộc gọi',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Đàm phán và thuyết phục khách hàng',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 25000.0,
          unit: 'Người',
          startDate: '2024-06-01',
          endDate: '2024-07-22',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tư vấn chuyển đổi dịch vụ',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 3500.0,
          unit: 'Cuộc gọi',
          startDate: '2024-06-01',
          endDate: '2024-07-30',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Quan hệ công chúng',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhC[0]._id),
      name: 'Quan hệ công chúng',
      creator: new ObjectId(truongboPhanKinhDoanhC[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Tìm kiếm khách hàng',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 18750.0,
          unit: 'Người',
          startDate: '2024-06-01',
          endDate: '2024-08-05',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tham gia sự kiện',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 700.0,
          unit: 'Sự kiện',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Xây dựng mối quan hệ và đề xuất sản phẩm',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 2500.0,
          unit: 'Cuộc gọi',
          startDate: '2024-06-01',
          endDate: '2024-07-24',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Đàm phán và thuyết phục khách hàng',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 25000.0,
          unit: 'Người',
          startDate: '2024-06-01',
          endDate: '2024-07-22',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tư vấn chuyển đổi dịch vụ',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(tylechuyendoikhachhang[0]._id),
          target: 3500.0,
          unit: 'Cuộc gọi',
          startDate: '2024-06-01',
          endDate: '2024-07-30',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Quản trị dự án',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhA[0]._id),
      name: 'Quản trị dự án',
      creator: new ObjectId(truongboPhanKinhDoanhA[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Xác định quy mô dự án',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 60000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tạo và quản lý danh sách',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 700.0,
          unit: 'Báo cáo',
          startDate: '2024-06-01',
          endDate: '2024-08-08',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Quản trị dự án',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhB[0]._id),
      name: 'Quản trị dự án',
      creator: new ObjectId(truongboPhanKinhDoanhB[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Xác định quy mô dự án',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 60000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tạo và quản lý danh sách',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 700.0,
          unit: 'Báo cáo',
          startDate: '2024-06-01',
          endDate: '2024-08-08',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
    {
      type: 'Quản trị dự án',
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
      organizationalUnit: new ObjectId(boPhanKinhDoanhC[0]._id),
      name: 'Quản trị dự án',
      creator: new ObjectId(truongboPhanKinhDoanhC[0]._id),
      description: '<p>Mô tả mẫu </p>',
      formula: 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      listMappingTask: [
        {
          taskName: 'Xác định quy mô dự án',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(doanhthu[0]._id),
          target: 60000.0,
          unit: 'USD',
          startDate: '2024-06-01',
          endDate: '2024-07-25',
          durations: 180,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
        {
          taskName: 'Tạo và quản lý danh sách',
          taskDescription: '',
          organizationalUnitKpi: new ObjectId(soluongkhachhangmoi[0]._id),
          target: 700.0,
          unit: 'Báo cáo',
          startDate: '2024-06-01',
          endDate: '2024-08-08',
          durations: 300,
          factor: {
            company: Math.floor(Math.random() * 5) + 1,
            contract: Math.floor(Math.random() * 5) + 1,
            document: Math.floor(Math.random() * 5) + 1,
            event: Math.floor(Math.random() * 5) + 1,
            online: Math.floor(Math.random() * 5) + 1,
            newCustomer: Math.floor(Math.random() * 5) + 1,
            outdoor: Math.floor(Math.random() * 5) + 1,
            sales: Math.floor(Math.random() * 5) + 1,
          },
        },
      ],
    },
  ]);

  const vnist = await Company(systemDB).findOne({
    shortName: 'vnist',
  });

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU BẰNG CẤP
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  const listMajors = await Major(vnistDB).insertMany([
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
  ]);

  /*---------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------
            TẠO DỮ LIỆU CHỨNG CHỈ
        -----------------------------------------------------------------------------------------------
        ----------------------------------------------------------------------------------------------- */

  const listCertificates = await Certificate(vnistDB).insertMany([
    {
      name: 'Six Sigma',
      abbreviation: 'SS',
      score: 5,
      description: 'SS',
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
      name: 'Project Management Professional (PMP)',
      abbreviation: 'PMP',
      score: 5,
      description: 'PMP',
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
      name: 'Trần Thành Long',
      email: 'ttl.vnist@gmail.com',
    },
    {
      name: 'Chu Việt Kiên',
      email: 'cvk.vnist@gmail.com',
    },
    {
      name: 'Lương Phúc Quang',
      email: 'lpq.vnist@gmail.com',
    },
    {
      name: 'Dương Đức Huy',
      email: 'ddh.vnist@gmail.com',
    },
    {
      name: 'Vũ Đức Duy',
      email: 'vdd.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Hồ Tấn Tài',
      email: 'nhtt.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Cao Kỳ',
      email: 'nck.vnist@gmail.com',
    },
    {
      name: 'Bùi Khánh Hoàng',
      email: 'bkh.vnist@gmail.com',
    },
    {
      name: 'Trần Thị Phương',
      email: 'ttp.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Lê Sơn',
      email: 'nls.vnist@gmail.com',
    },
    {
      name: 'Dương Minh Phúc',
      email: 'dmp.vnist@gmail.com',
    },
    {
      name: 'Trần Hữu Hiến',
      email: 'thh.vnist@gmail.com',
    },
    {
      name: 'Phạm Công Hào',
      email: 'pch.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Duy Quang',
      email: 'ndq.vnist@gmail.com',
    },
    {
      name: 'Hoàng Trường Nam',
      email: 'htn.vnist@gmail.com',
    },
    {
      name: 'Phạm Thành Nam',
      email: 'ptn.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Văn Nhâm',
      email: 'nvn.vnist@gmail.com',
    },
    {
      name: 'Lê Hữu Tài',
      email: 'lht.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Văn Nam',
      email: 'nvn.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Tài Khoa',
      email: 'ntk.vnist@gmail.com',
    },
    {
      name: 'Phạm Hiểu Phương',
      email: 'php.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Hải Phong',
      email: 'nhp.vnist@gmail.com',
    },
    {
      name: 'Đào Nguyễn Huy Hoàng',
      email: 'dnhh.vnist@gmail.com',
    },
    {
      name: 'Liễu Nhật Minh',
      email: 'lnm.vnist@gmail.com',
    },
    {
      name: 'Lê Minh Hiếu',
      email: 'lmh.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Cao Kỳ',
      email: 'nck.vnist@gmail.com',
    },
    {
      name: 'Đàm Minh Hải',
      email: 'dmh.vnist@gmail.com',
    },
    {
      name: 'Đỗ Hồng Quân',
      email: 'dhq.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Mạnh Hiếu',
      email: 'nmh.vnist@gmail.com',
    },
    {
      name: 'Đào Sỹ Phúc',
      email: 'dsp.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Hồ Tấn Tài',
      email: 'nhtt.vnist@gmail.com',
    },
    {
      name: 'Đinh Đức Mạnh',
      email: 'ddm.vnist@gmail.com',
    },
    {
      name: 'Lê Phương Nam',
      email: 'lpn.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Lê Quý Dương',
      email: 'nlqd.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Xuân Hưng',
      email: 'nxh.vnist@gmail.com',
    },
    {
      name: 'Chu Anh Lợi',
      email: 'cal.vnist@gmail.com',
    },
    {
      name: 'Lê Đức Huy',
      email: 'ldh.vnist@gmail.com',
    },
    {
      name: 'Hoàng Đức Dương',
      email: 'hdd.vnist@gmail.com',
    },
    {
      name: 'Vũ Đình Linh',
      email: 'vdl.vnist@gmail.com',
    },
    {
      name: 'Hoàng Nhật Minh',
      email: 'hnm.vnist@gmail.com',
    },
    {
      name: 'Nguyễn Hữu Minh',
      email: 'nhm.vnist@gmail.com',
    },
    {
      name: 'Đoàn Quang Minh',
      email: 'dqm.vnist@gmail.com',
    },
    {
      name: 'Đỗ Nguyễn Hải Nam',
      email: 'dnhn.vnist@gmail.com',
    },
    {
      name: 'Đỗ Quang Phúc',
      email: 'dqp.vnist@gmail.com',
    },
    {
      name: 'Phạm Thành Nam',
      email: 'ptn.vnist@gmail.com',
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
          major: listMajors[Math.floor(Math.random() * listMajors.length)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: 'good',
        },
        {
          name: 'Bằng tốt nghiệp',
          issuedBy: 'Đại học Khoa Học Tự Nhiên',
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: listMajors[Math.floor(Math.random() * listMajors.length)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: 'good',
        },
      ],
      certificates: [
        {
          certificate: listCertificates[Math.floor(Math.random() * listCertificates.length)]._id,
          name: 'PHP',
          issuedBy: 'Hà Nội',
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-10-25`),
        },
        {
          certificate: listCertificates[Math.floor(Math.random() * listCertificates.length)]._id,
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

  /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU CẤU HÌNH GIẢI THUẬT CHO GIẢI THUẬT PHÂN BỔ KPI
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo cấu hình giải thuật cho giải thuật phân bổ KPI');

  await AllocationConfigSetting(vnistDB).create({
    company: vnist._id,
    numberGeneration: 200,
    solutionSize: 50,
    isAutomatically: true,
    defaultSetting: {
      numberGeneration: 200,
      solutionSize: 50,
      isAutomatically: true,
    },
  });

  console.log('Khởi tạo xong cấu hình giải thuật cho giải thuật phân bổ KPI');

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
