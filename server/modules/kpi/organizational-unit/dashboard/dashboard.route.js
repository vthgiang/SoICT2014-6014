const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại 
router.get('/organizational-unit-kpi-sets/employee-kpis', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiInOrganizationalUnit);

// Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị
router.get('/organizational-unit-kpi-sets/list-kpi-by-time', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetByTime);

// Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại
router.get('/organizational-unit-kpi-sets/child-organizational-unit', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetByTimeOfChildUnit);

// Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
router.get('/employee-kpi-sets/all-employee-kpi-sets-by-month', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiSetInOrganizationalUnit);

// Lấy tất cả employeeKpi thuộc các đơn vị con của đơn vị hiện tại
router.get('/employee-kpis/all-employee-kpis-children-by-month', auth, DashboardOrganizationalUnitController.getAllEmployeeKpiInChildrenOrganizationalUnit);

router.get('/organizational-units/get-children-of-organizational-unit-as-tree', auth, DashboardOrganizationalUnitController.getChildrenOfOrganizationalUnitsAsTree);

module.exports = router;