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

const addEmployeeCapacity = async () => {
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


  console.log("vào đây!!!")
  const listCapacitiesInDB = await Capacity(vnistDB).find({})
  // console.log("listCapacitiesInDB: ", listCapacitiesInDB[0].values)

  const getRandomCapacityForEmp = (listCapacitiesInDB) => {
    const listCapacityOfEmp = listCapacitiesInDB.map((capacityItem) => {
      const randomIndex = Math.floor(Math.random() * capacityItem?.values?.length);
      return {
        capacity: capacityItem._id,
        value: capacityItem.values[randomIndex]?.value
      }
    })
    return listCapacityOfEmp
  }
  

  // find employees with 
  const excludedEmails = ["nguyenvanminh.vnist@gmail.com",
    "nguyenvanbien.vnist@gmail.com",
    "nguyenvietdangsw.vnist@gmail.com",
    "nguyenphucnhatnam.vnist@gmail.com",
    "nguyenthioanh.vnist@gmail.com",
    "vuthiquynh.vnist@gmail.com",
    "nguyenminhthanh.vnist@gmail.com",
    "dangquoctu.vnist@gmail.com",
  ]; // Replace with your actual list of emails

  const employees = await Employee(vnistDB).find({
    emailInCompany: { $nin: excludedEmails }
  })

  const updatePromises = employees.map(employee => {
    const randomCapacity = getRandomCapacityForEmp(listCapacitiesInDB);

    return Employee(vnistDB).updateOne(
      { _id: employee._id },
      { $set: { capacities: randomCapacity } } // Assuming capacities is an array and you want to set it with a single random value
    );
  });

  // Execute all update operations concurrently
  await Promise.all(updatePromises);
  console.log("ADD capacity done!!!")


  process.exit(0);
}

addEmployeeCapacity().catch((err) => {
  console.log(err);
  process.exit(0);
});