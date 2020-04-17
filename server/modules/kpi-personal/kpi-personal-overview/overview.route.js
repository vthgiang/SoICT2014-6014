const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./overview.controller");
const {auth} = require('../../../middleware/index');
// get all kpi personal
router.get('/user/:member',auth, KPIPersonalController.getByMember);

// get all kpi personal
router.get('/task/:member',auth, KPIPersonalController.getKPIResponsible);

module.exports = router;