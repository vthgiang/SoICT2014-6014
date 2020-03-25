const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./overview.controller");

// get all kpi personal
router.get('/user/:member', KPIPersonalController.getByMember);

// get all kpi personal
router.get('/task/:member', KPIPersonalController.getKPIResponsible);

module.exports = router;