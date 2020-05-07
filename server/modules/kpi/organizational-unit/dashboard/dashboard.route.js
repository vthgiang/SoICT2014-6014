const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại 
router.get('/childTargets/:id', auth, DashboardOrganizationalUnitController.getChildTargetOfOrganizationalUnitKpis);

module.exports = router;