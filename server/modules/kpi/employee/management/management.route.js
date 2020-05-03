const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./management.controller");
const {auth} = require('../../../../middleware/index');
// get all kpi personal
router.get('/user/:member',auth, KPIPersonalController.getAllEmployeeKpiSets);

// get all kpi personal
router.get('/task/:member',auth, KPIPersonalController.getAllFinishedEmployeeKpiSets);

module.exports = router;