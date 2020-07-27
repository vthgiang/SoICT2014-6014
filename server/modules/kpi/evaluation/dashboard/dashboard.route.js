const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const {auth} = require('../../../../middleware/index');

router.get('/employee-kpis', auth, DashboardController.getAllEmployeeKpiSetOfUnitByRole);

module.exports = router;
