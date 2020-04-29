const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');

// Tìm kiếm KPI nhân viên
router.get('/all-member/:role/:user/:status/:starttime/:endtime', auth, DashboardController.getKPIAllMember);

// get all kpi personal
router.get('/user/:member', auth, DashboardController.getByMember);
module.exports = router;
