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
  // TaskTag,
  Capacity,
  AssetType,
  Asset

} = require("../models");



require("dotenv").config();


const initSWUnitData = async () => {
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

    // 
    if (!db.models.Capacity) Capacity(db)
    // if (!db.models.TaskTag) TaskTag(db)

    console.log("models_list", db.models);
  };

  initModels(vnistDB);
  initModels(systemDB);

  


  /* 
    Tạo dữ liệu cho Capacity
  */
  const capacities = [
    {
      name: "Kinh nghiệm (năm)",
      key: "year_of_exp",
      description: "Số năm kinh nghiệm",
      values: [
        {
          key: "Dưới 1 năm",
          value: 1,
        },
        {
          key: "1-2 Năm",
          value: 2,
        },
        {
          key: "2-5 Năm",
          value: 3,
        },
        {
          key: "5-10 Năm",
          value: 4,
        },
        {
          key: "Trên 10 năm",
          value: 5,
        }
      ]
    },
    {
      name: "Xếp hạng tốt nghiệp",
      key: "degree",
      description: "Xếp hạng tốt nghiệp",
      values: [
        {
          key: "Trung bình",
          value: 1,
        },
        {
          key: "Khá",
          value: 2,
        },
        {
          key: "Giỏi",
          value: 3,
        },
        {
          key: "Xuất sắc",
          value: 4,
        },
      ]
    },
    {
      name: "English",
      key: "english",
      description: "Năng lực tiếng Anh",
      values: [
        {
          key: "A1",
          value: 1,
        },
        {
          key: "A2",
          value: 2,
        },
        {
          key: "B1",
          value: 3,
        },
        {
          key: "B2",
          value: 4,
        },
        {
          key: "C1",
          value: 5,
        },
        {
          key: "C2",
          value: 6,
        }
      ]
    },
    {
      name: "Backend",
      key: "backend",
      description: "Năng lực xây dựng chức năng phía Backend",
      values: [
        {
          key: "Đã từng làm", // Beginner
          value: 1,
        },
        {
          key: "Thành thạo", // Proficient
          value: 2,
        },
        {
          key: "Chuyên nghiệp", // Professional
          value: 3,
        },
        {
          key: "Chuyên gia", // Expert
          value: 4
        },
        {
          key: "Bậc thầy", // Master
          value: 5,
        },
      ]
    },
    {
      name: "Frontend",
      key: "frontend",
      description: "Năng lực xây dựng chức năng phía Frontend",
      values: [
        {
          key: "Đã từng làm",
          value: 1,
        },
        {
          key: "Thành thạo",
          value: 2,
        },
        {
          key: "Chuyên nghiệp",
          value: 3,
        },
                {
          key: "Chuyên gia",
          value: 4
        },
        {
          key: "Bậc thầy",
          value: 5,
        },
      ]
    },
    {
      name: "Kiểm thử đơn vị",
      key: "unit_test",
      description: "Năng lực kiểm thử đơn vị",
      values: [
        {
          key: "Đã từng làm",
          value: 1,
        },
        {
          key: "Thành thạo",
          value: 2,
        },
        {
          key: "Chuyên nghiệp",
          value: 3,
        },
                {
          key: "Chuyên gia",
          value: 4
        },
        {
          key: "Bậc thầy",
          value: 5,
        },
      ]
    },
    {
      name: "Kiểm thử tự động",
      key: "automation_test",
      description: "Năng lực kiểm thử tự động",
      values: [
        {
          key: "Đã từng làm",
          value: 1,
        },
        {
          key: "Thành thạo",
          value: 2,
        },
        {
          key: "Chuyên nghiệp",
          value: 3,
        },
                {
          key: "Chuyên gia",
          value: 4
        },
        {
          key: "Bậc thầy",
          value: 5,
        },
      ]
    },
    {
      name: "Kiểm thử thủ công",
      key: "manual_test",
      description: "Năng lực kiểm thử thủ công",
      values: [
        {
          key: "Đã từng làm",
          value: 1,
        },
        {
          key: "Thành thạo",
          value: 2,
        },
        {
          key: "Chuyên nghiệp",
          value: 3,
        },
                {
          key: "Chuyên gia",
          value: 4
        },
        {
          key: "Bậc thầy",
          value: 5,
        },
      ]
    },
    {
      name: "Docker",
      key: "docker",
      description: "Năng lực sử dụng Docker",
      values: [
        {
          key: "Đã từng làm",
          value: 1,
        },
        {
          key: "Thành thạo",
          value: 2,
        },
        {
          key: "Chuyên nghiệp",
          value: 3,
        },
                {
          key: "Chuyên gia",
          value: 4
        },
        {
          key: "Bậc thầy",
          value: 5,
        },
      ]
    },
    {
      name: "CI_CD",
      key: "ci_cd",
      description: "Năng lực viết CI_CD",
      values: [
        {
          key: "Đã từng làm",
          value: 1,
        },
        {
          key: "Thành thạo",
          value: 2,
        },
        {
          key: "Chuyên nghiệp",
          value: 3,
        },
                {
          key: "Chuyên gia",
          value: 4
        },
        {
          key: "Bậc thầy",
          value: 5,
        },
      ]
    }
  ]

  await Capacity(vnistDB).deleteMany({})
  await Capacity(vnistDB).insertMany(capacities)
  console.log("@Initial capacities complete.");

  /* 
    Tạo dữ liệu cho Tag
  */
  const tags = [
    {
      name: 'analysis',
      description: 'Phân tích nghiệp vụ, phân tích yêu cầu...'
    },
    {
      name: 'testing',
      description: 'Kiểm thử chức năng, module, ứng dụng'
    },
    {
      name: 'planning',
      description: 'Lập kế hoạch, lên kế hoạch'
    },
    {
      name: 'document',
      description: 'Tạo dựng, lập các tài liệu'
    },
    {
      name: 'idea',
      description: 'Đề xuất các ý tưởng, chức năng'
    },
    {
      name: 'backend',
      description: 'Xây dựng các api, service'
    },
    {
      name: 'frontend',
      description: 'Xây dựng giao diện cho website'
    },
    {
      name: 'devops',
      description: 'Deploy sản phẩm lên server, làm việc với cloud,..'
    }
  ]

  const insertNewTags = async (tags) => {
    try {
      const existingTags = await Tag(vnistDB).find({
        name: {
          $in: tags.map(tag => tag.name)
        }
      }).select('name');

      const existingTagNames = existingTags.map(tag => tag.name);
      
      const newTags = tags.filter(tag => !existingTagNames.includes(tag.name));

      if (newTags.length > 0) {
        await Tag(vnistDB).insertMany(newTags);
        console.log('New tags inserted:', newTags);
      } else {
        console.log('No new tags to insert');
      }
    } catch (err) {
      console.error('Error inserting tags:', err);
    }
  };

  // await Tag(vnistDB).deleteMany({})
  await insertNewTags(tags);
  console.log("@Initial tags complete.");
  
  /**
   * Lấy dữ liệu về công ty VNIST trong database của hệ thống
   */
  const vnist = await Company(systemDB).findOne({
    shortName: "vnist",
  })

  /**
   * 2. Thêm các tài khoản người dùng trong csdl của công ty VNIST
   */
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync("vnist123@", salt);
  const usersInSWUnit = [
    {
      // 1: Manager
      name: "Nguyễn Văn Minh",
      email: "nguyenvanminh.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    {
      // 2: Middle
      name: "Nguyễn Văn Biển",
      email: "nguyenvanbien.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    {
      // 3: Junior (3)
      name: "Nguyễn Viết Đang",
      email: "nguyenvietdangsw.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    {
      // 4: Junior 2 (7)
      name: "Nguyễn Phúc Nhật Nam",
      email: "nguyenphucnhatnam.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    
    {
      // 5: Tester
      name: "Nguyễn Thị Oanh",
      email: "nguyenthioanh.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    {
      // 6: BrSE
      name: "Vũ Thị Quỳnh",
      email: "vuthiquynh.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    {
      // 7: Fresher (4)
      name: "Nguyễn Minh Thành",
      email: "nguyenminhthanh.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
    {
      // 8: Fresher 2 (8)
      name: "Đặng Quốc Tú",
      email: "dangquoctu.vnist@gmail.com",
      password: hash,
      company: vnist._id
    },
  ] 

  const users = await User(vnistDB).insertMany(usersInSWUnit)
  console.log("Dữ liệu tài khoản người dùng cho phòng phát triển PM", usersInSWUnit);

  const fields = await Field(vnistDB).find({})
  const majors = await Major(vnistDB).find({})
  const careerPositions = await CareerPosition(vnistDB).find({})
  const certificates = await Certificate(vnistDB).find({})
  const currentYear = new Date().getFullYear();
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

  const nvPhongSW = await Role(vnistDB).create({
    parents: [roleEmployee._id],
    name: "Nhân viên phòng phát triển PM",
    type: roleChucDanh._id,
  });
  const phoPhongSW = await Role(vnistDB).create({
    parents: [roleDeputyManager._id, nvPhongSW._id],
    name: "Phó phòng phát triển PM",
    type: roleChucDanh._id,
  });
  const truongPhongSW = await Role(vnistDB).create({
    parents: [roleManager._id, nvPhongSW._id, phoPhongSW._id],
    name: "Trưởng phòng phát triển PM",
    type: roleChucDanh._id,
  });

  await UserRole(vnistDB).insertMany([
    {
      // Trưởng phòng phát triển PM
      userId: users[0]._id,
      roleId: truongPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[0]._id,
      roleId: nvPhongSW._id
    },

    {
      // Phó phòng phát triển PM
      userId: users[1]._id,
      roleId: phoPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[1]._id,
      roleId: nvPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[2]._id,
      roleId: nvPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[3]._id,
      roleId: nvPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[4]._id,
      roleId: nvPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[5]._id,
      roleId: nvPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[6]._id,
      roleId: nvPhongSW._id
    },
    {
      // Nhân viên phòng phát triển PM
      userId: users[7]._id,
      roleId: nvPhongSW._id
    },
  ])

  /**
   * 5. Tạo thêm dữ liệu các phòng ban cho công ty VNIST
   */
  const Directorate = await OrganizationalUnit(vnistDB).findOne({
    // Khởi tạo ban giám đốc công ty
    name: "Ban giám đốc",
  });

  const phongPTPM = await OrganizationalUnit(vnistDB).create(
    {
      name: "Phòng phát triển PM",
      description:
        "Phòng phát triển phần mềm Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
      managers: [truongPhongSW._id],
      deputyManagers: [phoPhongSW._id],
      employees: [nvPhongSW._id],
      parent: Directorate._id,
    },
  );
  console.log("***", phongPTPM);


  /*---------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------
      TẠO DỮ LIỆU NHÂN VIÊN CHO Phòng phát triển PM CÔNG TY VNIST
  -----------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------- */

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

  const capacity_year_of_exp = await Capacity(vnistDB).findOne({
    key: 'year_of_exp'
  })
  const capacity_degree = await Capacity(vnistDB).findOne({
    key: 'degree'
  })
  const capacity_english = await Capacity(vnistDB).findOne({
    key: 'english'
  })
  const capacity_backend = await Capacity(vnistDB).findOne({
    key: 'backend'
  })
  const capacity_frontend = await Capacity(vnistDB).findOne({
    key: 'frontend'
  })
  const capacity_unit_test = await Capacity(vnistDB).findOne({
    key: 'unit_test'
  })
  const capacity_automation_test = await Capacity(vnistDB).findOne({
    key: 'automation_test'
  })
  const capacity_manual_test = await Capacity(vnistDB).findOne({
    key: 'manual_test'
  })
  const capacity_docker = await Capacity(vnistDB).findOne({
    key: 'docker'
  })
  const capacity_ci_cd = await Capacity(vnistDB).findOne({
    key: 'ci_cd'
  })
  


  let employees = await Employee(vnistDB).insertMany([
    {
      // user 1
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Văn Minh",
      employeeNumber: "MS202401",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`2013-02-19`),
      birthdate: new Date("1982-05-15"),
      birthplace: "Bằng An - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000001,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "nguyenvanminh.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480001",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586290,
      personalEmail: "minhvn@gmail.com",
      phoneNumber2: 9625845,
      personalEmail2: "minhkaratedo@gmail.com",
      homePhone: 978590338,
      emergencyContactPerson: "Nguyễn Văn Thiện",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "thien@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Bằng An - Quế Võ - Bắc Ninh",
      permanentResidence: "Bằng An - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Bằng An",
      temporaryResidence: "thôn Đông",
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
      taxRepresentative: "Nguyễn Văn Minh",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "excellent",
        },
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Khoa Học Tự Nhiên",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "very_good",
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
          startDate: new Date(`${currentYear - 10}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 4
        },
        {
          capacity: capacity_year_of_exp,
          value: 5
        },
        {
          capacity: capacity_english,
          value: 4
        },
        {
          capacity: capacity_backend,
          value: 5
        },
        {
          capacity: capacity_frontend,
          value: 3
        },
        {
          capacity: capacity_docker,
          value: 4
        },
        {
          capacity: capacity_ci_cd,
          value: 4
        },
        {
          capacity: capacity_unit_test,
          value: 1
        },
        {
          capacity: capacity_manual_test,
          value: 1
        },
        {
          capacity: capacity_automation_test,
          value: 3
        },
      ]
    },

    {
      // user 2
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Văn Biển",
      employeeNumber: "MS202402",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`2013-02-19`),
      birthdate: new Date("1999-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000002,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "nguyenvanbien.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480001",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586291,
      personalEmail: "bienvn@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "bienkaratedo@gmail.com",
      homePhone: 978590339,
      emergencyContactPerson: "Nguyễn Văn Thiện",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "thien@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
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
      taxRepresentative: "Nguyễn Văn Biển",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "excellent",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 3
        },
        {
          capacity: capacity_year_of_exp,
          value: 4
        },
        {
          capacity: capacity_english,
          value: 3
        },
        {
          capacity: capacity_backend,
          value: 4
        },
        {
          capacity: capacity_frontend,
          value: 3
        },
        {
          capacity: capacity_docker,
          value: 4
        },
        {
          capacity: capacity_ci_cd,
          value: 3
        },
        {
          capacity: capacity_unit_test,
          value: 2
        },
        {
          capacity: capacity_manual_test,
          value: 1
        },
        {
          capacity: capacity_automation_test,
          value: 4
        },
      ]
    },

    {
      // user 3 (3)
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Viết Đang",
      employeeNumber: "MS202403",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`2020-02-19`),
      birthdate: new Date("2000-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000003,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "nguyenvietdang.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480003",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586292,
      personalEmail: "dangnv@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "dangkaratedo@gmail.com",
      homePhone: 978590339,
      emergencyContactPerson: "Nguyễn Văn Đảm",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "dam@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
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
      taxRepresentative: "Nguyễn Viết Đang",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123698",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 2
        },
        {
          capacity: capacity_year_of_exp,
          value: 2
        },
        {
          capacity: capacity_english,
          value: 3
        },
        {
          capacity: capacity_backend,
          value: 3
        },
        {
          capacity: capacity_frontend,
          value: 2
        },
        {
          capacity: capacity_docker,
          value: 2
        },
        {
          capacity: capacity_ci_cd,
          value: 2
        },
        {
          capacity: capacity_unit_test,
          value: 1
        },
        {
          capacity: capacity_manual_test,
          value: 1
        },
        {
          capacity: capacity_automation_test,
          value: 3
        },
      ]
    },

    {
      // user 4 (7)
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Phúc Nhật Nam",
      employeeNumber: "MS202404",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`2020-02-19`),
      birthdate: new Date("2000-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000002,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "nguyenphucnhatnam.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480004",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586294,
      personalEmail: "namnpn@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "namkaratedo@gmail.com",
      homePhone: 978590339,
      emergencyContactPerson: "Nguyễn Văn Đảm",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "dam@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
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
      socialInsuranceNumber: "XH1569876",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12315",
      taxRepresentative: "Nguyễn Phúc Nhật Nam",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-04-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123699",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 3
        },
        {
          capacity: capacity_year_of_exp,
          value: 2
        },
        {
          capacity: capacity_english,
          value: 4
        },
        {
          capacity: capacity_backend,
          value: 2
        },
        {
          capacity: capacity_frontend,
          value: 3
        },
        {
          capacity: capacity_docker,
          value: 2
        },
        {
          capacity: capacity_ci_cd,
          value: 2
        },
        {
          capacity: capacity_unit_test,
          value: 2
        },
        {
          capacity: capacity_manual_test,
          value: 1
        },
        {
          capacity: capacity_automation_test,
          value: 2
        },
      ]
    },

    {
      // user 5
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Thị Oanh",
      employeeNumber: "MS202405",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "female",
      startingDate: new Date(`2020-02-19`),
      birthdate: new Date("2001-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000003,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "nguyenthioanh.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480005",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586292,
      personalEmail: "oanhnt@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "oanhkaratedo@gmail.com",
      homePhone: 978590339,
      emergencyContactPerson: "Nguyễn Văn Yến",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "dam@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "900 Toeic",
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
      taxRepresentative: "Nguyễn Thị Oanh",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "excellent",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123800",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 2
        },
        {
          capacity: capacity_year_of_exp,
          value: 2
        },
        {
          capacity: capacity_english,
          value: 5
        },
        // {
        //   capacity: capacity_backend,
        //   value: 3
        // },
        // {
        //   capacity: capacity_frontend,
        //   value: 2
        // },
        // {
        //   capacity: capacity_docker,
        //   value: 2
        // },
        // {
        //   capacity: capacity_ci_cd,
        //   value: 2
        // },
        {
          capacity: capacity_unit_test,
          value: 4
        },
        {
          capacity: capacity_manual_test,
          value: 5
        },
        {
          capacity: capacity_automation_test,
          value: 3
        },
      ]
    },

    {
      // user 6
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Vũ Thị Quỳnh",
      employeeNumber: "MS202406",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "female",
      startingDate: new Date(`2020-02-19`),
      birthdate: new Date("1997-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000006,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "vuthiquynh.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480006",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586292,
      personalEmail: "quynhvt@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "quynhvtkaratedo@gmail.com",
      homePhone: 978590339,
      emergencyContactPerson: "Vũ Việt Vương",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "vuong@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "900 Toeic",
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
      taxRepresentative: "Vũ Thị Quỳnh",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "excellent",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123801",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 2
        },
        {
          capacity: capacity_year_of_exp,
          value: 3
        },
        {
          capacity: capacity_english,
          value: 6
        },
        // {
        //   capacity: capacity_backend,
        //   value: 3
        // },
        // {
        //   capacity: capacity_frontend,
        //   value: 2
        // },
        // {
        //   capacity: capacity_docker,
        //   value: 2
        // },
        // {
        //   capacity: capacity_ci_cd,
        //   value: 2
        // },
        {
          capacity: capacity_unit_test,
          value: 3
        },
        {
          capacity: capacity_manual_test,
          value: 4
        },
        {
          capacity: capacity_automation_test,
          value: 2
        },
      ]
    },

    {
      // user 7 (4)
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Nguyễn Minh Thành",
      employeeNumber: "MS202407",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`2020-02-19`),
      birthdate: new Date("2002-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000007,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "nguyenminhthanh.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480007",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586292,
      personalEmail: "thanhnm@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "thanhkaratedo@gmail.com",
      homePhone: 978590339,
      emergencyContactPerson: "Nguyễn Minh An",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "minhan@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "900 Toeic",
      professionalSkill: "university",
      healthInsuranceNumber: "N1236599",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569879",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12315",
      taxRepresentative: "Nguyễn Minh Thành",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123805",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 2
        },
        {
          capacity: capacity_year_of_exp,
          value: 1
        },
        {
          capacity: capacity_english,
          value: 3
        },
        {
          capacity: capacity_backend,
          value: 2
        },
        {
          capacity: capacity_frontend,
          value: 2
        },
        {
          capacity: capacity_docker,
          value: 2
        },
        {
          capacity: capacity_ci_cd,
          value: 1
        },
        {
          capacity: capacity_unit_test,
          value: 2
        },
        {
          capacity: capacity_manual_test,
          value: 1
        },
        // {
        //   capacity: capacity_automation_test,
        //   value: 2
        // },
      ]
    },

    {
      // user 8 (8)
      avatar: "/upload/human-resource/avatars/avatar5.png",
      fullName: "Đặng Quốc Tú",
      employeeNumber: "MS202408",
      status: "active",
      company: vnist._id,
      employeeTimesheetId: "12315",
      gender: "male",
      startingDate: new Date(`2020-02-19`),
      birthdate: new Date("2001-05-15"),
      birthplace: "Phương Liễu - Quế Võ - Bắc Ninh",
      identityCardNumber: 27201000008,
      identityCardDate: new Date("2015-10-20"),
      identityCardAddress: "Bắc Ninh",
      emailInCompany: "dangquoctu.vnist@gmail.com",
      nationality: "Việt Nam",
      atmNumber: "104870480008",
      bankName: "ViettinBank",
      bankAddress: "Hai Bà Trưng",
      ethnic: "Kinh",
      religion: "Không",
      maritalStatus: "single",
      phoneNumber: 962586292,
      personalEmail: "tudq@gmail.com",
      phoneNumber2: 9625846,
      personalEmail2: "tukaratedo@gmail.com",
      homePhone: 978590399,
      emergencyContactPerson: "Nguyễn Minh An",
      relationWithEmergencyContactPerson: "Bố",
      emergencyContactPersonPhoneNumber: 962586278,
      emergencyContactPersonEmail: "minhan@gmail.com",
      emergencyContactPersonHomePhone: 962586789,
      emergencyContactPersonAddress: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidence: "Phương Liễu - Quế Võ - Bắc Ninh",
      permanentResidenceCountry: "Việt Nam",
      permanentResidenceCity: "Bắc Ninh",
      permanentResidenceDistrict: "Quế Võ",
      permanentResidenceWard: "Phương Liễu",
      temporaryResidence: "thôn Giang",
      temporaryResidenceCountry: "Việt Nam",
      temporaryResidenceCity: "Hà Nội",
      temporaryResidenceDistrict: "Hai Bà Trưng",
      temporaryResidenceWard: "Bạch Mai",
      educationalLevel: "12/12",
      foreignLanguage: "900 Toeic",
      professionalSkill: "university",
      healthInsuranceNumber: "N1236599",
      healthInsuranceStartDate: new Date(`${currentYear}-01-25`),
      healthInsuranceEndDate: new Date(`${currentYear}-02-16`),
      socialInsuranceNumber: "XH1569879",
      socialInsuranceDetails: [
        {
          company: "Vnist",
          position: "Nhân viên",
          startDate: new Date(`${currentYear}-01`),
          endDate: new Date(`${currentYear}-05`),
        },
      ],
      taxNumber: "12315",
      taxRepresentative: "Đặng Quốc Tú",
      taxDateOfIssue: new Date(`12/08/${currentYear - 1}`),
      taxAuthority: "Chi cục thuế Huyện Quế Võ",
      degrees: [
        {
          name: "Bằng tốt nghiệp",
          issuedBy: "Đại học Bách Khoa",
          year: currentYear,
          field: fields[Math.floor(Math.random() * 6)]._id,
          major: majors[Math.floor(Math.random() * 12)]._id,
          degreeQualification: Math.floor(Math.random() * 6) + 1,
          degreeType: "excellent",
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
          startDate: new Date(`${currentYear - 5}-06`),
          endDate: new Date(`${currentYear}-05`),
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
      // biddingPackages: [
      //   {
      //     startDate: new Date(`${currentYear - 1}-06`),
      //     endDate: new Date(`${currentYear}-02`),
      //     company: "Vnist",
      //     position: "Nhân viên",
      //   },
      // ],
      contractType: "Chính thức",
      contractEndDate: new Date(`${currentYear + 3}-10-25`),
      contracts: [
        {
          name: "Chính thức",
          contractType: "Chính thức",
          startDate: new Date(`${currentYear - 1}-10-25`),
          endDate: new Date(`${currentYear}-05-25`),
        },
      ],
      archivedRecordNumber: "T3 - 123805",
      files: [],
      capacities: [
        {
          capacity: capacity_degree,
          value: 2
        },
        {
          capacity: capacity_year_of_exp,
          value: 1
        },
        {
          capacity: capacity_english,
          value: 4
        },
        {
          capacity: capacity_backend,
          value: 1
        },
        {
          capacity: capacity_frontend,
          value: 3
        },
        {
          capacity: capacity_docker,
          value: 1
        },
        // {
        //   capacity: capacity_ci_cd,
        //   value: 1
        // },
        {
          capacity: capacity_unit_test,
          value: 2
        },
        {
          capacity: capacity_manual_test,
          value: 1
        },
        // {
        //   capacity: capacity_automation_test,
        //   value: 2
        // },
      ]
    },
  ])

  console.log(`Xong! Thông tin nhân viên đã được tạo`);
  //END

   /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  
  console.log("emp: ", employees[0])
  await Salary(vnistDB).insertMany([
    {
      company: vnist._id,
      employee: employees[0]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
      mainSalary: "40000000",
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
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
      mainSalary: "30000000",
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
      employee: employees[2]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
      mainSalary: "19500000",
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
      employee: employees[3]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
      mainSalary: "21500000",
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
      employee: employees[4]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
      mainSalary: "13000000",
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
      employee: employees[5]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
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
      employee: employees[6]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
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
      employee: employees[7]._id,
      month: `${currentYear}-05`,
      organizationalUnit: phongPTPM._id,
      mainSalary: "11000000",
      unit: "VND",
      bonus: [
        {
          nameBonus: "Thưởng dự án",
          number: "1000000",
        },
      ],
    },
  ])

  console.log("Lương NV OKE!")

  
  /*---------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------
      TẠO DỮ LIỆU KPI đơn vị CHO Phòng phát triển PM CÔNG TY VNIST
  -----------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------- */
  const organizationalUnitGD = await OrganizationalUnit(vnistDB).findOne({
    name: "Ban giám đốc"
  })

  // const organizationalUnitPM = await OrganizationalUnit(vnistDB).findOne({
  //   name: "Phòng phát triển PM"
  // })

  const manager = await User(vnistDB).findOne({ name: "Nguyễn Văn An" });


  const now = new Date();

  let organizationalUnitImportances = []
  let employeeImportances = []
  let organizationUnitKPISet = await OrganizationalUnitKpiSet(vnistDB).create({
    organizationalUnit: phongPTPM._id,
    creator: manager,
    kpis: [],
    date: new Date(currentYear, 6 - 1 + 1, 0),
    status: 1,
  })

  let organizationalUnitKpiArray = [];

  organizationalUnitKpiArray = await OrganizationalUnitKpi(vnistDB).insertMany([
    {
      name: "Phân tích, xây dựng chức năng, module",
      parent: null,
      weight: 35,
      criteria: "Số chức năng, module cần hoàn thành",
      type: 0,
      // automaticPoint: 79,
      // employeePoint: 90,
      // approvedPoint: 83
    },
    {
      name: "Chất lượng sản phẩm",
      parent: null,
      weight: 35,
      criteria: "Số lỗi gặp phải",
      type: 1,
      // automaticPoint: 89,
      // employeePoint: 90,
      // approvedPoint: 88
    },
    {
      name: "Tài liệu và các yêu cầu khác",
      parent: null,
      weight: 30,
      criteria: "Số tài liệu, sản phẩm, báo cáo giao nộp",
      type: 3,
      // automaticPoint: 85,
      // employeePoint: 88,
      // approvedPoint: 78
    },
  ]);


  organizationUnitKPISet = await OrganizationalUnitKpiSet(vnistDB).findByIdAndUpdate(
    organizationUnitKPISet, {
      $push: {
        kpis: organizationalUnitKpiArray.map((x) => x._id)
      },
    },
    { new: true }
  )

   /*---------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------
      TẠO DỮ LIỆU Tài sản CHO Phòng phát triển PM CÔNG TY VNIST
  -----------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------- */
  const thanhVienBGĐ = await Role(vnistDB).findOne({
    name: "Thành viên ban giám đốc"
  })
  const phoGiamDoc = await Role(vnistDB).findOne({
    name: "Phó giám đốc"
  })
  const giamDoc = await Role(vnistDB).findOne({
    name: "Giám đốc"
  })
  const roleAdmin = await Role(vnistDB).findOne({
    name: Terms.ROOT_ROLES.ADMIN.name
  })
  const roleSuperAdmin = await Role(vnistDB).findOne({
    name: Terms.ROOT_ROLES.SUPER_ADMIN.name
  })
  // Mấy role tạo rồi: roleManager, truongPhongSW, phoPhongSW, nvPhongSW
  // const roleManager = await Role(vnistDB).findOne({
  //   name: Terms.ROOT_ROLES.MANAGER.name
  // })
  // const truongPhongSW = await Role(vnistDB).findOne({
  //   name: "Trưởng phòng phát triển PM"
  // })
  // const phoPhongSW = await Role(vnistDB).findOne({
  //   name: "Trưởng phòng phát triển PM"
  // })
  // const nvPhongSW = await Role(vnistDB).findOne({
  //   name: "Nhân viên phòng phát triển PM"
  // })

  // Tạo dữ liệu loại tài sản
  const assetType_Ban = await AssetType(vnistDB).findOne({
    typeNumber: "BA"
  })
  // const assetType_MB = await AssetType(vnistDB).findOne({
  //   typeNumber: "MB"
  // })
  const assetType_Laptop = await AssetType(vnistDB).create({
    company: vnist._id,
    typeNumber: "LAP",
    typeName: "Laptop",
    parent: null,
    description: "",
  })
  const assetType_Server = await AssetType(vnistDB).create({
    company: vnist._id,
    typeNumber: "SER",
    typeName: "Server",
    parent: null,
    description: "",
  })
  const assetType_PH = await AssetType(vnistDB).create({
    company: vnist._id,
    typeNumber: "PH",
    typeName: "Phòng họp",
    parent: null,
    description: "",
  })
  const assetType_Tool = await AssetType(vnistDB).create({
    company: vnist._id,
    typeNumber: "TOOL",
    typeName: "Công cụ hỗ trợ",
    parent: null,
    description: "",
  })

  console.log("Tạo dữ liệu loại tài sản thành công!")

   /*---------------------------------------------------------------------------------------------
      -----------------------------------------------------------------------------------------------
          TẠO DỮ LIỆU TÀI SẢN
      -----------------------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------------------- */
  console.log("Khởi tạo dữ liệu tài sản SW");
  const listAsset = await Asset(vnistDB).insertMany([
    // Laptop 1
    {
      company: vnist._id,
      assetName: "Laptop Macbook Air M1",
      group: "machine",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
            month: new Date("2020-06-20"),
            unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.001",
      serial: "00001",
      assetType: [assetType_Laptop._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Laptop Macbook Air M1",
      detailInfo: [],
      readByRoles: [
        giamDoc._id,
        roleAdmin._id,
        roleSuperAdmin._id,
        roleManager._id,
        thanhVienBGĐ._id,
        truongPhongSW._id,
        phoPhongSW._id,
        nvPhongSW._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 20000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 10000,
      capacityValue: 1
    },

    // Laptop 2
    {
      company: vnist._id,
      assetName: "Laptop Macbook Pro M1",
      group: "machine",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
            month: new Date("2020-06-20"),
            unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.002",
      serial: "00002",
      assetType: [assetType_Laptop._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "in_use",
      typeRegisterForUse: 3,
      description: "Laptop Macbook Pro M1",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [
        {
          startDate: new Date('2024-07-01T08:00:00.000Z'),
          endDate: new Date('2024-07-20T08:00:00.000Z')
        },
        {
          startDate: new Date('2024-07-21T02:00:00.000Z'),
          endDate: new Date('2024-08-01T08:00:00.000Z')
        },
        {
          startDate: new Date('2024-08-01T02:00:00.000Z'),
          endDate: new Date('2024-08-10T08:00:00.000Z')
        },
      ],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 30000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 15000,
      capacityValue: 2
    },

    // Laptop 3
    {
      company: vnist._id,
      assetName: "Laptop Macbook Pro M2",
      group: "machine",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.003",
      serial: "00003",
      assetType: [assetType_Laptop._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "in_use",
      typeRegisterForUse: 3,
      description: "Laptop Macbook Pro M2",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [
        {
          startDate: new Date('2024-07-01T01:00:00.000Z'),
          endDate: new Date('2024-07-13T02:00:00.000Z')
        },
        {
          startDate: new Date('2024-07-13T02:00:00.000Z'),
          endDate: new Date('2024-07-25T08:00:00.000Z')
        },
        {
          startDate: new Date('2024-07-26T02:00:00.000Z'),
          endDate: new Date('2024-08-08T08:00:00.000Z')
        },
      ],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 25000,
      capacityValue: 2
    },

    // Server
    // Server 1
    {
      company: vnist._id,
      assetName: "Server 1",
      group: "machine",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
            month: new Date("2020-06-20"),
            unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.004",
      serial: "00004",
      assetType: [assetType_Server._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "in_use",
      typeRegisterForUse: 3,
      description: "Server 12GB SSD",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [
        {
          startDate: new Date('2024-07-01T08:00:00.000Z'),
          endDate: new Date('2024-07-15T08:00:00.000Z')
        },
        {
          startDate: new Date('2024-07-16T01:00:00.000Z'),
          endDate: new Date('2024-08-18T08:00:00.000Z')
        },
        {
          startDate: new Date('2024-08-19T01:00:00.000Z'),
          endDate: new Date('2024-09-24T08:00:00.000Z')
        },
      ],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 50000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 20000,
      capacityValue: 2
    },
    
    // Server 2
    {
      company: vnist._id,
      assetName: "Server 2",
      group: "machine",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.005",
      serial: "00005",
      assetType: [assetType_Server._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Server 16GB SSD",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 60000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 25000,
      capacityValue: 2
    },

    // Server 3
    {
      company: vnist._id,
      assetName: "Server 3",
      group: "machine",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.006",
      serial: "00006",
      assetType: [assetType_Server._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Server 24GB SSD",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 80000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 30000,
      capacityValue: 3
    },

    // PH 1
    {
      company: vnist._id,
      assetName: "PH B1-704",
      group: "building",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.007",
      serial: "00007",
      assetType: [assetType_PH._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Phòng họp B1-704",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 120000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 25000,
      capacityValue: 3
    },      
    
    // Table 1
    {
      company: vnist._id,
      assetName: "Bàn 1",
      group: "other",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.008",
      serial: "00008",
      assetType: [assetType_Ban._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Bàn 1",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 1200000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 10000,
      capacityValue: 2
    }, 

    // Table 2
    {
      company: vnist._id,
      assetName: "Bàn 2",
      group: "other",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.009",
      serial: "00009",
      assetType: [assetType_Ban._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Bàn 2",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 1000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 8000,
      capacityValue: 1
    },  

    // Table 3
    {
      company: vnist._id,
      assetName: "Bàn 3",
      group: "other",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.010",
      serial: "00010",
      assetType: [assetType_Ban._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "in_use",
      typeRegisterForUse: 3,
      description: "Bàn 3",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [
        {
          startDate: new Date('2024-07-01T06:00:00.000Z'),
          endDate: new Date('2024-08-12T05:00:00.000Z')
        },
        {
          startDate: new Date('2024-08-12T05:00:00.000Z'),
          endDate: new Date('2024-09-08T05:00:00.000Z')
        },
      ],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 2000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 15000,
      capacityValue: 3
    }, 

    // Tools for testing
    {
      company: vnist._id,
      assetName: "Công cụ JTEST Master",
      group: "other",
      usefulLife: "12",
      unitsProducedDuringTheYears: [
        {
          month: new Date("2020-06-20"),
          unitsProducedDuringTheYear: 10,
        },
      ],
      estimatedTotalProduction: 1000,
      code: "SW.011",
      serial: "00011",
      assetType: [assetType_Tool._id],
      purchaseDate: new Date("2020-06-20"),
      warrantyExpirationDate: new Date("2022-06-20"),
      managedBy: usersInSWUnit[0]._id,
      assignedToUser: null,
      assignedToOrganizationalUnit: null,
      status: "ready_to_use",
      typeRegisterForUse: 3,
      description: "Công cụ hỗ trợ test JTEST MASTER",
      detailInfo: [],
      readByRoles: [
          giamDoc._id,
          roleAdmin._id,
          roleSuperAdmin._id,
          roleManager._id,
          thanhVienBGĐ._id,
          truongPhongSW._id,
          phoPhongSW._id,
          nvPhongSW._id,
      ],

      usageLogs: [
        // {
        //   startDate: new Date('2024-07-01T06:00:00.000Z'),
        //   endDate: new Date('2024-08-12T05:00:00.000Z')
        // },
        // {
        //   startDate: new Date('2024-08-12T05:00:00.000Z'),
        //   endDate: new Date('2024-09-08T05:00:00.000Z')
        // },
      ],
      // bảo trì thiết bị
      maintainanceLogs: [
      ],
      //sự cố
      incidentLogs: [
      ],
      //khấu hao
      cost: 2000000,
      residualValue: 10000000,
      startDepreciation: new Date("2024-05-20"), // thời gian bắt đầu trích khấu hao
      usefulLife: 20, // thời gian trích khấu hao
      depreciationType: "straight_line", // thời gian trích khấu hao
      files: [],
      costPerHour: 1000,
      capacityValue: 3
    },
  ])






  systemDB.close();
  vnistDB.close();
  console.log("@End init software unit database!");
};

initSWUnitData().catch((err) => {
  console.log(err);
  process.exit(0);
});

