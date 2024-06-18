const express = require("express");
const router = express.Router();
const managerController = require("./management.controller");
const { auth } = require(`../../../../middleware`);

// Copy mục tiêu của KPI tháng được chọn sang tháng mới
router.post('/organizational-unit-kpi-sets/:id/copy', auth, managerController.copyKPI);

router.post('/organizational-unit-kpi-sets/calculate', auth, managerController.calculateKpiUnit);

// Lấy logs của 1 tập kpi đơn vị
router.get('/organizational-unit-kpi-sets/:id/logs', auth, managerController.getOrganizationalUnitKpiSetLogs)

module.exports = router;