const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);

router.get('/employee-kpis', auth, DashboardController.getAllEmployeeKpiSetOfUnitByIds);

module.exports = router;
