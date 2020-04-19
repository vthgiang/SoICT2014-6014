// NODE_MODULES
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const multer = require('multer');
multer({dest: 'upload/avatars'});
multer({dest: 'upload/docs'});
multer({dest: 'upload/excels'});
require('dotenv').config();

// MODULES
const log = require('./modules/system-admin-management/logs-management/log.route');
const user = require('./modules/super-admin-management/users-management/user.route');
const auth = require('./modules/auth/auth.route');
const company = require('./modules/system-admin-management/companies-management/company.route');
const role = require('./modules/super-admin-management/roles-management/role.route');
const link = require('./modules/super-admin-management/links-management/link.route');
const department = require('./modules/super-admin-management/departments-management/department.route');
const privilege = require('./modules/super-admin-management/privileges/privilege.route');
const component = require('./modules/super-admin-management/components-management/component.route');
const educationProgram = require('./modules/trainning-Course/education-program/education-program.route');
const course = require('./modules/trainning-Course/course/course.route');
const employee = require('./modules/employees-manager/employee/employee.route');
const salary = require('./modules/employees-manager/salary/salary.route');
const discipline = require('./modules/employees-manager/discipline/discipline.route');
const praise = require('./modules/employees-manager/praise/praise.route');
const sabbatical = require('./modules/employees-manager/sabbatical/sabbatical.route');
const notifications = require('./modules/notifications/notification.route');
const holiday = require('./modules/employees-manager/holiday/holiday.route');
const sample = require('./modules/_sample-module/_sample.route');
const document = require('./modules/documents-management/document.route');
const createKpiUnit = require("./modules/kpi-unit/kpi-unit-create/create.route");
// const overviewKpiUnit = require("./modules/kpi-unit/kpi-unit-overview/overview.route");
const dashboardKpiUnit = require("./modules/kpi-unit/kpi-unit-dashboard/dashboard.route");
const managerKpiUnit = require("./modules/kpi-unit/kpi-unit-manager/manager.route");
const createKpiPersonal = require("./modules/kpi-personal/kpi-personal-create/create.route")
const overviewKpiPersonal = require("./modules/kpi-personal/kpi-personal-overview/overview.route")
const tasktemplates =require ("./modules/task-template-management/task-template-management.route")
const tasks = require("./modules/task-management/task-management/task-management.route");
const performtask = require("./modules/task-management/perform-task/perform-task.route");
const linksDefault = require('./modules/system-admin-management/links-default-management/link-default.route');
const componentsDefault = require('./modules/system-admin-management/components-default-management/component-default.route');
const rolesDefault = require('./modules/system-admin-management/roles-default-management/role-default.route');
const kpimember = require('./modules/kpi-member/kpi-member-manager/kpiMember.route');

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
app.use('/upload', express.static('upload'));

// DB Config
const db = process.env.DATABASE;

// Connect to MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

global.isLog = false;
const Logger = require('./models/log.model');
Logger.findOne({
        name: 'log'
    })
    .then(result => {
        result.status ? isLog = true : isLog = false;
        // console.log("Logger status: ", isLog);
    })
    .catch(err => console.log("message: ", err));



app.use("/log", log);
app.use("/user", user);
app.use("/auth", auth);
app.use("/company", company);
app.use("/links-default-management", linksDefault);
app.use("/components-default-management", componentsDefault);
app.use("/roles-default-management", rolesDefault);
app.use("/role", role);
app.use("/link", link);
app.use("/department", department);
app.use("/privilege", privilege);
app.use("/educationProgram", educationProgram);
app.use("/course",course);
app.use("/employee", employee);
app.use("/salary", salary);
app.use("/discipline", discipline);
app.use("/praise", praise);
app.use("/sabbatical", sabbatical);
app.use("/notifications", notifications);
app.use("/holiday",holiday);
app.use("/sample", sample);
app.use("/document", document);
app.use("/component", component);

// app.use("/kpiunits", kpiunits);
app.use("/kpiunits", createKpiUnit);
// app.use("/kpiunits", overviewKpiUnit);
app.use("/kpiunits", dashboardKpiUnit);
app.use("/kpiunits", managerKpiUnit);

// app.use("/kpipersonals", kpipersonals);
app.use("/kpipersonals", createKpiPersonal);
app.use("/kpipersonals", overviewKpiPersonal);
app.use("/kpimembers", kpimember);
app.use("/tasktemplates", tasktemplates);

app.use("/tasks", tasks);
app.use("/performtask", performtask);
// console.log("ENV: ", process.env);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on: ${port} !`));