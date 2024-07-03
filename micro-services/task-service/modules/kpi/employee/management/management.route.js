const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./management.controller");
const {auth} = require(`../../../../middleware`);

router.post('/employee-kpi-sets/:id/copy', auth, KPIPersonalController.copyKPI);

// Lấy logs của 1 tập kpi cá nhân
router.get('/employee-kpi-sets/:id/logs', auth, KPIPersonalController.getEmployeeKpiSetLogs)

module.exports = router;