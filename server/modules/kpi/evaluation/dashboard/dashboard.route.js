const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const {auth} = require('../../../../middleware/index');

// Lấy tất cả KPI của nhân viên theo vai trò
router.get('/employee-kpis/roles/:role', auth, DashboardController.getAllEmployeeKpiSetOfUnitByRole);

// Lấy tất cả nhân viên theo vai trò
router.get('/users/roles/:role', auth, DashboardController.getAllEmployeeOfUnitByRole);

// Lấy tất cả KPI của nhân viên theo mảng id đơn vị
router.get('/employee-kpis/organizational-units/:id', auth, DashboardController.getAllEmployeeKpiSetOfUnitByIds);

// Lấy tất cả nhân viên theo mảng id đơn vị
router.get('/users/organizational-units/:id', auth, DashboardController.getAllEmployeeOfUnitByIds);

// Lấy các đơn vị con của một đơn vị và đơn vị đó
router.get('/organizational-units/:role', auth, DashboardController.getChildrenOfOrganizationalUnitsAsTree);

module.exports = router;
