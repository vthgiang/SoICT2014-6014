const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại 
router.get('/child-targets/:roleId', auth, DashboardOrganizationalUnitController.getAllChildTargetOfOrganizationalUnitKpis);

// Lấy tất cả task của organizationalUnit theo tháng hiện tại
router.get('/tasks/:roleId', auth, DashboardOrganizationalUnitController.getAllTaskOfOrganizationalUnit);

// Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị
router.get('/organizational-unit-kpi-set-each-year/:organizationalUnitId/:year', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetEachYear);

// Lấy danh sách các tập KPI đơn vị theo từng năm của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại
router.get('/organizational-unit-kpi-set-each-year-of-child/:roleId/:year', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetEachYearOfChildUnit);

// Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
router.get('/employee-kpi-set-in-organizational-unit/:roleId/:month', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiSetInOrganizationalUnit);

module.exports = router;