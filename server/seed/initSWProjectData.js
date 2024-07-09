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
  Project,
  // TaskTag,
  Capacity,
  AssetType,
  Asset

} = require("../models");



require("dotenv").config();


const initSWProjectData = async () => {
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
    if (!db.models.Project) Project(db);

    // 
    if (!db.models.Capacity) Capacity(db)
    // if (!db.models.TaskTag) TaskTag(db)

    console.log("models_list", db.models);
  };

  initModels(vnistDB);
  initModels(systemDB);

  console.log("Kết nối thành công!!!")

  // 1: Tech leader
  const sw_NguyenVanMinh = await Employee(vnistDB).findOne({
    fullName: "Nguyễn Văn Minh"
  })
  const sw_NguyenVanMinh_User = await User(vnistDB).findOne({
    name: "Nguyễn Văn Minh"
  })
  // console.log("sw_NguyenVanMinh_User: ", sw_NguyenVanMinh_User.name, sw_NguyenVanMinh_User._id, sw_NguyenVanMinh_User.email)

  // 2: Middle
  const sw_NguyenVanBien = await Employee(vnistDB).findOne({
    fullName: "Nguyễn Văn Biển"
  })

  const sw_NguyenVanBien_User = await User(vnistDB).findOne({
    name: "Nguyễn Văn Biển"
  })
  // console.log("sw_NguyenVanBien_User: ", sw_NguyenVanBien_User.name, sw_NguyenVanBien_User._id, sw_NguyenVanBien_User.email)



  // 3: Junior
  const sw_NguyenVietDang = await Employee(vnistDB).findOne({
    fullName: "Nguyễn Viết Đang"
  })

  const sw_NguyenVietDang_User = await User(vnistDB).findOne({
    name: "Nguyễn Viết Đang"
  })
  // console.log("sw_NguyenVietDang_User: ", sw_NguyenVietDang_User.name, sw_NguyenVietDang_User._id, sw_NguyenVietDang_User.email)


  // 7: Junior
  const sw_NguyenPhucNhatNam = await Employee(vnistDB).findOne({
    fullName: "Nguyễn Phúc Nhật Nam"
  })

  const sw_NguyenPhucNhatNam_User = await User(vnistDB).findOne({
    name: "Nguyễn Phúc Nhật Nam"
  })
  // console.log("sw_NguyenPhucNhatNam_User: ", sw_NguyenPhucNhatNam_User.name, sw_NguyenPhucNhatNam_User._id, sw_NguyenPhucNhatNam_User.email)
  

  // 5: Tester
  const sw_NguyenThiOanh = await Employee(vnistDB).findOne({
    employeeNumber: "MS202405"
  })

  const sw_NguyenThiOanh_User = await User(vnistDB).findOne({
    email: "nguyenthioanh.vnist@gmail.com"
  })
  // console.log("sw_NguyenThiOanh_User: ", sw_NguyenThiOanh_User.name, sw_NguyenThiOanh_User._id, sw_NguyenThiOanh_User.email)

  // 6: BA
  const sw_VuThiQuynh = await Employee(vnistDB).findOne({
    fullName: "Vũ Thị Quỳnh"
  })

  const sw_VuThiQuynh_User = await User(vnistDB).findOne({
    name: "Vũ Thị Quỳnh"
  })
  // console.log("sw_VuThiQuynh_User: ", sw_VuThiQuynh_User.name, sw_VuThiQuynh_User._id, sw_VuThiQuynh_User.email)

  // 4: Fresher
  const sw_NguyenMinhThanh = await Employee(vnistDB).findOne({
    fullName: "Nguyễn Minh Thành",
  })

  const sw_NguyenMinhThanh_User = await User(vnistDB).findOne({
    name: "Nguyễn Minh Thành",
    email: "nguyenminhthanhsw.vnist@gmail.com"
  })
  // console.log("sw_NguyenMinhThanh_User: ", sw_NguyenMinhThanh_User.name, sw_NguyenMinhThanh_User._id, sw_NguyenMinhThanh_User.email)

  // 8: Fresher
  const sw_DangQuocTu = await Employee(vnistDB).findOne({
    fullName: "Đặng Quốc Tú"
  })

  const sw_DangQuocTu_User = await User(vnistDB).findOne({
    name: "Đặng Quốc Tú"
  })
  // console.log("sw_DangQuocTu_User: ", sw_DangQuocTu_User.name, sw_DangQuocTu_User._id, sw_DangQuocTu_User.email)

  // console.log(sw_NguyenVanMinh.fullName, sw_NguyenVanMinh.emailInCompany)
  // console.log(sw_NguyenVanBien.fullName, sw_NguyenVanBien.emailInCompany)
  // console.log(sw_NguyenVietDang.fullName, sw_NguyenVietDang.emailInCompany)
  // console.log(sw_NguyenPhucNhatNam.fullName, sw_NguyenPhucNhatNam.emailInCompany)
  // console.log(sw_NguyenThiOanh.fullName, sw_NguyenThiOanh.emailInCompany)
  // console.log(sw_VuThiQuynh.fullName, sw_VuThiQuynh.emailInCompany)
  // console.log(sw_NguyenMinhThanh.fullName, sw_NguyenMinhThanh.emailInCompany)
  // console.log(sw_DangQuocTu.fullName, sw_DangQuocTu.emailInCompany)

  const allTasksInPast = [
    // Task 1
    {
      id: 1,
      name: "Phân tích quy trình nghiệp vụ khám bệnh",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-10T03:00:00.000Z'),
      endDate: new Date('2024-06-17T10:00:00.000Z'),
      tags: ['analysis'],
      requireAssignee: {
        year_of_exp: 2,
        english: 2,
      },
      assignee: sw_NguyenVanMinh._id,
      estimateNormalTime: 6.75,
      point: 0.9,
      taskLq: "Task 1 of data phan bo"
    },

    {
      id: 2,
      name: "Phân tích quá trình nhập kho",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-13T06:00:00.000Z'),
      endDate: new Date('2024-06-16T10:00:00.000Z'),
      tags: ['analysis'],
      // requireAsset: ,
      requireAssignee: {
        year_of_exp: 1,
        english: 2,
      },
      assignee: sw_NguyenVanBien._id,
      estimateNormalTime: 3.5,
      point: 0.96,
      taskLq: "Task 1 of data phan bo"
    },

    {
      id: 3,
      name: "Phân tích tính khả thi dự án",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-13T01:00:00.000Z'),
      endDate: new Date('2024-06-17T03:00:00.000Z'),
      tags: ['analysis'],
      // requireAsset: ,
      requireAssignee: {
        year_of_exp: 2,
        english: 2,
      },
      assignee: sw_NguyenVietDang._id,
      estimateNormalTime: 4.25,
      point: 0.85,
      taskLq: "Task 1 of data phan bo"
    },

    {
      id: 4,
      name: "Phân tích và tư vấn mua hàng cho KH",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-28T01:00:00.000Z'),
      endDate: new Date('2024-07-02T03:00:00.000Z'),
      tags: ['analysis'],
      // requireAsset: ,
      requireAssignee: {
        year_of_exp: 2,
        english: 2,
      },
      assignee: sw_NguyenThiOanh._id,
      estimateNormalTime: 5.25,
      point: 0.75,
      taskLq: "Task 1 of data phan bo"
    },

    {
      id: 5,
      name: "Phân tích quy trình nhập kho",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-09T01:00:00.000Z'),
      endDate: new Date('2024-06-12T10:00:00.000Z'),
      tags: ['analysis'],
      // requireAsset: ,
      requireAssignee: {
        year_of_exp: 2,
        english: 2,
      },
      assignee: sw_NguyenPhucNhatNam._id,
      estimateNormalTime: 4,
      point: -1,
      taskLq: "Task 1 of data phan bo"
    },

    {
      id: 6,
      name: "Phân tích nhu cầu học tiếng Anh",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-09T01:00:00.000Z'),
      endDate: new Date('2024-06-12T10:00:00.000Z'),
      tags: ['analysis'],
      // requireAsset: ,
      requireAssignee: {
        year_of_exp: 2,
        english: 2,
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.95,
      taskLq: "Task 1 of data phan bo"
    },

    // Task 2: backend, frontend
    {
      id: 7,
      name: "Viết Code base Java-Angular",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-18T01:00:00.000Z'),
      endDate: new Date('2024-06-24T07:00:00.000Z'),
      tags: ['backend', 'frontend'],
      estimateNormalTime: 6.75,
      // requireAsset: ,
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        frontend: 1,
        docker: 1
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.9,
      taskLq: "Task 2 of data phan bo"
    },

    {
      id: 8,
      name: "Dựng code base Laravel-React",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-23T06:00:00.000Z'),
      endDate: new Date('2024-06-29T10:00:00.000Z'),
      tags: ['backend', 'frontend'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        frontend: 1,
        docker: 1
      },
      assignee: sw_NguyenVanBien._id,
      estimateNormalTime: 6.5,
      point: 0.95,
      taskLq: "Task 2 of data phan bo"
    },

    {
      id: 9,
      name: "Dựng code base NodeJS-React",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-22T03:00:00.000Z'),
      endDate: new Date('2024-06-29T05:00:00.000Z'),
      tags: ['backend', 'frontend'],
      requireAssignee: {
        // year_of_exp: 1,
        backend: 2,
        frontend: 1,
        docker: 1
      },
      assignee: sw_NguyenVietDang._id,
      estimateNormalTime: 7.25,
      point: 0.95,
      taskLq: "Task 2 of data phan bo"
    },

    {
      id: 10,
      name: "Dựng code base NestJS-React",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-05T01:00:00.000Z'),
      endDate: new Date('2024-07-11T10:00:00.000Z'),
      tags: ['backend', 'frontend'],
      requireAssignee: {
        // year_of_exp: 1,
        backend: 2,
        frontend: 1,
        docker: 1
      },
      assignee: sw_NguyenMinhThanh._id,
      estimateNormalTime: 6.5,
      point: 0.9,
      taskLq: "Task 2 of data phan bo"
    },
    // {
    //   id: 11,
    //   name: "Dựng code base Laravel-VueJS",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['backend', 'frontend'],
    //   requireAssignee: {
    //     // year_of_exp: 1,
    //     backend: 2,
    //     frontend: 1,
    //     docker: 1
    //   },
    //  assignee: sw_DangQuocTu._id,
    //   point: -1
    // },


    // => 7 theo 4


    // Task 3
    {
      id: 12,
      name: "Dựng trang homepage",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-24T07:00:00.000Z'),
      endDate: new Date('2024-06-27T07:00:00.000Z'),
      estimateNormalTime: 3,
      tags: ['frontend'],
      requireAssignee: {
        degree: 2,
        frontend: 2,
        year_of_exp: 1
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.95,
      taskLq: "Task 3 of data phan bo"
    },
    {
      id: 13,
      name: "Dựng trang landingpage",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-20T02:00:00.000Z'),
      endDate: new Date('2024-06-23T05:00:00.000Z'),
      estimateNormalTime: 3.375,
      tags: ['frontend'],
      requireAssignee: {
        degree: 2,
        frontend: 2,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.9,
      taskLq: "Task 3 of data phan bo"
    },
    {
      id: 14,
      name: "Dựng trang chủ phía khách",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-13T01:00:00.000Z'),
      endDate: new Date('2024-06-15T05:00:00.000Z'),
      estimateNormalTime: 2.5,
      tags: ['frontend'],
      requireAssignee: {
        degree: 2,
        frontend: 2,
      },
      assignee: sw_NguyenPhucNhatNam._id,
      point: -1, // For 3 and 16
      taskLq: "Task 3 of data phan bo"
    },
    {
      id: 15,
      name: "Dựng trang chủ, thống kê phía admin",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-12T01:00:00.000Z'),
      endDate: new Date('2024-07-18T05:00:00.000Z'),
      estimateNormalTime: 6.5,
      tags: ['frontend'],
      requireAssignee: {
        degree: 2,
        frontend: 2,
      },
      assignee: sw_NguyenMinhThanh._id,
      point: 0.8,
      taskLq: "Task 3 of data phan bo"
    },
    // {
    //   id: 16,
    //   name: "Dựng trang chủ admin",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['frontend'],
    //   requireAssignee: {
    //     degree: 2,
    //     frontend: 2,
    //   },
    //   assignee: sw_NguyenThiOanh._id,
    //   point: -1
    // },

    // {
    //   id: 17,
    //   name: "Dựng trang chủ admin",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['frontend'],
    //   requireAssignee: {
    //     degree: 2,
    //     frontend: 2,
    //   },
    //   assignee: sw_NguyenThiOanh._id,
    //   point: -1
    // },

    //

    // Task 4, 16
    {
      id: 18,
      name: "Dựng giao diện module quản lý thầu",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-02T01:00:00.000Z'),
      endDate: new Date('2024-07-08T05:00:00.000Z'),
      estimateNormalTime: 6.5,
      tags: ['frontend'],
      requireAssignee: {
        year_of_exp: 1,
        backend: 1,
        frontend: 2,
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.9,
      taskLq: "Task 4 of data phan bo"
    },
    {
      id: 19,
      name: "Dựng giao diện module quản lý nhân sự",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-05T06:00:00.000Z'),
      endDate: new Date('2024-07-09T07:00:00.000Z'),
      estimateNormalTime: 4.125,
      tags: ['frontend'],
      requireAssignee: {
        degree: 1,
        year_of_exp: 1,
        backend: 1,
        frontend: 2,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.9,
      taskLq: "Task 4 of data phan bo"
    },
    {
      id: 20,
      name: "Dựng giao diện module quản lý phòng ban",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-15T06:00:00.000Z'),
      endDate: new Date('2024-06-21T10:00:00.000Z'),
      estimateNormalTime: 6.5,
      tags: ['frontend'],
      requireAssignee: {
        degree: 1,
        year_of_exp: 1,
        backend: 1,
        frontend: 2,
      },
      assignee: sw_NguyenPhucNhatNam._id,
      point: 0.85,
      taskLq: "Task 4 of data phan bo"
    },
    {
      id: 21,
      name: "Dựng giao diện thống kê nhân sự",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-03T06:00:00.000Z'),
      endDate: new Date('2024-07-06T08:00:00.000Z'),
      estimateNormalTime: 3.25,
      tags: ['frontend'],
      requireAssignee: {
        year_of_exp: 1,
        backend: 1,
        frontend: 2,
      },
      assignee: sw_DangQuocTu._id,
      point: 0.8,
      taskLq: "Task 4 of data phan bo"
    },
    // 3, 4 tự theo 8

    // Task 5
    {
      id: 22,
      name: "Triển khai ứng dụng ở heroku",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-09T06:00:00.000Z'),
      endDate: new Date('2024-07-15T05:00:00.000Z'),
      estimateNormalTime: 6,
      tags: ['devops'],
      requireAssignee: {
        year_of_exp: 1,
        docker: 2,
        ci_cd: 2,
      },
      assignee: sw_NguyenPhucNhatNam._id,
      point: 0.8,
      taskLq: "Task 5 of data phan bo"
    },
    {
      id: 23,
      name: "Triển khai module đấu thầu",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-09T07:00:00.000Z'),
      endDate: new Date('2024-07-13T10:00:00.000Z'),
      estimateNormalTime: 4.375,
      tags: ['devops'],
      requireAssignee: {
        year_of_exp: 1,
        docker: 2,
        ci_cd: 2,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.9,
      taskLq: "Task 5 of data phan bo"
    },
    {
      id: 24,
      name: "Triển khai module thanh toán",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-17T03:00:00.000Z'),
      endDate: new Date('2024-07-22T05:00:00.000Z'),
      estimateNormalTime: 5.25,
      tags: ['devops'],
      requireAssignee: {
        year_of_exp: 1,
        docker: 2,
        ci_cd: 2,
        backend: 1
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.9,
      taskLq: "Task 5 of data phan bo"
    },
    // 1 theo 7

    // Task 6
    // {
    //   id: 25,
    //   name: "Tạo kế hoạch kiểm thử cho module bán hàng",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['testing'],
    //   requireAssignee: {
    //     manual_test: 2,
    //     unit_test: 1
    //   },
    //  assignee: sw_NguyenMinhThanh._id,
    //   point: -1
    // },
    // {
    //   id: 26,
    //   name: "Tạo kế hoạch kiểm thử cho module bán hàng",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['testing'],
    //   requireAssignee: {
    //     manual_test: 2,
    //     unit_test: 1
    //   },
    //  assignee: sw_NguyenMinhThanh._id,
    //   point: -1
    // },
    {
      id: 27,
      name: "Tạo kế hoạch kiểm thử đơn vị",
      status: "finished",
      project: "",
      startDate: new Date('2024-02-07T03:00:00.000Z'),
      endDate: new Date('2024-07-07T03:00:00.000Z'),
      estimateNormalTime: 5,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 2,
        unit_test: 1,
        automation_test: 1
      },
      assignee: sw_NguyenThiOanh._id,
      point: 0.95,
      taskLq: "Task 6 of data phan bo"
    },
    {
      id: 28,
      name: "Tạo kế hoạch kiểm thử tích hợp",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-27T06:00:00.000Z'),
      endDate: new Date('2024-07-01T10:00:00.000Z'),
      estimateNormalTime: 4.5,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 2,
        unit_test: 1,
        // automation_test: 1
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.9,
      taskLq: "Task 6 of data phan bo"
    },

    // Task 7
    {
      id: 29,
      name: "Kiểm thử chức năng nhập kho",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-02T07:00:00.000Z'),
      endDate: new Date('2024-07-04T10:00:00.000Z'),
      estimateNormalTime: 2.375,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 1,
        unit_test: 2,
        automation_test: 1
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.9,
      taskLq: "Task 7 of data phan bo"
    },
    {
      id: 30,
      name: "Kiểm thử tính năng đồng bộ dữ liệu",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-22T01:00:00.000Z'),
      endDate: new Date('2024-06-25T10:00:00.000Z'),
      estimateNormalTime: 4,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 1,
        unit_test: 2,
        automation_test: 1
      },
      assignee: sw_NguyenPhucNhatNam._id,
      point: 0.9,
      taskLq: "Task 7 of data phan bo"
    },
    {
      id: 31,
      name: "Kiểm thử tính năng thêm vào giỏ",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-07T03:00:00.000Z'),
      endDate: new Date('2024-07-09T05:00:00.000Z'),
      estimateNormalTime: 2.25,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 1,
        unit_test: 1,
        automation_test: 1
      },
      assignee: sw_NguyenThiOanh._id,
      point: 0.95,
      taskLq: "Task 7 of data phan bo"
    },
    {
      id: 32,
      name: "Kiểm thử luồng quản lý tài liệu",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-19T03:00:00.000Z'),
      endDate: new Date('2024-07-21T10:00:00.000Z'),
      estimateNormalTime: 2.75,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 1,
        unit_test: 1,
        automation_test: 1
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.8,
      taskLq: "Task 7 of data phan bo"
    },
    {
      id: 33,
      name: "Kiểm thử tính năng Thêm chứng chỉ",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-04T01:00:00.000Z'),
      endDate: new Date('2024-07-05T05:00:00.000Z'),
      estimateNormalTime: 1.5,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 1,
        unit_test: 1,
        automation_test: 1
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.8,
      taskLq: "Task 7 of data phan bo"

    },
    {
      id: 34,
      name: "Kiểm thử tính năng Sửa chứng chỉ",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-25T01:00:00.000Z'),
      endDate: new Date('2024-06-29T10:00:00.000Z'),
      estimateNormalTime: 5,
      tags: ['testing'],
      requireAssignee: {
        manual_test: 1,
        unit_test: 1,
        automation_test: 1
      },
      assignee: sw_DangQuocTu._id,
      point: 0.75,
      taskLq: "Task 7 of data phan bo"
    },
    // 2, 4 tương tự

    // Task 8: Yêu cầu gần giống task 2, tương tự với 1, 2, 3, 4
    {
      id: 35,
      name: "Sửa lỗi module quản lý lịch đặt khách sạn",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-27T01:00:00.000Z'),
      endDate: new Date('2024-07-02T03:00:00.000Z'),
      estimateNormalTime: 5.5,
      tags: ['frontend', 'backend'],
      requireAssignee: {
        year_of_exp: 1,
        backend: 2,
        frontend: 1,
        // docker: 1
      },
      assignee: sw_NguyenPhucNhatNam._id,
      point: 0.9,
      taskLq: "Task 8 of data phan bo"

    },

    {
      id: 36,
      name: "Sửa lỗi module quản lý phòng khách sạn",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-14T01:00:00.000Z'),
      endDate: new Date('2024-07-19T05:00:00.000Z'),
      estimateNormalTime: 5.5,
      tags: ['frontend', 'backend'],
      requireAssignee: {
        year_of_exp: 1,
        backend: 2,
        frontend: 1,
        // docker: 1
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.9,
      taskLq: "Task 8 of data phan bo"

    },

    // Task 9
    // {
    //   id: 35,
    //   name: "Viết tài liệu kiểm module quản lý sách",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['testing'],
    //   requireAssignee: {
    //     degree: 2,
    //     unit_test: 2,
    //     year_of_exp: 1
    //     // frontend: 1,
    //     // docker: 1
    //   },
    //  assignee: sw_NguyenPhucNhatNam._id,
    //   point: -1
    // },
    {
      id: 37,
      name: "Viết kịch bản kiểm thử cho luồng thanh toán",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-09T06:00:00.000Z'),
      endDate: new Date('2024-07-12T10:00:00.000Z'),
      estimateNormalTime: 3.5,
      tags: ['testing'],
      requireAssignee: {
        degree: 2,
        unit_test: 2,
        year_of_exp: 1
      },
      assignee: sw_NguyenThiOanh._id,
      point: 0.95,
      taskLq: "Task 9 of data phan bo"
    },
    {
      id: 38,
      name: "Viết kịch bản kiểm thử cho luồng đặt hàng",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-02T01:00:00.000Z'),
      endDate: new Date('2024-07-04T01:00:00.000Z'),
      tags: ['testing'],
      estimateNormalTime: 2,
      requireAssignee: {
        degree: 2,
        unit_test: 2,
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.95,
      taskLq: "Task 9 of data phan bo"

    },
    {
      id: 39,
      name: "Viết kịch bản kiểm thử cho luồng nhập kho",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-18T05:00:00.000Z'),
      endDate: new Date('2024-06-24T10:00:00.000Z'),
      estimateNormalTime: 6.5,
      tags: ['testing'],
      requireAssignee: {
        degree: 2,
        unit_test: 2,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.9,
      taskLq: "Task 9 of data phan bo"
    },
    {
      id: 40,
      name: "Viết kịch bản kiểm thử cho luồng xuất kho",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-30T01:00:00.000Z'),
      endDate: new Date('2024-07-03T05:00:00.000Z'),
      estimateNormalTime: 3.5,
      tags: ['testing'],
      requireAssignee: {
        degree: 2,
        unit_test: 2,
      },
      assignee: sw_DangQuocTu._id,
      point: 0.8,
      taskLq: "Task 9 of data phan bo"

    },
    // 2, 7, 4, 8, 5, 6 tương tự

    // Task 10: 1, 2, 6
    {
      id: 41,
      name: "Lập kế hoạch cho dự án DCMA",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-30T01:00:00.000Z'),
      endDate: new Date('2024-07-02T01:00:00.000Z'),
      estimateNormalTime: 2,
      tags: ['planning'],
      requireAssignee: {
        degree: 2,
        year_of_exp: 3,
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.9,
      taskLq: "Task 10 of data phan bo"

    },
    {
      id: 42,
      name: "Lập kế hoạch cho dự án",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-20T01:00:00.000Z'),
      endDate: new Date('2024-06-24T05:00:00.000Z'),
      estimateNormalTime: 4.5,
      tags: ['planning'],
      requireAssignee: {
        degree: 2,
        year_of_exp: 3,
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.85,
      taskLq: "Task 10 of data phan bo"

    },

    // {
    //   id: 43,
    //   name: "Lên kế hoạch cho dự án",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['planning'],
    //   requireAssignee: {
    //     degree: 2,
    //     year_of_exp: 3,
    //   },
    //  assignee: sw_VuThiQuynh._id,
    //   point: 0.85,
    //   taskLq: "Task 10 of data phan bo"

    // },
    // {
    //   id: 44,
    //   name: "Lập kế hoạch tư vấn khách hàng",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['planning'],
    //   requireAssignee: {
    //     degree: 2,
    //     year_of_exp: 3,
    //   },
    //  assignee: sw_NguyenVietDang._id,
    //   point: -1
    // },

    // Task 11: 
    // {
    //   id: 45,
    //   name: "Thu thập phản hồi của khách hàng",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['collecting_data'],
    //   requireAssignee: {
    //     english: 5
    //   },
    //  assignee: sw_NguyenVietDang._id,
    //   point: -1
    // },
    {
      id: 46,
      name: "Thu thập phản hồi của đối tác",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-05T01:00:00.000Z'),
      endDate: new Date('2024-07-11T10:00:00.000Z'),
      estimateNormalTime: 7,
      tags: ['collecting_data'],
      requireAssignee: {
        english: 5,
        degree: 1
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.9,
      taskLq: "Task 11 of data phan bo"

    },
    {
      id: 47,
      name: "Thu thập phản hồi của người dùng",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-05T06:00:00.000Z'),
      endDate: new Date('2024-07-11T10:00:00.000Z'),
      estimateNormalTime: 6.5,
      tags: ['collecting_data'],
      requireAssignee: {
        english: 5,
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.95,
      taskLq: "Task 11 of data phan bo"

    },

    // Task 12
    {
      id: 48,
      name: "Điều chỉnh module quản lý thầu",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-21T01:00:00.000Z'),
      endDate: new Date('2024-07-25T05:00:00.000Z'),
      estimateNormalTime: 4.5,
      tags: ['backend', 'frontend'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        ci_cd: 2,
        frontend: 1,
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.95,
      taskLq: "Task 12 of data phan bo"

    },
    {
      id: 49,
      name: "Điều chỉnh module phân quyền",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-19T06:00:00.000Z'),
      endDate: new Date('2024-07-24T06:00:00.000Z'),
      estimateNormalTime: 7,
      tags: ['backend', 'frontend'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        ci_cd: 2,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.95,
      taskLq: "Task 12 of data phan bo"
    },
    {
      id: 50,
      name: "Điều chỉnh module quản lý nhân viên",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-12T01:00:00.000Z'),
      endDate: new Date('2024-07-17T03:00:00.000Z'),
      tags: ['backend', 'frontend'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        ci_cd: 2,
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.85,
      taskLq: "Task 12 of data phan bo"

    },
    // 7 tương tự 3
    // {
    //   id: 51,
    //   name: "Điều chỉnh chức năng tái phân bổ",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['backend', 'frontend'],
    //   requireAssignee: {
    //     year_of_exp: 2,
    //     backend: 2,
    //     ci_cd: 2,
    //   },
    //  assignee: sw_NguyenMinhThanh._id,
    //   point: -1
    // },

    // Task 13
    {
      id: 52,
      name: "Đề xuất chiến lược kinh doanh gạch lát",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-27T07:00:00.000Z'),
      endDate: new Date('2024-06-29T10:00:00.000Z'),
      estimateNormalTime: 2.375,
      tags: ['idea'],
      requireAssignee: {
        year_of_exp: 2,
        english: 3,
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.95,
      taskLq: "Task 13 of data phan bo"

    },
    {
      id: 53,
      name: "Đề xuất chiến lược mua hàng",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-17T01:00:00.000Z'),
      endDate: new Date('2024-06-20T02:00:00.000Z'),
      estimateNormalTime: 3.125,
      tags: ['idea'],
      requireAssignee: {
        year_of_exp: 2,
        english: 3,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.95,
      taskLq: "Task 13 of data phan bo"

    },
    {
      id: 54,
      name: "Đề xuất chiến lược kinh doanh trực tuyến",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-13T01:00:00.000Z'),
      endDate: new Date('2024-07-17T05:00:00.000Z'),
      estimateNormalTime: 4.5,
      tags: ['idea'],
      requireAssignee: {
        year_of_exp: 2,
        english: 3,
      },
      assignee: sw_NguyenThiOanh._id,
      point: 0.8,
      taskLq: "Task 13 of data phan bo"

    },

    {
      id: 55,
      name: "Đề xuất chiến lược nhập kho",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-18T01:00:00.000Z'),
      endDate: new Date('2024-06-22T03:00:00.000Z'),
      estimateNormalTime: 4.25,
      tags: ['idea'],
      requireAssignee: {
        year_of_exp: 2,
        english: 3,
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.9,
      taskLq: "Task 13 of data phan bo"

    },

    // Task 14
    {
      id: 56,
      name: "Lập tài liệu cuộc họp với khách hàng",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-17T06:00:00.000Z'),
      endDate: new Date('2024-07-20T06:00:00.000Z'),
      estimateNormalTime: 3,
      tags: ['document'],
      requireAssignee: {
        year_of_exp: 2,
        english: 5,
      },
      assignee: sw_NguyenThiOanh._id,
      point: 0.8,
      taskLq: "Task 14 of data phan bo"

    },
    {
      id: 57,
      name: "Lập tài liệu cuộc họp với đối tác",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-24T06:00:00.000Z'),
      endDate: new Date('2024-06-27T05:00:00.000Z'),
      estimateNormalTime: 3,
      tags: ['document'],
      requireAssignee: {
        year_of_exp: 2,
        english: 5,
      },
      assignee: sw_VuThiQuynh._id,
      point: 0.9,
      taskLq: "Task 14 of data phan bo"

    },

    // Task 15
    {
      id: 58,
      name: "Viết tài liệu công nghệ sử dụng",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-25T06:00:00.000Z'),
      endDate: new Date('2024-07-26T10:00:00.000Z'),
      estimateNormalTime: 1.5,
      tags: ['document'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        frontend: 2,
        docker: 2,
        ci_cd: 2
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.95,
      taskLq: "Task 15 of data phan bo"
    },
    {
      id: 59,
      name: "Viết tài liệu hướng dẫn cài đặt",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-24T06:00:00.000Z'),
      endDate: new Date('2024-07-26T10:00:00.000Z'),
      estimateNormalTime: 2.5,
      tags: ['document'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        frontend: 2,
        docker: 2,
        ci_cd: 2
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.95,
      taskLq: "Task 15 of data phan bo"
    },
    {
      id: 60,
      name: "Viết tài liệu triển khai",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-22T06:00:00.000Z'),
      endDate: new Date('2024-07-24T10:00:00.000Z'),
      estimateNormalTime: 2.5,
      tags: ['document'],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        frontend: 2,
        docker: 2,
        ci_cd: 2
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.9,
      taskLq: "Task 15 of data phan bo"

    },
    // {
    //   id: 61,
    //   name: "Viết tài liệu hướng dẫn cài đặt",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['document'],
    //   requireAssignee: {
    //     year_of_exp: 2,
    //     backend: 2,
    //     frontend: 2,
    //     docker: 1,
    //     ci_cd: 2
    //   },
    //  assignee: sw_DangQuocTu._id,
    //   point: -1
    // },
    // Task 16 tương tự

    // Task 17
    {
      id: 62,
      name: "Lập trình phía server module quản lý thầu",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-08T06:00:00.000Z'),
      endDate: new Date('2024-07-14T10:00:00.000Z'),
      estimateNormalTime: 6.5,
      tags: ['backend'],
      requireAssignee: {
        year_of_exp: 1,
        backend: 2,
        frontend: 2,
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.95,
      taskLq: "Task 17 of data phan bo"
    },
    {
      id: 63,
      name: "Lập trình phía server module quản lý sách",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-01T03:00:00.000Z'),
      endDate: new Date('2024-07-05T05:00:00.000Z'),
      estimateNormalTime: 4.25,
      tags: ['backend'],
      requireAssignee: {
        backend: 2,
        frontend: 2,
      },
      assignee: sw_NguyenVanBien._id,
      point: 0.95,
      taskLq: "Task 17 of data phan bo"
    },
    {
      id: 64,
      name: "Lập trình service phân quyền",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-29T07:00:00.000Z'),
      endDate: new Date('2024-07-02T07:00:00.000Z'),
      estimateNormalTime: 3,
      tags: ['backend'],
      requireAssignee: {
        backend: 2,
        frontend: 1,
      },
      assignee: sw_NguyenVietDang._id,
      point: 0.9,
      taskLq: "Task 17 of data phan bo"

    },

    // {
    //   id: 65,
    //   name: "Lập trình service chia tài sản",
    //   status: "finished",
    //   project: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   tags: ['backend'],
    //   requireAssignee: {
    //     backend: 2,
    //     frontend: 2,
    //   },
    //  assignee: sw_NguyenVietDang._id,
    //   point: 0.85
    // },
    {
      id: 66,
      name: "Lập trình service gán nguồn lực",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-30T01:00:00.000Z'),
      endDate: new Date('2024-07-03T05:00:00.000Z'),
      estimateNormalTime: 3.5,
      tags: ['backend'],
      requireAssignee: {
        backend: 2,
        frontend: 2,
      },
      assignee: sw_DangQuocTu._id,
      point: 0.85,
      taskLq: "Task 17 of data phan bo"

    },
    {
      id: 67,
      name: "Lập trình service module quản lý thẻ",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-18T06:00:00.000Z'),
      endDate: new Date('2024-07-22T06:00:00.000Z'),
      estimateNormalTime: 4,
      tags: ['backend'],
      requireAssignee: {
        backend: 2,
        frontend: 2,
      },
      assignee: sw_NguyenMinhThanh._id,
      point: -1,
      taskLq: "Task 17 of data phan bo"

    },

    // Task 18
    {
      id: 68,
      name: "Tách service quản lý thầu",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-15T01:00:00.000Z'),
      endDate: new Date('2024-07-19T02:00:00.000Z'),
      estimateNormalTime: 4.25,
      tags: ['frontend', 'backend'],
      requireAssignee: {
        backend: 2,
        frontend: 1,
        manual_test: 1
      },
      assignee: sw_NguyenVanMinh._id,
      point: 0.85,
      taskLq: "Task 18 of data phan bo"

    },
    {
      id: 69,
      name: "Lập trình micro-service module quản lý sách",
      status: "finished",
      project: "",
      startDate: new Date('2024-06-10T02:00:00.000Z'),
      endDate: new Date('2024-06-13T05:00:00.000Z'),
      estimateNormalTime: 3.375,
      tags: ['frontend', 'backend'],
      requireAssignee: {
        backend: 1,
        frontend: 2,
        manual_test: 1
      },
      assignee: sw_NguyenVanBien._id,
      point: -1,
      taskLq: "Task 18 of data phan bo"

    },
    {
      id: 70,
      name: "Lập trình micro-service module phân quyền",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-02T03:00:00.000Z'),
      endDate: new Date('2024-07-09T05:00:00.000Z'),
      estimateNormalTime: 7.25,
      tags: ['frontend', 'backend'],
      requireAssignee: {
        backend: 1,
        frontend: 2,
        manual_test: 1
      },
      assignee: sw_NguyenPhucNhatNam._id,
      point: -1,
      taskLq: "Task 18 of data phan bo"

    },
    
    {
      id: 71,
      name: "Lập trình service kết nối database",
      status: "finished",
      project: "",
      startDate: new Date('2024-07-06T08:00:00.000Z'),
      endDate: new Date('2024-07-12T08:00:00.000Z'),
      estimateNormalTime: 6,
      tags: ['backend', 'frontend'],
      requireAssignee: {
        backend: 1,
        frontend: 2,
        manual_test: 1
      },
      assignee: sw_DangQuocTu._id,
      point: 0.85,
      taskLq: "Task 18 of data phan bo"
    },
  ]

  console.log("allTasksInPast: ", allTasksInPast?.length)


  const existingTasksInPast = await Task(vnistDB).find({ status: "finished" }, { name: 1, _id: 0 });
  const existingTaskNamesInPast = new Set(existingTasksInPast.map(task => task.name));

  // Step 2: Filter new tasks to exclude those with existing names
  const filteredTasksInPast = allTasksInPast.filter(task => !existingTaskNamesInPast.has(task.name));

  // Step 3: Insert the filtered tasks into the database
  if (filteredTasksInPast?.length > 0) {
    const allTaskInPastInDB = await Task(vnistDB).insertMany(filteredTasksInPast);
    console.log(`Inserted ${filteredTasksInPast.length} new tasks In Past.`);
  } else {
    console.log('No new tasks In Past to insert.');
  }
  // const allTaskInPastInDB = await Task(vnistDB).insertMany([...allTasksInPast])
  // console.log(`Inserted ${allTaskInPastInDB.length} new tasks In Past.`);

  // Seed Task Outof Project
  const allTasksOutOfProject = [
    // 1
    {
      id: 1,
      project: "",
      name: "Phân tích nhu cầu học ngoại ngữ của sinh viên",
      startDate: new Date('2024-07-27T08:00:00.000Z'),
      endDate: new Date('2024-08-01T04:00:00.000Z'),
      requireAssignee: {
        english: 3,
        year_of_exp: 2,
      },
      requireAsset: [],
      estimateNormalTime: 4.5,
      assignee: sw_NguyenVanMinh._id
    },

    // {
    //   id: 2,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-24T06:00:00.000Z'),
    //   endDate: new Date('2024-09-24T10:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenVanMinh._id
    // },
    {
      id: 3,
      project: "",
      name: "Phân tích yêu cầu sắp xếp lịch giảng dạy",
      startDate: new Date('2024-09-30T08:00:00.000Z'),
      endDate: new Date('2024-10-03T10:00:00.000Z'),
      estimateNormalTime: 3.25,
      requireAssignee: {english:3,year_of_exp:2},
      requireAsset: [],
      assignee: sw_NguyenVanMinh._id
    },
    {
      id: 4,
      project: "",
      name: "Lập kế hoạch cho dự án SSLG",
      startDate: new Date('2024-10-04T01:00:00.000Z'),
      endDate: new Date('2024-10-06T10:00:00.000Z'),
      estimateNormalTime: 3,
      requireAssignee: {year_of_exp:2, degree:2},
      requireAsset: [],
      assignee: sw_NguyenVanMinh._id
    },

    //2
    {
      id: 5,
      project: "",
      name: "Dựng code base Java core",
      startDate: new Date('2024-07-27T02:00:00.000Z'),
      endDate: new Date('2024-08-01T10:00:00.000Z'),
      requireAssignee: {year_of_exp:2,backend:2,frontend:2,docker:1},
      requireAsset: [],
      estimateNormalTime: 5.875,
      assignee: sw_NguyenVanBien._id
    },
    {
      id: 6,
      project: "",
      name: "Sửa lỗi chức năng Thêm vào giỏ",
      startDate: new Date('2024-08-02T01:00:00.000Z'),
      endDate: new Date('2024-08-03T08:00:00.000Z'),
      requireAssignee: {year_of_exp:2,backend:2,frontend:1},
      requireAsset: [],
      estimateNormalTime: 1.75,
      assignee: sw_NguyenVanBien._id
    },
    {
      id: 7,
      project: "",
      name: "Triển khai module quản lý thầu lên server",
      startDate: new Date('2024-08-03T08:00:00.000Z'),
      endDate: new Date('2024-08-08T10:00:00.000Z'),
      requireAssignee: {year_of_exp:1,docker:2,ci_cd:2},
      estimateNormalTime: 5.25,
      requireAsset: [],
      assignee: sw_NguyenVanBien._id
    },
    {
      id: 8,
      project: "",
      name: "Dựng trang giới thiệu sản phẩm",
      startDate: new Date('2024-09-24T06:00:00.000Z'),
      endDate: new Date('2024-09-24T10:00:00.000Z'),
      estimateNormalTime: 0.5,
      requireAssignee: {degree:2,frontend:2},
      requireAsset: [],
      assignee: sw_NguyenVanBien._id
    },

    //3: NguyenVietDang
    {
      id: 9,
      project: "",
      name: "Dựng giao diện module mua hàng",
      startDate: new Date('2024-07-27T01:00:00.000Z'),
      endDate: new Date('2024-08-01T08:00:00.000Z'),
      estimateNormalTime: 5.75,
      requireAssignee: {year_of_exp:1,backend:1,frontend:2},
      requireAsset: [],
      assignee: sw_NguyenVietDang._id
    },
    {
      id: 10,
      project: "",
      name: "Lập trình infra",
      startDate: new Date('2024-09-04T06:00:00.000Z'),
      endDate: new Date('2024-09-08T06:00:00.000Z'),
      estimateNormalTime: 4,
      requireAssignee: {year_of_exp:1,docker:2,ci_cd:2,backend:1},
      requireAsset: [],
      assignee: sw_NguyenVietDang._id
    },
    {
      id: 11,
      project: "",
      name: "Kiểm thử luồng mua hàng",
      estimateNormalTime: 2.5, 
      startDate: new Date('2024-09-08T06:00:00.000Z'),
      endDate: new Date('2024-09-10T10:00:00.000Z'),
      requireAssignee: {manual_test:1,unit_test:2,automation_test:1},
      requireAsset: [],
      assignee: sw_NguyenVietDang._id
    },
    {
      id: 12,
      project: "",
      name: "Đề xuất ý tưởng cho giao diện mới",
      startDate: new Date('2024-09-23T06:00:00.000Z'),
      endDate: new Date('2024-09-24T10:00:00.000Z'),
      requireAssignee: {year_of_exp:2,english:3},
      requireAsset: [],
      assignee: sw_NguyenVietDang._id
    },
    
    // 4
    {
      id: 13,
      project: "",
      name: "Dựng các màn cho module đặt lịch",
      startDate: new Date('2024-07-28T06:00:00.000Z'),
      endDate: new Date('2024-08-03T10:00:00.000Z'),
      estimateNormalTime: 6.5,
      requireAssignee: {degree:1,frontend:2},
      requireAsset: [],
      assignee: sw_NguyenMinhThanh._id,
    },
    {
      id: 14,
      project: "",
      name: "Lập trình trang quản lý phân quyền",
      startDate: new Date('2024-08-04T01:00:00.000Z'),
      endDate: new Date('2024-08-08T10:00:00.000Z'),
      estimateNormalTime: 5,
      requireAssignee: {degree:2,frontend:1},
      requireAsset: [],
      assignee: sw_NguyenMinhThanh._id,
    },
    {
      id: 16,
      project: "",
      name: "Đọc hiểu code base",
      startDate: new Date('2024-08-09T01:00:00.000Z'),
      endDate: new Date('2024-08-11T10:00:00.000Z'),
      estimateNormalTime: 3,
      requireAssignee: {backend:2,frontend:1,docker:1},
      requireAsset: [],
      assignee: sw_NguyenMinhThanh._id,
    },
    // {
    //   id: 16,
    //   project: "Ghép API mô đun bán hàng",
    //   name: "",
    //   startDate: new Date('2024-08-09T01:00:00.000Z'),
    //   endDate: new Date('2024-08-11T10:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenMinhThanh._id,
    // },
    {
      id: 17,
      project: "",
      name: "Ghép API mô đun bán hàng",
      estimateNormalTime: 8,
      startDate: new Date('2024-09-24T01:00:00.000Z'),
      endDate: new Date('2024-10-02T10:00:00.000Z'),
      requireAssignee: {frontend:1,backend:1,manual_test:1},
      requireAsset: [],
      assignee: sw_NguyenMinhThanh._id,
    },
    {
      id: 18,
      project: "",
      name: "Lập trình trang quảng bá, giới thiệu sản phẩm",
      startDate: new Date('2024-10-04T01:00:00.000Z'),
      endDate: new Date('2024-10-09T10:00:00.000Z'),
      estimateNormalTime: 6, 
      requireAssignee: {degree:2,frontend:2},
      requireAsset: [],
      assignee: sw_NguyenMinhThanh._id,
    },

    // 5
    {
      id: 19,
      project:"",
      name: "Viết kịch bản kiểm thử tích hợp",
      startDate: new Date('2024-08-17T01:00:00.000Z'),
      endDate: new Date('2024-08-21T10:00:00.000Z'),
      estimateNormalTime: 5,
      requireAssignee: {manual_test:1,unit_test:1,automation_test:1},
      requireAsset: [],
      assignee: sw_NguyenThiOanh._id
    },
    // {
    //   id: 20,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-08-22T01:00:00.000Z'),
    //   endDate: new Date('2024-08-28T02:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenThiOanh._id
    // },
    // {
    //   id: 21,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-08-29T01:00:00.000Z'),
    //   endDate: new Date('2024-09-04T03:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenThiOanh._id
    // },
    // {
    //   id: 22,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-18T01:00:00.000Z'),
    //   endDate: new Date('2024-09-21T10:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenThiOanh._id
    // },
    // {
    //   id: 23,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-30T01:00:00.000Z'),
    //   endDate: new Date('2024-10-02T08:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenThiOanh._id,
    // },

    // 6
    {
      id: 24,
      project: "",
      name: "Xây dựng kịch bản thử nghiệm cho luồng quản lý hóa đơn",
      startDate: new Date('2024-08-20T01:00:00.000Z'),
      endDate: new Date('2024-08-24T10:00:00.000Z'),
      estimateNormalTime: 5,
      requireAssignee: {degree:2,unit_test:2},
      requireAsset: [],
      assignee: sw_VuThiQuynh._id
    },
    // {
    //   id: 25,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-03T01:00:00.000Z'),
    //   endDate: new Date('2024-09-06T10:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_VuThiQuynh._id
    // },
    // {
    //   id: 26,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-17T03:00:00.000Z'),
    //   endDate: new Date('2024-09-19T08:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_VuThiQuynh._id
    // },
    // {
    //   id: 27,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-27T02:00:00.000Z'),
    //   endDate: new Date('2024-09-28T10:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_VuThiQuynh._id
    // },
    // {
    //   id: 28,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-09-29T01:00:00.000Z'),
    //   endDate: new Date('2024-10-02T05:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_VuThiQuynh._id
    // },

    // 7
    {
      id: 28,
      project: "",
      name: "Sửa lỗi module quản lý thuế TNCN",
      startDate: new Date('2024-08-09T05:00:00.000Z'),
      endDate: new Date('2024-08-11T05:00:00.000Z'),
      estimateNormalTime: 3,
      requireAssignee: {year_of_exp:1,backend:2,frontend:1},
      requireAsset: [],
      assignee: sw_NguyenPhucNhatNam._id
    },

    // {
    //   id: 29,
    //   project: "",
    //   name: "",
    //   startDate: new Date('2024-08-29T01:00:00.000Z'),
    //   endDate: new Date('2024-09-02T05:00:00.000Z'),
    //   requireAssignee: {},
    //   requireAsset: [],
    //   assignee: sw_NguyenPhucNhatNam._id
    // },


    {
      id: 30,
      project: "",
      name: "Triển khai ứng dụng trên github",
      startDate: new Date('2024-09-23T06:00:00.000Z'),
      endDate: new Date('2024-09-24T10:00:00.000Z'),
      estimateNormalTime: 1.5,
      requireAssignee: {year_of_exp:1,docker:2,ci_cd:2},
      requireAsset: [],
      assignee: sw_NguyenPhucNhatNam._id
    },

    // 8
    {
      id: 31,
      project: "",
      name: "Dựng các màn hình của chatbot",
      startDate: new Date('2024-07-29T04:00:00.000Z'),
      endDate: new Date('2024-08-02T10:00:00.000Z'),
      estimateNormalTime: 4.5,
      requireAssignee: {degree:2,frontend:2},
      requireAsset: [],
      assignee: sw_DangQuocTu._id
    },
    {
      id: 32,
      project: "",
      name: "Lập trình service chat với socket",
      startDate: new Date('2024-08-09T01:00:00.000Z'),
      endDate: new Date('2024-08-11T10:00:00.000Z'),
      estimateNormalTime: 4,
      requireAssignee: {backend:2,frontend:2},
      requireAsset: [],
      assignee: sw_DangQuocTu._id
    },
    {
      id: 33,
      project: "",
      name: "Dựng các màn hình trò chuyện",
      startDate: new Date('2024-08-24T01:00:00.000Z'),
      endDate: new Date('2024-08-29T10:00:00.000Z'),
      estimateNormalTime: 6,
      requireAssignee: {degree:2,frontend:3},
      requireAsset: [],
      assignee: sw_DangQuocTu._id
    },
    {
      id: 34,
      project: "",
      name: "Kiểm thử tính năng tạo cuộc họp",
      startDate: new Date('2024-08-30T01:00:00.000Z'),
      endDate: new Date('2024-09-01T10:00:00.000Z'),
      estimateNormalTime: 2,
      requireAssignee: {manual_test:1,unit_test:1,automation_test:1},
      requireAsset: [],
      assignee: sw_DangQuocTu._id
    },
    {
      id: 35,
      project: "",
      name: "Dựng các màn hình của mô đun quản lý lớp học",
      startDate: new Date('2024-09-17T02:00:00.000Z'),
      endDate: new Date('2024-09-22T08:00:00.000Z'),
      estimateNormalTime: 5.625,
      requireAssignee: {degree:2,frontend:2},
      requireAsset: [],
      assignee: sw_DangQuocTu._id
    },
  ]
  console.log("allTasksOutOfProject: ", allTasksOutOfProject?.length)

  const existingTasksOutOf = await Task(vnistDB).find({ status: "inprocess" }, { name: 1, _id: 0 });
  const existingTaskNamesOutOf = new Set(existingTasksOutOf.map(task => task.name));

  // Step 2: Filter new tasks to exclude those with existing names
  const filteredTasksOutOf = allTasksOutOfProject.filter(task => !existingTaskNamesOutOf.has(task.name));

  // Step 3: Insert the filtered tasks into the database
  if (filteredTasksOutOf?.length > 0) {
    const allTaskOutOfInDB = await Task(vnistDB).insertMany(filteredTasksOutOf);
    console.log(`Inserted ${filteredTasksOutOf.length} new tasks Out Of.`);
  } else {
    console.log('No new tasks Out Of to insert.');  
  }

  const gd_NguyenVanAn_User = await User(vnistDB).findOne({
    name: "Nguyễn Văn An"
  })
  const gd_NguyenVanAn = await Employee(vnistDB).findOne({
    fullName: "Nguyễn Văn An"
  })
  // console.log("gd_NguyenVanAn_User: ", gd_NguyenVanAn_User.name, gd_NguyenVanAn_User.email)
  // console.log("gd_NguyenVanAn: ", gd_NguyenVanAn.fullName, gd_NguyenVanAn.emailInCompany)

  const swUnit = await OrganizationalUnit(vnistDB).findOne({
    name: "Phòng phát triển PM"
  })
  // console.log("swUnit: ", swUnit)
  // Init Project data

  // Assets
  const assetType_Ban = await AssetType(vnistDB).findOne({
    typeNumber: "BA"
  })
  const assetType_Laptop = await AssetType(vnistDB).findOne({
    typeNumber: "LAP"
  })
  const assetType_PH = await AssetType(vnistDB).findOne({
    typeNumber: "PH"
  })
  const assetType_Server = await AssetType(vnistDB).findOne({
    typeNumber: "SER"
  })
  const assetType_Tool = await AssetType(vnistDB).findOne({
    typeNumber: "TOOL"
  })
  // console.log("assetType_Ban: ", assetType_Ban.typeName)
  // console.log("assetType_Laptop: ", assetType_Laptop.typeName)
  // console.log("assetType_PH: ", assetType_PH.typeName)
  // console.log("assetType_Server: ", assetType_Server.typeName)

  const asset_Ban1 = await Asset(vnistDB).findOne({
    assetName: "Bàn 1"
  })
  console.log("asset_Ban1: ", asset_Ban1.assetName)
  
  const asset_Ban2 = await Asset(vnistDB).findOne({
    assetName: "Bàn 2"
  })
  console.log("asset_Ban2: ", asset_Ban2.assetName)

  const asset_Ban3 = await Asset(vnistDB).findOne({
    assetName: "Bàn 3"
  })
  console.log("asset_Ban3: ", asset_Ban3.assetName)

  const asset_Server1 = await Asset(vnistDB).findOne({
    assetName: "Server 1"
  })
  console.log("asset_Server1: ", asset_Server1.assetName)

  const asset_Server2 = await Asset(vnistDB).findOne({
    assetName: "Server 2"
  })
  console.log("asset_Server2: ", asset_Server2.assetName)

  const asset_Server3 = await Asset(vnistDB).findOne({
    assetName: "Server 3"
  })
  console.log("asset_Server3: ", asset_Server3.assetName)
  
  const asset_PH = await Asset(vnistDB).findOne({
    assetName: "PH B1-704"
  })
  console.log("asset_PH: ", asset_PH.assetName)

  const asset_Laptop1 = await Asset(vnistDB).findOne({
    code: "SW.001"
  })
  console.log("asset_Laptop1: ", asset_Laptop1.assetName)

  const asset_Laptop2 = await Asset(vnistDB).findOne({
    code: "SW.002"
  })
  console.log("asset_Laptop2: ", asset_Laptop2.assetName)

  const asset_Laptop3 = await Asset(vnistDB).findOne({
    code: "SW.003"
  })
  console.log("asset_Laptop3: ", asset_Laptop3.assetName)

  const asset_Tool_Test_1 = await Asset(vnistDB).findOne({
    code: "SW.011"
  })
  console.log("asset_Tool_Test_1: ", asset_Tool_Test_1.assetName)

  const organizationalUnitSW = await OrganizationalUnit(vnistDB).findOne({
    name: "Phòng phát triển PM"
  })
  // console.log("organizationalUnitSW: ", organizationalUnitSW)
  // const organizationUnitKPISet = ''
  const kpiSWSet = await OrganizationalUnitKpiSet(vnistDB).findOne({
    organizationalUnit: organizationalUnitSW._id
  })
  // console.log("kpiSWSet: ", kpiSWSet.kpis)
  const listKPITarget = await OrganizationalUnitKpi(vnistDB).find({
    _id: { $in: kpiSWSet.kpis }
  })
  console.log("kpiSWSet: ", listKPITarget)

  const kpiA = listKPITarget[0]._id
  const kpiB = listKPITarget[1]._id
  const kpiC = listKPITarget[2]._id

  const projectData = {
    name: "Dự án Xây dựng phần mềm hỗ trợ phân bổ nguồn lực",
    description: "Xây dựng phần mềm hỗ trợ phân bổ nguồn lực thực hiện công việc trong dự án theo chỉ tiêu KPI",
    startDate: new Date('2024-08-01T01:00:00.000Z'),
    endDate: new Date('2024-11-01T01:00:00.000Z'),
    unitTime: "days",
    unitCost: "VND",
    projectManager: [gd_NguyenVanAn_User._id, sw_NguyenVanMinh_User._id],
    creator: gd_NguyenVanAn_User._id,
    status: "proposal",
    usersInProject: [
      {
        userId: sw_NguyenVanMinh_User._id,
        unitId: swUnit._id,
        employeeId: sw_NguyenVanMinh._id
      },
      {
        userId: sw_NguyenVanBien_User._id,
        unitId: swUnit._id,
        employeeId: sw_NguyenVanBien._id
      },
      {
        userId: sw_NguyenVietDang_User._id,
        unitId: swUnit._id,
        employeeId: sw_NguyenVietDang._id
      },
      {
        userId: sw_NguyenMinhThanh_User._id,
        unitId: swUnit._id,
        employeeId: sw_NguyenMinhThanh._id
      },
      {
        userId: sw_NguyenThiOanh_User._id,
        unitId: swUnit._id,
        employeeId: sw_NguyenThiOanh._id
      },
      {
        userId: sw_VuThiQuynh_User._id,
        unitId: swUnit._id,
        employeeId: sw_VuThiQuynh._id
      },
      {
        userId: sw_NguyenPhucNhatNam_User._id,
        unitId: swUnit._id,
        employeeId: sw_NguyenPhucNhatNam._id
      },
      {
        userId: sw_DangQuocTu_User._id,
        unitId: swUnit._id,
        employeeId: sw_DangQuocTu._id
      },
    ],
    responsibleEmployees: [
      sw_NguyenVanMinh_User._id,
      sw_NguyenVanBien_User._id,
      sw_NguyenVietDang_User._id,
      sw_NguyenMinhThanh_User._id,
      sw_NguyenPhucNhatNam_User._id,
      sw_NguyenThiOanh_User._id,
      sw_VuThiQuynh_User._id,
      sw_DangQuocTu_User._id
    ],
    assets: [
      asset_Ban1._id, 
      asset_Ban2._id,
      asset_Ban3._id,
      asset_PH._id,
      asset_Laptop1._id,
      asset_Laptop2._id,
      asset_Laptop3._id,
      asset_Server1._id,
      asset_Server2._id,
      asset_Tool_Test_1._id
    ],
    kpiTarget: [
      {
        type: kpiA,
        typeIndex: 1,
        targetKPIValue: 0.88,
        assignValueInProject: 100,
        targetValueInProject: 88
      },
      {
        type: listKPITarget[1]._id,
        typeIndex: 2,
        targetKPIValue: 0.91,
        assignValueInProject: 100,
        targetValueInProject: 91
      },
      {
        type: listKPITarget[2]._id,
        typeIndex: 3,
        targetKPIValue: 0.91,
        assignValueInProject: 100,
        targetValueInProject: 91
      }
    ]
  }
  console.log("projectData: ", projectData)
  const project = await Project(vnistDB).create({
    ...projectData
  })
  const tasks = [
    {
      id: 1,
      name: "Phân tích yêu cầu khách hàng",
      code: "A1",
      preceedingTasks: ["F1"],
      startTime: null,
      endTime: null,
      tags: ['analysis'],
      requireAsset: [
        { 
          type: assetType_PH._id,
          number: 1, 
          capacityValue: 2
        }
      ],
      requireAssignee: {
        english: 2,
        year_of_exp: 2
      },
      estimateNormalTime: 7,
      kpiInTask: kpiA,
      taskKPIWeight: 0.228,
      status: 'proposal'
    },
    {
      id: 2,
      code: "A21",
      name: "Dựng codebase React-NodeJS",
      preceedingTasks: ["E1"],
      startTime: null,
      endTime: null,
      requireAsset: [
        { 
          type: assetType_Laptop._id,
          number: 1, 
          capacityValue: 2
        }
      ],
      tags: ['backend', 'frontend'],
      estimateNormalTime: 7,
      requireAssignee: {
        backend: 2,
        frontend: 1,
        docker: 1,
        year_of_exp: 1,
      },
      kpiInTask: kpiA,
      taskKPIWeight: 0.086,
      status: 'proposal'
    },
    {
      id: 3,
      code: "A22",
      name: "Dựng trang phân bổ nguồn lực dự án",
      preceedingTasks: ["E1"],
      startTime: null,
      endTime: null,
      tags: ['frontend'],
      requireAsset: [
        { 
          type: assetType_Laptop._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        degree: 2,
        frontend: 2,
      },
      estimateNormalTime: 6,
      kpiInTask: kpiA,
      taskKPIWeight: 0.086,
      status: 'proposal'
    },
    {
      id: 4,
      code: "A23",
      name: "Dựng giao diện module quản lý thẻ",
      preceedingTasks: ["E1"],
      startTime: null,
      endTime: null,
      tags: ['frontend'],
      requireAsset: [
        { 
          type: assetType_Laptop._id, 
          number: 1, 
          capacityValue: 2
        },
      ],
      requireAssignee: {
        backend: 1,
        frontend: 2,
        year_of_exp: 1
      },
      estimateNormalTime: 8,
      kpiInTask: kpiA,
      taskKPIWeight: 0.114,
      status: 'proposal'
    },
    {
      id: 5,
      code: "A3",
      name: "Triển khai hệ thống DXClan lên server",
      preceedingTasks: ["D2"],
      startTime: null,
      endTime: null,
      tags: ['devops'],
      requireAsset: [
        { 
          type: assetType_Server._id, 
          number: 1, 
          capacityValue: 2
        },
      ],
      requireAssignee: {
        ci_cd: 2,
        docker: 2,
        year_of_exp: 1
      },
      estimateNormalTime: 5,
      kpiInTask: kpiA,
      taskKPIWeight: 0.171,
      status: 'proposal'
    },
    {
      id: 6,
      code: "B1",
      name: "Tạo kế hoạch kiểm thử các chức năng",
      preceedingTasks: ["C1"],
      startTime: null,
      endTime: null,
      tags: ['testing'],
      requireAsset: [
        { 
          type: assetType_Ban._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        manual_test: 2,
        unit_test: 1
      },
      estimateNormalTime: 1,
      // kpiInTask: [
      //   {
      //     id: 2,
      //     type: "B",
      //     weight: 0.143,
      //   }
      // ]
      kpiInTask: kpiB,
      taskKPIWeight: 0.143,
      status: 'proposal'
    },
    {
      id: 7,
      code: "B2",
      name: "Kiểm thử luồng phân bổ nguồn lực",
      preceedingTasks: ["A21", "A22", "A23", "B4", "A24", "A25", "A26"],
      startTime: null,
      endTime: null,
      tags: ['testing'],
      requireAsset: [
        { 
          type: assetType_Tool._id, 
          requireType: "optional",
          number: 1, 
          capacityValue: 2
        },
      ],
      requireAssignee: {
        manual_test: 1,
        unit_test: 1,
        automation_test: 1
      },
      estimateNormalTime: 5,
      // kpiInTask: [
      //   {
      //     id: 2,
      //     type: "B",
      //     weight: 0.143,
      //   }
      // ],
      kpiInTask: kpiB,
      taskKPIWeight: 0.143,
      status: 'proposal'
    },
    {
      id: 8,
      code: "B3",
      name: "Sửa lỗi các module yêu cầu",
      preceedingTasks: ["B2"],
      startTime: null,
      endTime: null,
      tags: ['frontend', 'backend'],
      requireAsset: [
        { 
          type: assetType_Ban._id, 
          number: 1, 
          capacityValue: 2
        },
      ],
      requireAssignee: {
        backend: 2,
        frontend: 1,
        year_of_exp: 1
      },
      estimateNormalTime: 7,

      kpiInTask: kpiB,
      taskKPIWeight: 0.286,
      status: 'proposal'
    },
    {
      id: 9,
      code: "B4",
      name: "Viết kịch bản thử nghiệm cho luồng phân bổ nguồn lực",
      preceedingTasks: ["E1"],
      startTime: null,
      endTime: null,
      tags: ['testing'],
      requireAsset: [
        { 
          type: assetType_Ban._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        degree: 2,
        unit_test: 2,
      },
      estimateNormalTime: 2,
      // kpiInTask: [
      //   {
      //     id: 2,
      //     type: "B",
      //     weight: 0.143,
      //   }
      // ]
      kpiInTask: kpiB,
      taskKPIWeight: 0.143
    },
    {
      id: 10,
      code: "C1",
      name: "Lập kế hoạch cho dự án",
      preceedingTasks: [],
      startTime: null,
      endTime: null,
      tags: ['planning'],
      requireAsset: [
        { 
          type: assetType_Ban._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        year_of_exp: 3,
        degree: 2
      },
      estimateNormalTime: 1,
      // kpiInTask: [
      //   {
      //     id: 2,
      //     type: "B",
      //     weight: 0.285,
      //   }
      // ],
      kpiInTask: kpiB,
      taskKPIWeight: 0.285
    },
    {
      id: 11,
      code: "D1",
      name: "Thu thập phản hồi của khách hàng",
      preceedingTasks: ["B3"],
      startTime: null,
      endTime: null,
      tags: ['collecting_data'],
      requireAsset: [
        { 
          type: assetType_PH._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        english: 5
      },
      estimateNormalTime: 2,
      kpiInTask: kpiC,
      taskKPIWeight: 0.333,
      status: 'proposal'
      // kpiInTask: [
      //   {
      //     id: 3,
      //     type: "C",
      //     weight: 0.333,
      //   }
      // ]
    },
    {
      id: 12,
      code: "D2",
      name: "Điều chỉnh chức năng phân bổ nguồn lực",
      preceedingTasks: ["D1"],
      startTime: null,
      endTime: null,
      tags: ['backend', 'frontend'],
      requireAsset: [
        { 
          type: assetType_Server._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        year_of_exp: 2,
        ci_cd: 2,
        backend: 2
      },
      estimateNormalTime: 4,
      // kpiInTask: [
      //   {
      //     id: 3,
      //     type: "C",
      //     weight: 0.167,
      //   }
      // ],
      kpiInTask: kpiC,
      taskKPIWeight: 0.167,
      status: 'proposal'
    },
    {
      id: 13,
      name: "Đề xuất ý cho bài toán phân bổ nguồn lực",
      code: "E1",
      preceedingTasks: ["A1"],
      startTime: null,
      endTime: null,
      tags: ['idea'],
      requireAsset: [
        { 
          type: assetType_Ban._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        year_of_exp: 2,
        english: 3
      },
      estimateNormalTime: 2,
      // kpiInTask: [
      //   {
      //     id: 3,
      //     type: "C",
      //     weight: 0.166,
      //   }
      // ],
      kpiInTask: kpiC,
      taskKPIWeight: 0.166,
      status: 'proposal'
    },
    {
      id: 14,
      code: "F1",
      name: "Lập tài liệu thuyết trình với các bên liên quan",
      preceedingTasks: [],
      startTime: null,
      endTime: null,
      tags: ['document'],
      requireAsset: [
        { 
          type: assetType_Laptop._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        year_of_exp: 2,
        english: 5
      },
      estimateNormalTime: 1.5,
      // kpiInTask: [
      //   {
      //     id: 3,
      //     type: "C",
      //     weight: 0.167,
      //   }
      // ],
      kpiInTask: kpiC,
      taskKPIWeight: 0.167,
      status: 'proposal'
    },
    {
      id: 15,
      code: "F2",
      name: "Viết tài liệu công nghệ sử dụng",
      preceedingTasks: ["A3"],
      startTime: null,
      endTime: null,
      tags: ['document'],
      requireAsset: [
        { 
          type: assetType_Ban._id, 
          number: 1, 
          capacityValue: 1
        },
      ],
      requireAssignee: {
        year_of_exp: 2,
        backend: 2,
        ci_cd: 2,
        frontend: 2,
        docker: 2,
      },
      estimateNormalTime: 1,
      kpiInTask: kpiC,
      taskKPIWeight: 0.167,
      status: 'proposal'
      // kpiInTask: [
      //   {
      //     id: 3,
      //     type: "C",
      //     weight: 0.167,
      //   }
      // ]
    },
    {
      id: 16,
      code: "A24",
      name: "Dựng các trang thêm, sửa, xóa dự án",
      preceedingTasks: ["A21", "E1"],
      startTime: null,
      endTime: null,
      tags: ['frontend'],
      requireAsset: [
        { 
          type: assetType_Laptop._id, 
          number: 1, 
          capacityValue: 2
        },
      ],
      requireAssignee: {
        year_of_exp: 1,
        backend: 1,
        frontend: 2
      },
      estimateNormalTime: 8,
      kpiInTask: kpiA,
      taskKPIWeight: 0.143,
      status: 'proposal'
      // kpiInTask: [
      //   {
      //     id: 1,
      //     type: "A",
      //     weight: 0.143,
      //   }
      // ]
    },
    {
      id: 17,
      code: "A25",
      name: "Lập trình service mô đun quản lý dự án",
      preceedingTasks: ["A22", "E1"],
      startTime: null,
      endTime: null,
      tags: ['backend'],
      requireAsset: [
        { 
          type: assetType_Laptop._id, 
          number: 1, 
          capacityValue: 2
        },
      ],
      requireAssignee: {
        backend: 2,
        frontend: 2
      },
      estimateNormalTime: 7,
      kpiInTask: kpiA,
      taskKPIWeight: 0.086,
      status: 'proposal'
      // kpiInTask: [
      //   {
      //     id: 1,
      //     type: "A",
      //     weight: 0.086,
      //   }
      // ]
    },
    {
      id: 18,
      code: "A26",
      name: "Ghép API mô đun quản lý dự án",
      preceedingTasks: ["A23", "E1"],
      startTime: null,
      endTime: null,
      tags: ['frontend', 'backend'],
      requireAsset: [
        {
          type: assetType_Laptop._id,
          number: 1,
          capacityValue: 1
        },
      ],
      requireAssignee: {
        frontend: 2,
        backend: 1,
        manual_test: 1
      },
      estimateNormalTime: 6,
      kpiInTask: kpiA,
      taskKPIWeight: 0.086,
      status: 'proposal'
      // kpiInTask: [
      //   {
      //     id: 1,
      //     type: "A",
      //     weight: 0.086,
      //   }
      // ]
    },
  ]

  // console.log("usersInP: ", projectData.usersInProject, projectData.usersInProject?.length)
  const tasksToAdd = tasks.map((task) => {
    return {
      ...task,
      taskProject: project._id,
      preceedingTasks: task?.preceedingTasks && task?.preceedingTasks?.length ? task?.preceedingTasks.map((item) => {
        return {
          link: item
        }
      }) : []
    }
  }) 
  // tasksToAdd.forEach((item) => console.log("pre: ", item.preceedingTasks))
  // console.log("tasktoAdd: ", tasksToAdd.)
  // DONE!!!
  const createdTasks = await Task(vnistDB).insertMany(tasksToAdd);

  // Tạo bản đồ ánh xạ taskCode -> _id và taskCode -> taskCode
  const taskCodeToIdMap = {};
  createdTasks.forEach(task => {
      taskCodeToIdMap[task.code] = task._id;
  });

    // Cập nhật lại các tasks với preceedingTasks
  for (let taskData of createdTasks) {
    if (taskData.preceedingTasks) {
      taskData.preceedingTasks = taskData.preceedingTasks.map(({ link }) => ({
        task: taskCodeToIdMap[link],
        link: link // Sử dụng taskCode làm giá trị cho link
      }));
      await taskData.save();
    }
  }

  project.tasks = createdTasks.map(task => task._id);
  await project.save()
  console.log("DONE!!!!")

  process.exit(0);
}

initSWProjectData()
  .catch((err) => {
  console.log(err);
  process.exit(0);
});
