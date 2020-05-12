const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại 
router.get('/childTargets/:id', auth, DashboardOrganizationalUnitController.getAllChildTargetOfOrganizationalUnitKpis);

// Lấy tất cả task của organizationalUnit hiện tại (chỉ lấy phần evaluations của tháng hiện tại)
router.get('/tasks/:id', auth, DashboardOrganizationalUnitController.getAllTaskOfOrganizationalUnit);

module.exports = router;