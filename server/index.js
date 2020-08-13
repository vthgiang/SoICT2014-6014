// NODE_MODULES
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
global.SERVER_BACKUP_PATH = __dirname + "/../backup";

multer({
  dest: "upload/avatars",
});
require("dotenv").config();
global.AUTO_BACKUP_DATABASE = require("./helpers/backupDatabase").backupScheduler;
AUTO_BACKUP_DATABASE.start();

// Application Modules
const schedulerController = require("./modules/scheduler/scheduler.controller");
const auth = require("./modules/auth/auth.route");

const documents = require("./modules/document/document.route");

const annualLeave = require("./modules/human-resource/annual-leave/annualLeave.route");
const commendations = require("./modules/human-resource/commendation/commendation.route");
const disciplines = require("./modules/human-resource/discipline/discipline.route");
const holidays = require("./modules/human-resource/holiday/holiday.route");
const profile = require("./modules/human-resource/profile/profile.route");
const salary = require("./modules/human-resource/salary/salary.route");
const timesheets = require("./modules/human-resource/timesheets/timesheets.route");

const employeeKpiCreation = require("./modules/kpi/employee/creation/creation.route");
const employeeKpiDashboard = require("./modules/kpi/employee/dashboard/dashboard.route");
const employeeKpiManagement = require("./modules/kpi/employee/management/management.route");
const employeeKpiEvaluation = require("./modules/kpi/evaluation/employee-evaluation/employeeEvaluation.route");
const employeeKpiEvaluationDashboard = require("./modules/kpi/evaluation/dashboard/dashboard.route");
const organizationalUnitKpiCreation = require("./modules/kpi/organizational-unit/creation/creation.route");
const organizationalUnitKpiDashboard = require("./modules/kpi/organizational-unit/dashboard/dashboard.route");
const organizationalUnitKpiManagement = require("./modules/kpi/organizational-unit/management/management.route");

const notifications = require("./modules/notification/notification.route");

const component = require("./modules/super-admin/component/component.route");
const link = require("./modules/super-admin/link/link.route");
const organizationalUnit = require("./modules/super-admin/organizational-unit/organizationalUnit.route");
const privilege = require("./modules/super-admin/privilege/privilege.route");
const role = require("./modules/super-admin/role/role.route");
const user = require("./modules/super-admin/user/user.route");

const company = require("./modules/system-admin/company/company.route");
const log = require("./modules/system-admin/log/log.route");
const systemComponent = require("./modules/system-admin/system-component/systemComponent.route");
const systemLink = require("./modules/system-admin/system-link/systemLink.route");
const rootRole = require("./modules/system-admin/root-role/rootRole.route");
const systemSetting = require("./modules/system-admin/system-setting/systemSetting.route");

const tasktemplate = require("./modules/task/task-template/taskTemplate.route");
const taskManagement = require("./modules/task/task-management/task.route");
const taskPerform = require("./modules/task/task-perform/taskPerform.route");
const taskProcess = require("./modules/task/tasks-process/taskProcess.route");
const educationPrograms = require("./modules/trainning/education-program/educationProgram.route");
const courses = require("./modules/trainning/course/course.route");

//asset
const assetType = require("./modules/asset/asset-type/asset-type.route");
const asset = require("./modules/asset/asset-management/asset.route");
const recommendProcure = require("./modules/asset/recommend-equipment-procurement/recommend-procurement.route");
const recommendDistribute = require("./modules/asset/recommend-distribute-equipment/recommend-distribute.route");

// report
const taskReport = require("./modules/report/task-report/taskReport.route");

//material
const material = require("./modules/warehouse/material/material.router");

const customer = require("./modules/customer/customer.route");

//order
const order = require("./modules/order/order.route");

// APP
const app = express();

// Bodyparser middleware
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  "/upload/human-resource/avatars",
  express.static("upload/human-resource/avatars")
);
app.use("/upload/avatars", express.static("upload/avatars"));
app.use("/upload/asset/pictures", express.static("upload/asset/pictures"));

const db = process.env.DATABASE;
const optionConnectDB =
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

mongoose // Connect to MongoDB
  .connect(db, optionConnectDB)
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Function gọi Api vào thời gian xác định
schedulerController.chedulesCallApi();

app.use("/auth", auth);

app.use("/documents", documents);

app.use("/annualLeave", annualLeave);
app.use("/commendations", commendations);
app.use("/disciplines", disciplines);
app.use("/holidays", holidays);
app.use("/employees", profile);
app.use("/salary", salary);
app.use("/timesheets", timesheets);

app.use("/kpi/employee/creation", employeeKpiCreation);
app.use("/kpi/employee/dashboard", employeeKpiDashboard);
app.use("/kpi/employee/management", employeeKpiManagement);
app.use("/kpi/evaluation/dashboard", employeeKpiEvaluationDashboard);
app.use("/kpi/evaluation/employee-evaluation", employeeKpiEvaluation);
app.use("/kpi/organizational-unit/creation", organizationalUnitKpiCreation);
app.use("/kpi/organizational-unit/dashboard", organizationalUnitKpiDashboard);
app.use("/kpi/organizational-unit/management", organizationalUnitKpiManagement);

app.use("/notifications", notifications);

app.use("/component", component);
app.use("/link", link);
app.use("/organizational-units", organizationalUnit);
app.use("/privilege", privilege);
app.use("/role", role);
app.use("/user", user);

app.use("/system-admin/company", company);
app.use("/system-admin/log", log);
app.use("/system-admin/system-component", systemComponent);
app.use("/system-admin/system-link", systemLink);
app.use("/system-admin/root-role", rootRole);
app.use("/system-admin/system-setting", systemSetting);

app.use("/task", taskManagement);
app.use("/performtask", taskPerform);
app.use("/task/task-templates", tasktemplate);
app.use("/taskprocess", taskProcess);
app.use("/educationPrograms", educationPrograms);
app.use("/courses", courses);

//asset
app.use("/assettype", assetType);
app.use("/assets", asset);
app.use("/recommendprocure", recommendProcure);
app.use("/recommenddistribute", recommendDistribute);

// Task report
app.use("/taskreports", taskReport);

// material
app.use("/materials", material);

//order
app.use("/orders", order);

// Customer Management
app.use("/customer", customer);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on: ${port} !`));
