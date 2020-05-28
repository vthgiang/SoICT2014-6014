const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại 
router.get('/child-targets/:id', auth, DashboardOrganizationalUnitController.getAllChildTargetOfOrganizationalUnitKpis);

// Lấy tất cả task của organizationalUnit theo tháng hiện tại
router.get('/tasks/:id', auth, DashboardOrganizationalUnitController.getAllTaskOfOrganizationalUnit);

// Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị
router.get('/organizational-unit-kpi-set-each-year/:id/:year', auth, DashboardOrganizationalUnitController.getAllOrganizationalUnitKpiSetEachYear);

module.exports = router;