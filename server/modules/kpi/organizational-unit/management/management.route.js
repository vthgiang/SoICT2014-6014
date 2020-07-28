const express = require("express");
const router = express.Router();
const managerController = require("./management.controller");
const {auth} = require('../../../../middleware/index');

// Tìm kiếm KPI của đơn vị
router.get('/organizational-unit-kpi-sets/search-kpi',auth, managerController.get);

// Lấy tất cả mục tiêu nhân viên của một mục tiêu KPI đơn vị hiện tại
router.get('/organizational-unit-kpi-sets/:kpiId/child-target',auth, managerController.getChildTargetByParentId);

// Copy mục tiêu của KPI tháng được chọn sang tháng mới
router.post('/organizational-unit-kpi-sets/:kpiId/copy-kpi', auth, managerController.copyKPI);

module.exports = router;