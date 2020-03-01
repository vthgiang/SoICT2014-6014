const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./overview.controller");

// get all kpi personal
router.get('/user/:member', KPIPersonalController.getByMember);

module.exports = router;