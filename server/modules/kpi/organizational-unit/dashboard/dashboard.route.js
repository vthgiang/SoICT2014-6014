const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại 
router.get('/employee-kpi-in-organizational-unit/:roleId', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiInOrganizationalUnit);

// Lấy tất cả task của organizationalUnit theo tháng hiện tại
router.get('/tasks-of-organizational-unit/:roleId', auth, DashboardOrganizationalUnitController.getAllTaskOfOrganizationalUnit);

// Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị
router.get('/organizational-unit-kpi-set/:organizationalUnitId/:startDate/:endDate', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetByTime);

// Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại
router.get('/organizational-unit-kpi-set-of-child-organizational-unit', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetByTimeOfChildUnit);

// Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
router.get('/employee-kpi-set-in-organizational-unit', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiSetInOrganizationalUnit);
// /:organizationalUnitId/:month
// Lấy tất cả employeeKpi thuộc các đơn vị con của đơn vị hiện tại
router.get('/employee-kpi-in-children-organizational-unit/:roleId', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiInChildrenOrganizationalUnit);

module.exports = router;