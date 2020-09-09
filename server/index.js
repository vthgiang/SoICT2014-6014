// NODE_MODULES
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require('./connectDatabase');
require('./global');

// Application Modules
const schedulerController = require("./modules/scheduler/scheduler.controller");
const auth = require("./modules/auth/auth.route");

const documents = require("./modules/document/document.route");

const annualLeave = require("./modules/human-resource/annual-leave/annualLeave.route");
const commendation = require("./modules/human-resource/commendation/commendation.route");
const discipline = require("./modules/human-resource/discipline/discipline.route");
const holiday = require("./modules/human-resource/holiday/holiday.route");
const profile = require("./modules/human-resource/profile/profile.route");
const salary = require("./modules/human-resource/salary/salary.route");
const timesheet = require("./modules/human-resource/timesheets/timesheets.route");

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
const systemComponent = require("./modules/system-admin/system-component/systemComponent.route");
const systemLink = require("./modules/system-admin/system-link/systemLink.route");
const rootRole = require("./modules/system-admin/root-role/rootRole.route");
const systemSetting = require("./modules/system-admin/system-setting/systemSetting.route");

const tasktemplate = require("./modules/task/task-template/taskTemplate.route");
const taskManagement = require("./modules/task/task-management/task.route");
const taskPerform = require("./modules/task/task-perform/taskPerform.route");
const processes = require("./modules/task/tasks-process/taskProcess.route");
const educationPrograms = require("./modules/trainning/education-program/educationProgram.route");
const courses = require("./modules/trainning/course/course.route");

//asset
const assetType = require("./modules/asset/asset-type/asset-type.route");
const asset = require("./modules/asset/asset-management/asset.route");
const recommendProcure = require("./modules/asset/purchase-request/purchase-request.route");
const recommendDistribute = require("./modules/asset/use-request/use-request.route");

// report
const taskReport = require("./modules/report/task-report/taskReport.route");

//material
const material = require("./modules/warehouse/material/material.router");

//order
const order = require("./modules/order/order.route");
// plan

const plan = require("./modules/plan/plan.route");

// example

const example = require("./modules/example/example.route");

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

app.use("/upload/avatars", express.static("upload/avatars"));
app.use("/upload/asset/pictures", express.static("upload/asset/pictures"));



// Function gọi Api vào thời gian xác định
schedulerController.chedulesCallApi();

if (process.env.MULTI_TENANT === 'true') {
	// api multi-tenant
} else {
	app.use("/auth", auth);

	app.use("/documents", documents);

	app.use("/annualLeave", annualLeave);
	app.use("/commendation", commendation);
	app.use("/discipline", discipline);
	app.use("/holiday", holiday);
	app.use("/employees", profile);
	app.use("/salary", salary);
	app.use("/timesheet", timesheet);

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
	app.use("/system-admin/system-component", systemComponent);
	app.use("/system-admin/system-link", systemLink);
	app.use("/system-admin/root-role", rootRole);
	app.use("/system-admin/system-setting", systemSetting);

	app.use("/task", taskManagement);
	app.use("/performtask", taskPerform);
	app.use("/task/task-templates", tasktemplate);
	app.use("/process", processes);
	app.use("/educationPrograms", educationPrograms);
	app.use("/courses", courses);

	//asset
	app.use("/assettype", assetType);
	app.use("/asset", asset);
	app.use("/purchase-request", recommendProcure);
	app.use("/use-request", recommendDistribute);

	// Task report
	app.use("/taskreports", taskReport);

	// material
	app.use("/materials", material);

	//order
	app.use("/orders", order);

	// Plan
	app.use("/plans", plan);

	// example
	app.use("/examples", example);

	// Customer Management
	const crm = express.Router();
	crm.use(require("./modules/crm/customer/customer.route"));
	crm.use(require("./modules/crm/lead/lead.route"));
	crm.use(require("./modules/crm/care/care.route"));
	crm.use(require("./modules/crm/group/group.route"));
	crm.use(require("./modules/crm/statistic/statistic.route"));
	app.use("/crm", crm);
}

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server up and running on: ${port} !`));
