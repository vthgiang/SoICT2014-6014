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

if(process.env.MULTI_TENANT === 'true'){
	const router = express.Router();

	router.use('/auth', require('./modules/_multi-tenant/auth/auth.route'));

    // router.use('/user', require('./modules/_multi-tenant/super-admin/user/user.route'));
    // router.use('/role', require('./modules/_multi-tenant/super-admin/role/role.route'));
    // router.use('/component', require("./modules/_multi-tenant/super-admin/component/component.route"));
    // router.use('/link', require("./modules/_multi-tenant/super-admin/link/link.route"));
    // router.use('/organizational-units', require("./modules/_multi-tenant/super-admin/organizational-unit/organizationalUnit.route"));
    // router.use('/privilege', require("./modules/_multi-tenant/super-admin/privilege/privilege.route"));
    
    // router.use('/system-admin/company', require("./modules/_multi-tenant/system-admin/company/company.route"));
    // router.use('/system-admin/system-component', require("./modules/_multi-tenant/system-admin/system-component/systemComponent.route"));
    // router.use('/system-admin/system-link', require("./modules/_multi-tenant/system-admin/system-link/systemLink.route"));
    // router.use('/system-admin/root-role', require("./modules/_multi-tenant/system-admin/root-role/rootRole.route"));
	// router.use('/system-admin/system-setting', require("./modules/_multi-tenant/system-admin/system-setting/systemSetting.route"));
	
	app.use(router);
}else{
	app.use("/auth", require("./modules/auth/auth.route"));

	app.use("/documents", require("./modules/document/document.route"));

	app.use("/annualLeave", require("./modules/human-resource/annual-leave/annualLeave.route"));
	app.use("/commendation", require("./modules/human-resource/commendation/commendation.route"));
	app.use("/discipline", require("./modules/human-resource/discipline/discipline.route"));
	app.use("/holiday", require("./modules/human-resource/holiday/holiday.route"));
	app.use("/employees", require("./modules/human-resource/profile/profile.route"));
	app.use("/salary", require("./modules/human-resource/salary/salary.route"));
	app.use("/timesheet", require("./modules/human-resource/timesheets/timesheets.route"));

	app.use("/kpi/employee/creation", require("./modules/kpi/employee/creation/creation.route"));
	app.use("/kpi/employee/dashboard", require("./modules/kpi/employee/dashboard/dashboard.route"));
	app.use("/kpi/employee/management", require("./modules/kpi/employee/management/management.route"));
	app.use("/kpi/evaluation/dashboard", require("./modules/kpi/evaluation/dashboard/dashboard.route"));
	app.use("/kpi/evaluation/employee-evaluation", require("./modules/kpi/evaluation/employee-evaluation/employeeEvaluation.route"));
	app.use("/kpi/organizational-unit/creation", require("./modules/kpi/organizational-unit/creation/creation.route"));
	app.use("/kpi/organizational-unit/dashboard", require("./modules/kpi/organizational-unit/dashboard/dashboard.route"));
	app.use("/kpi/organizational-unit/management", require("./modules/kpi/organizational-unit/management/management.route"));

	app.use("/notifications", require("./modules/notification/notification.route"));

	app.use("/component", require("./modules/super-admin/component/component.route"));
	app.use("/link", require("./modules/super-admin/link/link.route"));
	app.use("/organizational-units", require("./modules/super-admin/organizational-unit/organizationalUnit.route"));
	app.use("/privilege", require("./modules/super-admin/privilege/privilege.route"));
	app.use("/role", require("./modules/super-admin/role/role.route"));
	app.use("/user", require("./modules/super-admin/user/user.route"));

	app.use("/system-admin/company", require("./modules/system-admin/company/company.route"));
	app.use("/system-admin/system-component", require("./modules/system-admin/system-component/systemComponent.route"));
	app.use("/system-admin/system-link", require("./modules/system-admin/system-link/systemLink.route"));
	app.use("/system-admin/root-role", require("./modules/system-admin/root-role/rootRole.route"));
	app.use("/system-admin/system-setting", require("./modules/system-admin/system-setting/systemSetting.route"));

	app.use("/task", require("./modules/task/task-management/task.route"));
	app.use("/performtask", require("./modules/task/task-perform/taskPerform.route"));
	app.use("/task/task-templates", require("./modules/task/task-template/taskTemplate.route"));
	app.use("/process", require("./modules/task/tasks-process/taskProcess.route"));
	app.use("/educationPrograms", require("./modules/trainning/education-program/educationProgram.route"));
	app.use("/courses", require("./modules/trainning/course/course.route"));

	//asset
	app.use("/assettype", require("./modules/asset/asset-type/asset-type.route"));
	app.use("/asset", require("./modules/asset/asset-management/asset.route"));
	app.use("/purchase-request", require("./modules/asset/purchase-request/purchase-request.route"));
	app.use("/use-request", require("./modules/asset/use-request/use-request.route"));

	// Task report
	app.use("/taskreports", require("./modules/report/task-report/taskReport.route"));

	// material
	app.use("/materials", require("./modules/warehouse/material/material.router"));

	//order
	app.use("/orders", require("./modules/order/order.route"));

	// Plan
	app.use("/plans", require("./modules/plan/plan.route"));

	// example
	app.use("/examples", require("./modules/example/example.route"));

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
