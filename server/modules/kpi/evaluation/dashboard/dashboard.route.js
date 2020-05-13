const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const {auth} = require('../../../../middleware/index');

// Tìm kiếm tất cả KPI nhân viên theo vai trò
router.get('/get-all-employee-kpi/:role', auth, DashboardController.getAllEmployeeKpiSetOfUnit);

module.exports = router;
