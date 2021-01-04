const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const { auth } = require(`../../../../middleware`);

router.get('/employee-kpis', auth, DashboardController.getAllEmployeeKpiSetOfUnitByIds);

module.exports = router;
