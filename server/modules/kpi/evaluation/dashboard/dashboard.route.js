const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const {auth} = require('../../../../middleware/index');

// Lấy tất cả KPI của nhân viên theo vai trò
router.get('/employee-kpis/:role', auth, DashboardController.getAllEmployeeKpiSetOfUnit);

// Lấy tất cả nhân viên theo vai trò
router.get('/users/:role', auth, DashboardController.getAllEmployeeOfUnit);

// Lấy các đơn vị con của một đơn vị và đơn vị đó
router.get('/organizational-units/:role', auth, DashboardController.getChildrenOfOrganizationalUnitsAsTree);

module.exports = router;
