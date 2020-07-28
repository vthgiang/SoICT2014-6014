const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./management.controller");
const {auth} = require('../../../../middleware/index');
// get all kpi personal
router.get('/employee-kpi-sets/user/:member',auth, KPIPersonalController.getAllEmployeeKpiSets);

// get all kpi personal
router.get('/employee-kpi-sets/task/:member',auth, KPIPersonalController.getAllFinishedEmployeeKpiSets);

// get all kpi employee in department by month
router.get('/employee-kpi-sets/:user/:department/:date', auth, KPIPersonalController.getAllKPIEmployeeSetsInOrganizationByMonth);

router.post('/employee-kpi-sets/copykpi/:id/:idunit/:dateold/:datenew', auth, KPIPersonalController.copyKPI);
module.exports = router;