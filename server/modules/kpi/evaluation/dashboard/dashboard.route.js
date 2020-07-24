const express = require("express");
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const {auth} = require('../../../../middleware/index');

router.get('/employee-kpis/:role', auth, DashboardController.getAllEmployeeKpiSetOfUnitByRole);

router.get('/users/:role', auth, DashboardController.getAllEmployeeOfUnitByRole);

router.get('/organizational-units/:role', auth, DashboardController.getChildrenOfOrganizationalUnitsAsTree);

module.exports = router;
