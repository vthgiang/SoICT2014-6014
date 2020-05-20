const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const {auth} = require('../../../../middleware/index');

// Tìm kiếm tất cả KPI nhân viên theo vai trò
router.get('/employee-kpis/:role', auth, DashboardController.getAllEmployeeKpiSetOfUnit);

// Tìm kiếm tất cả nhân viên theo vai trò
router.get('/users/:role', auth, DashboardController.getAllEmployeeOfUnit);

// Lấy các đơn vị con của một đơn vị và đơn vị đó
router.get('/organizational-units/:role', auth, DashboardController.getChildrenOfOrganizationalUnitsAsTree);

module.exports = router;
