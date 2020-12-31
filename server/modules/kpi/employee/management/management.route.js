const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./management.controller");
const {auth} = require(`../../../../middleware`);

router.post('/employee-kpi-sets/:id/copy', auth, KPIPersonalController.copyKPI);

module.exports = router;