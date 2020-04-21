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



// Application Modules
const auth = require('./modules/auth/auth.route');

const document = require('./modules/document/document.route');

const annualLeave = require('./modules/human-resource/annual-leave/annualLeave.route');
const commendation = require('./modules/human-resource/commendation/commendation.route');
const discipline = require('./modules/human-resource/discipline/discipline.route');
const holiday = require('./modules/human-resource/holiday/holiday.route');
const profile = require('./modules/human-resource/profile/profile.route');
const salary = require('./modules/human-resource/salary/salary.route');

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
const providingComponent = require('./modules/system-admin/providing-component/providingComponent.route');
const providingLink = require('./modules/system-admin/providing-link/providingLink.route');
const rootRole = require('./modules/system-admin/root-role/rootRole.route');

const tasktemplate =require ("./modules/task/task-template/taskTemplate.route")
const taskManagement = require("./modules/task/task-management/task.route");
const taskPerform = require("./modules/task/task-perform/taskPerform.route");

const educationProgram = require('./modules/trainning/education-program/educationProgram.route');
const course = require('./modules/trainning/course/course.route');




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
global.isLog = false;
const Logger = require('./models/system-admin/log.model');
Logger.findOne({
        name: 'log'
    })
    .then(result => {
        result.status ? isLog = true : isLog = false;
    })
    .catch(err => console.log("message: ", err));





app.use("/auth", auth);

app.use("/document", document);

app.use("/sabbatical", annualLeave);
app.use("/praise", commendation);
app.use("/discipline", discipline);
app.use("/holiday",holiday);
app.use("/employee", profile);
app.use("/salary", salary);

app.use("/kpipersonals", employeeKpiCreation);
app.use("/kpi/employee/dashboard", employeeKpiDashboard);
app.use("/kpipersonals", employeeKpiManagement);
app.use("/kpi/evaluation/dashboard", employeeKpiEvaluationDashboard);
app.use("/kpimembers", employeeKpiEvaluation);
app.use("/kpiunits", organizationalUnitKpiCreation);
app.use("/kpiunits", organizationalUnitKpiDashboard);
app.use("/kpiunits", organizationalUnitKpiManagement);

app.use("/notifications", notifications);

app.use("/component", component);
app.use("/link", link);
app.use("/department", organizationalUnit);
app.use("/privilege", privilege);
app.use("/role", role);
app.use("/user", user);

app.use("/company", company);
app.use("/log", log);
app.use("/components-default-management", providingComponent);
app.use("/links-default-management", providingLink);
app.use("/roles-default-management", rootRole);

app.use("/tasks", taskManagement);
app.use("/performtask", taskPerform);
app.use("/tasktemplates", tasktemplate);

app.use("/educationProgram", educationProgram);
app.use("/course",course);



// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on: ${port} !`));