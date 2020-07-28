// NODE_MODULES
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const multer = require('multer');
multer({ dest: 'upload/avatars' });
require('dotenv').config();



// Application Modules
const schedulerController = require('./modules/scheduler/scheduler.controller');
const auth = require('./modules/auth/auth.route');

const documents = require('./modules/document/document.route');

const annualLeaves = require('./modules/human-resource/annual-leave/annualLeave.route');
const commendations = require('./modules/human-resource/commendation/commendation.route');
const disciplines = require('./modules/human-resource/discipline/discipline.route');
const holidays = require('./modules/human-resource/holiday/holiday.route');
const profile = require('./modules/human-resource/profile/profile.route');
const salaries = require('./modules/human-resource/salary/salary.route');
const timesheets = require('./modules/human-resource/timesheets/timesheets.route');

const employeeKpiCreation = require("./modules/kpi/employee/creation/creation.route");
const employeeKpiDashboard = require("./modules/kpi/employee/dashboard/dashboard.route");
const employeeKpiManagement = require("./modules/kpi/employee/management/management.route");
const employeeKpiEvaluation = require('./modules/kpi/evaluation/employee-evaluation/employeeEvaluation.route');
const employeeKpiEvaluationDashboard = require('./modules/kpi/evaluation/dashboard/dashboard.route');
const organizationalUnitKpiCreation = require("./modules/kpi/organizational-unit/creation/creation.route");
const organizationalUnitKpiDashboard = require("./modules/kpi/organizational-unit/dashboard/dashboard.route");
const organizationalUnitKpiManagement = require("./modules/kpi/organizational-unit/management/management.route");

const notifications = require('./modules/notification/notification.route');

const component = require('./modules/super-admin/component/component.route');
const link = require('./modules/super-admin/link/link.route');
const organizationalUnit = require('./modules/super-admin/organizational-unit/organizationalUnit.route');
const privilege = require('./modules/super-admin/privilege/privilege.route');
const role = require('./modules/super-admin/role/role.route');
const user = require('./modules/super-admin/user/user.route');

const company = require('./modules/system-admin/company/company.route');
const log = require('./modules/system-admin/log/log.route');
const systemComponent = require('./modules/system-admin/system-component/systemComponent.route');
const systemLink = require('./modules/system-admin/system-link/systemLink.route');
const rootRole = require('./modules/system-admin/root-role/rootRole.route');

const tasktemplate = require("./modules/task/task-template/taskTemplate.route")
const taskManagement = require("./modules/task/task-management/task.route");
const taskPerform = require("./modules/task/task-perform/taskPerform.route");
const taskProcess = require("./modules/task/tasks-process/taskProcess.route")
const educationPrograms = require('./modules/trainning/education-program/educationProgram.route');
const courses = require('./modules/trainning/course/course.route');

//asset
const assetType = require('./modules/assets-manager/asset-type-management/asset-type.route');
const asset = require('./modules/assets-manager/asset-management/asset.route');
const recommendProcure = require('./modules/assets-manager/recommend-equipment-procurement/recommend-procurement.route');
const recommendDistribute = require('./modules/assets-manager/recommend-distribute-equipment/recommend-distribute.route');

// report
const taskReport = require('./modules/report/task-report/taskReport.route');


// APP
const app = express();




// Bodyparser middleware
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/upload/human-resource/avatars', express.static('upload/human-resource/avatars'));
app.use('/upload/human-resource/templateImport', express.static('upload/human-resource/templateImport'));
app.use('/upload/avatars', express.static('upload/avatars'));
app.use('/upload/asset/pictures', express.static('upload/asset/pictures'));




const db = process.env.DATABASE;// DB Config
mongoose // Connect to MongoDB
    .connect(
        db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false); // Global setting cho mongoose, không dùng useFindAndModify



global.isLog = false;
const Logger = require('./models/system-admin/log.model');
Logger.findOne({
    name: 'log'
})
    .then(result => {
        result.status ? isLog = true : isLog = false;
    })
    .catch(err => console.log("message: ", err));

// Function gọi Api vào thời gian xác định
schedulerController.chedulesCallApi();

app.use("/auth", auth);

app.use("/documents", documents);

app.use("/annualLeaves", annualLeaves);
app.use("/commendations", commendations);
app.use("/disciplines", disciplines);
app.use("/holidays", holidays);
app.use("/employees", profile);
app.use("/salaries", salaries);
app.use("/timesheets", timesheets);

app.use("/kpipersonals", employeeKpiCreation);
app.use("/kpi/employee/dashboard", employeeKpiDashboard);
app.use("/kpipersonals", employeeKpiManagement);
app.use("/kpi/evaluation/dashboard", employeeKpiEvaluationDashboard);
app.use("/kpimembers", employeeKpiEvaluation);
app.use("/kpi/organizational-unit", organizationalUnitKpiCreation);
app.use("/kpi/organizational-unit", organizationalUnitKpiDashboard);
app.use("/kpi/organizational-unit", organizationalUnitKpiManagement);

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

app.use("/task", taskManagement);
app.use("/performtask", taskPerform);
app.use("/tasktemplates", tasktemplate);
app.use("/taskprocess", taskProcess);
app.use("/educationPrograms", educationPrograms);
app.use("/courses", courses);

//asset
app.use("/assettype", assetType);
app.use("/assets", asset);
app.use("/recommendprocure", recommendProcure);
app.use("/recommenddistribute", recommendDistribute);

// Task report
app.use('/taskreports', taskReport);


// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on: ${port} !`));