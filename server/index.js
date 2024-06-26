// NODE_MODULES
let path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const server = require('http').createServer(app);

const swaggerUI = require('swagger-ui-express');
const { auth } = require(`./middleware`);
const { SystemApiControllers } = require('./modules/system-admin/system-api/system-api-management/systemApi.controller');
const { openApiData } = require('./api-docs/openapi');
const schedule = require('node-schedule');

require('dotenv').config();
// require("./connectDatabase");
require('./global')(server);

app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

// Api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiData));

// Route upload
app.use('/upload/avatars', express.static('upload/avatars'));
app.use('/upload/template-imports', express.static('upload/template-imports'));

app.use('/upload/user-guide/task', express.static('upload/user-guide/task'));
app.use('/upload/user-guide/kpi', express.static('upload/user-guide/kpi'));
app.use('/upload/user-guide/hr', express.static('upload/user-guide/hr'));
app.use('/upload/user-guide/system', express.static('upload/user-guide/system'));
app.use('/upload/user-guide/document', express.static('upload/user-guide/document'));
app.use('/upload/user-guide/asset', express.static('upload/user-guide/asset'));
app.use('/upload/user-guide/bill', express.static('upload/user-guide/bill'));

const router = express.Router();

router.use('/auth', require('./modules/auth/auth.route'));
router.use('/auth-service', require('./modules/auth-service/auth.route'));

router.use('/annualLeave', require('./modules/human-resource/annual-leave/annualLeave.route'));
router.use('/commendation', require('./modules/human-resource/commendation/commendation.route'));
router.use('/discipline', require('./modules/human-resource/discipline/discipline.route'));
router.use('/workPlan', require('./modules/human-resource/work-plan/workPlan.route'));
router.use('/employee', require('./modules/human-resource/profile/profile.route'));
router.use('/salary', require('./modules/human-resource/salary/salary.route'));
router.use('/field', require('./modules/human-resource/field/field.route'));
router.use('/timesheet', require('./modules/human-resource/timesheets/timesheets.route'));

router.use('/get-employee-dashboard-data', require('./modules/human-resource/get-employee-dashboard-chart/get-data.route'));

router.use('/bidding-contracts', require('./modules/bidding/bidding-contract/biddingContract.route'));
router.use('/majors', require('./modules/human-resource/major/major.route'));
router.use('/tags', require('./modules/bidding/tag/tag.route'));
router.use('/career-positions', require('./modules/human-resource/career-position/careerPosition.route'));
router.use('/bidding-package', require('./modules/bidding/bidding-package/biddingPackage.route'));
router.use('/certificates', require('./modules/human-resource/certificate/certificate.route'));

// Router KPI
router.use('/kpi/employee/creation', require('./modules/kpi/employee/creation/creation.route'));
router.use('/kpi/employee/dashboard', require('./modules/kpi/employee/dashboard/dashboard.route'));
router.use('/kpi/employee/management', require('./modules/kpi/employee/management/management.route'));
router.use('/kpi/evaluation/dashboard', require('./modules/kpi/evaluation/dashboard/dashboard.route'));
router.use('/kpi/evaluation/employee-evaluation', require('./modules/kpi/evaluation/employee-evaluation/employeeEvaluation.route'));
router.use('/kpi/organizational-unit/creation', require('./modules/kpi/organizational-unit/creation/creation.route'));
router.use('/kpi/organizational-unit/dashboard', require('./modules/kpi/organizational-unit/dashboard/dashboard.route'));
router.use('/kpi/organizational-unit/management', require('./modules/kpi/organizational-unit/management/management.route'));
router.use('/kpi/template', require('./modules/kpi/template/template.route'));
router.use('/kpi/allocation', require('./modules/kpi/kpi-allocation/config-setting/configSetting.route'));
router.use('/kpi/allocation/task-package', require('./modules/kpi/kpi-allocation/task-package/taskPackage.route'))

router.use('/notifications', require('./modules/notification/notification.route'));

router.use('/configuration', require('./modules/super-admin/module-configuration/moduleConfiguration.route'));

router.use('/system', require('./modules/super-admin/system/system.route'));
router.use('/user', require('./modules/super-admin/user/user.route'));
router.use('/service', require('./modules/super-admin/service/service.route'));
router.use('/role', require('./modules/super-admin/role/role.route'));
router.use('/component', require('./modules/super-admin/component/component.route'));
router.use('/link', require('./modules/super-admin/link/link.route'));
router.use('/attribute', require('./modules/super-admin/attribute/attribute.route'));
router.use('/policy', require('./modules/super-admin/policy/policy.route'));
router.use('/api', require('./modules/super-admin/api/api.route'));
router.use('/organizational-units', require('./modules/super-admin/organizational-unit/organizationalUnit.route'));

// Router quản trị hệ thống

router.use('/system-admin/company', require('./modules/system-admin/company/company.route'));
router.use('/system-admin/system-component', require('./modules/system-admin/system-component/systemComponent.route'));
router.use('/system-admin/system-link', require('./modules/system-admin/system-link/systemLink.route'));
router.use('/system-admin/system-api', require('./modules/system-admin/system-api/system-api-management/systemApi.route'));
router.use('/system-admin/privilege-api', require('./modules/system-admin/system-api/system-api-privilege/privilegeSystemApi.route'));
router.use('/system-admin/root-role', require('./modules/system-admin/root-role/rootRole.route'));
router.use('/system-admin/system-setting', require('./modules/system-admin/system-setting/systemSetting.route'));
router.use('/system-admin/system-page', require('./modules/system-admin/system-page/systemPage.route'));
// router.use('/system-admin/identity-service', require('./modules/identity.service/identity.service.route'));

// Router service identity
router.use('/authorization/authorize-service-consumer', require('./modules/authorization/authorize-service-consumer/authorize-service-consumer.route'));
router.use('/authorization/external-policies', require('./modules/authorization/external-policies/external-policies.route'));
router.use('/authorization/external-service-consumers', require('./modules/authorization/external-service-consumers/external-service-consumers.route'));
router.use('/authorization/internal-policies', require('./modules/authorization/internal-policies/internal-policies.route'));
router.use('/authorization/internal-service-identities', require('./modules/authorization/internal-service-identities/internal-service-identities.route'));
router.use('/authorization/logging', require('./modules/authorization/logging/logging.route'));

// Router Quản lý ủy quyền
router.use('/delegation', require('./modules/delegation/delegation.route'));

router.use('/task', require('./modules/task/task-management/task.route'));
router.use('/performtask', require('./modules/task/task-perform/taskPerform.route'));
router.use('/task/task-templates', require('./modules/task/task-template/taskTemplate.route'));

router.use('/process', require('./modules/task/tasks-process/taskProcess.route'));
router.use('/educationProgram', require('./modules/trainning/education-program/educationProgram.route'));
router.use('/course', require('./modules/trainning/course/course.route'));

router.use('/assettype', require('./modules/asset/asset-type/asset-type.route'));
router.use('/asset', require('./modules/asset/asset-management/asset.route'));
//asset lot
router.use('/assetlot', require('./modules/asset/asset-lot-management/asset-lot.route'));

router.use('/purchase-request', require('./modules/asset/purchase-request/purchase-request.route'));
router.use('/use-request', require('./modules/asset/use-request/use-request.route'));

//supplies
router.use('/supplies', require('./modules/supplies/supplies-management/supplies.route'));
router.use('/allocation-supplies', require('./modules/supplies/allocation-management/allocation-history.route'));
router.use('/purchase-invoice', require('./modules/supplies/purchase-invoice-management/purchase-invoice.route'));
router.use('/supplies-request', require('./modules/supplies/purchase-request/purchase-request.route'));

// Task report
router.use('/taskreports', require('./modules/report/task-report/taskReport.route'));

// Warehouse
router.use('/stocks', require('./modules/production/warehouse/stock/stock.route'));
router.use('/categories', require('./modules/production/common-production/category/category.route'));
router.use('/goods', require('./modules/production/common-production/good/good.route'));
router.use(
    '/product-request-management',
    require('./modules/production/common-production/product-request-management/productRequestManagement.route')
);
router.use('/bin-locations', require('./modules/production/warehouse/bin-location/binLocation.route'));
router.use('/lot', require('./modules/production/warehouse/inventory/inventory.route'));
router.use('/bills', require('./modules/production/warehouse/bill/bill.route'));

router.use('/examples', require('./modules/example/example.route'));
router.use('/documents', require('./modules/document/document.route'));

router.use('/dashboard-unit', require('./modules/dashboard-unit/dashboardUnit.route'));

// manufacturing-process
router.use('/manufacturing-chain', require('./modules/manufacturing-process/template-production-line/productionLineTemplate.route'));
router.use('/report-issue', require('./modules/manufacturing-process/manage-issue/manageIssue.route'));
router.use(
    '/manager-manufacturing-process',
    require('./modules/manufacturing-process/manufacturing-process-manager/manufacturingProcessManager.route')
);
router.use('/asset-template', require('./modules/manufacturing-process/manufacturing-asset-template/assetTemplate.route'));

router.use("/dashboard-unit", require("./modules/dashboard-unit/dashboardUnit.route"));
router.use("/layout", require("./modules/production/warehouse/layout/layout.route"));
router.use("/inventory-warehouse", require("./modules/production/warehouse/inventory-warehouse/inventory-warehouse.route"));

// manufacturing-process
router.use("/manufacturing-chain", require("./modules/manufacturing-process/template-production-line/productionLineTemplate.route"));
router.use("/report-issue", require("./modules/manufacturing-process/manage-issue/manageIssue.route"));
router.use("/manager-manufacturing-process", require("./modules/manufacturing-process/manufacturing-process-manager/manufacturingProcessManager.route"));
router.use("/asset-template", require("./modules/manufacturing-process/manufacturing-asset-template/assetTemplate.route"));

// CRM
app.use('/crm/customers', require('./modules/crm/customer/customer.route'));
app.use('/crm/cares', require('./modules/crm/care/care.route'));
app.use('/crm/careTypes', require('./modules/crm/careType/careType.route'));
app.use('/crm/groups', require('./modules/crm/group/group.route'));
app.use('/crm/status', require('./modules/crm/status/status.route'));
app.use('/crm/evaluations', require('./modules/crm/evaluation/evaluation.route'));
app.use('/crm/loyalCustomers', require('./modules/crm/loyalCustomer/loyalCustomer.route'));
app.use('/crm/customerRankPoints', require('./modules/crm/rankPoint/customerRankPoint.route'));
app.use('/crm/crmUnits', require('./modules/crm/crmUnit/crmUnit.route'));
app.use('/crm/crmUnitKPI', require('./modules/crm/crmUnitKPI/crmUnitKPI.route'));

// production - manufaturing
app.use('/manufacturing-mill', require('./modules/production/manufacturing/manufacturingMill/manufacturingMill.route'));
app.use('/manufacturing-works', require('./modules/production/manufacturing/manufacturingWorks/manufacturingWorks.route'));
app.use('/purchasing-request', require('./modules/production/manufacturing/purchasingRequest/purchasingRequest.route'));
app.use('/work-schedule', require('./modules/production/manufacturing/workSchedule/workSchedule.route'));
app.use('/manufacturing-plan', require('./modules/production/manufacturing/manufacturingPlan/manufacturingPlan.route'));
app.use('/manufacturing-command', require('./modules/production/manufacturing/manufacturingCommand/manufacturingCommand.route'));
app.use(
    '/manufacturing-quality/error',
    require('./modules/production/manufacturing/manufacturingQuality/manufacturingQualityError/manufacturingQualityError.route')
);
app.use(
    '/manufacturing-quality/criteria',
    require('./modules/production/manufacturing/manufacturingQuality/manufacturingQualityCriteria/manufacturingQualityCriteria.route')
);
app.use(
    '/manufacturing-quality/inspection',
    require('./modules/production/manufacturing/manufacturingQuality/manufacturingQualityInspection/manufacturingQualityInspection.route')
);
app.use('/manufacturing-routing', require('./modules/production/manufacturing/manufacturingRouting/manufacturingRouting.route'));

//order
app.use('/quote', require('./modules/production/order/quote/quote.route'));
app.use('/coin-rule', require('./modules/production/order/coin-rule/coinRule.route'));
app.use('/bank-account', require('./modules/production/order/bank-account/bankAccount.route'));
app.use('/discount', require('./modules/production/order/discount/discount.route'));
app.use('/purchase-order', require('./modules/production/order/purchase-order/purchaseOrder.route'));
app.use('/sales-order', require('./modules/production/order/sales-order/salesOrder.route'));
app.use('/sla', require('./modules/production/order/sla/sla.route'));
app.use('/tax', require('./modules/production/order/tax/tax.route'));
app.use('/payment', require('./modules/production/order/payment/payment.route'));
app.use('/business-department', require('./modules/production/order/business-department/businessDepartment.route'));
app.use('/news-feed', require('./modules/news-feed/newsFeed.route'));
app.use('/marketing-campaign', require('./modules/production/order/marketing-campaign/marketingCampaign.route'));
app.use('/marketing-effective', require('./modules/production/order/marketing-effective/marketingEffective.route'));
app.use('/forecasts', require('./modules/production/order/forecast/sales-forecast/salesForecast.route')) 

// project
app.use('/projects', require('./modules/project/project-management/project.route'));
app.use('/projects', require('./modules/project/project-phase/projectPhase.route'));
app.use('/project-templates', require('./modules/project-template/projectTemplate.route'));

//risk
app.use('/risk', require('./modules/risk-management/risk-list/risk.route'));
app.use('/riskDistribution', require('./modules/risk-management/riskDistribution/riskDistribution.route'));
app.use('/taskPert', require('./modules/risk-management/process-analysis/taskPert.route'));
app.use('/exprimentalAnalysis', require('./modules/exprimental-analysis/exprimentalAnalysis.route'));
app.use('/riskResponsePlan', require('./modules/risk-management/risk-response-plan/riskResponsePlan.router'));
app.use('/riskResponsePlanRequest', require('./modules/risk-management/change-process-request/request.router'));

app.use('/transport-requirement', require('./modules/production/transport/transportRequirements/transportRequirements.route'));
app.use('/transport-plan', require('./modules/production/transport/transportPlan/transportPlan.route'));
app.use('/transport-vehicle', require('./modules/production/transport/transportVehicle/transportVehicle.route'));
app.use('/transport-schedule', require('./modules/production/transport/transportSchedule/transportSchedule.route'));
app.use('/transport-process', require('./modules/production/transport/transportProcess/transportProcess.route'));
app.use('/transport-department', require('./modules/production/transport/transportDepartment/transportDepartment.route'));

// transportation module
app.use("/transportation/vehicle", require("./modules/transportation/vehicle/vehicle.route"));
app.use("/transportation/delivery-plan", require("./modules/transportation/delivery-plan/deliveryPlan.route"));
app.use("/transportation/journeys", require("./modules/transportation/journey/journey.route"));
app.use("/transportation/shippers", require("./modules/transportation/shipper-report/shipperReport.route"));
app.use("/transportation/costs", require("./modules/transportation/cost/transportationCost.route"));
app.use("/transportation/cost-formula", require("./modules/transportation/cost-formula/costFormula.route"));
app.use("/transportation/manage-shipper", require("./modules/transportation/manage-shipper/manageShipper.route"));
app.use("/transportation/dashboard", require("./modules/transportation/dashboard/dashboard.route"));

// transport3
app.use('/transport3', require('./modules/transport3/order/order.route'));
app.use('/transport3', require('./modules/transport3/employee/employee.route'));
app.use('/transport3', require('./modules/transport3/vehicle/vehicle.route'));
app.use('/transport3', require('./modules/transport3/schedule/schedule.route'));
app.use('/transport3', require('./modules/transport3/ontime/ontimePredict.route'));
app.use('/transport3', require('./modules/transport3/issue/issue.route'));

// transportation module
app.use("/transportation/vehicle", require("./modules/transportation/vehicle/vehicle.route"));
app.use("/transportation/delivery-plan", require("./modules/transportation/delivery-plan/deliveryPlan.route"));
app.use("/transportation/journeys", require("./modules/transportation/journey/journey.route"));
app.use("/transportation/shippers", require("./modules/transportation/shipper-report/shipperReport.route"));
app.use("/transportation/costs", require("./modules/transportation/cost/transportationCost.route"));
app.use("/transportation/cost-formula", require("./modules/transportation/cost-formula/costFormula.route"));
app.use("/transportation/manage-shipper", require("./modules/transportation/manage-shipper/manageShipper.route"));

app.use("/projects", require("./modules/project/project-management/project.route"));
app.use("/projects", require("./modules/project/project-phase/projectPhase.route"));
app.use("/project-templates", require("./modules/project-template/projectTemplate.route"));
app.use("/projects", require("./modules/project/project-proposal/projectProposal.route"))


// capacity
app.use("/capacities", require("./modules/capacity/capacity.route"));

app.use(router);

// Cập nhật các api mới nhất
app.post('/system-admin/system-api/system-apis/update-auto', auth, (req, res) => SystemApiControllers.updateSystemApi(app, req, res));

/**
 * Server initial
 */
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server up and running on: ${port} !`);
});
