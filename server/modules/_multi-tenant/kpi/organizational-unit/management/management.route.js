const express = require("express");
const router = express.Router();
const managerController = require("./management.controller");
const {auth} = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);

// Copy mục tiêu của KPI tháng được chọn sang tháng mới
router.post('/organizational-unit-kpi-sets/:id/copy', auth, managerController.copyKPI);

module.exports = router;