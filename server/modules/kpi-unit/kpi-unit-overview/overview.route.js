const express = require("express");
const router = express.Router();
const overviewController = require("./overview.controller");
const {auth} = require('../../../middleware/index');

// get all kpi unit
router.get('/unit/:id',auth, overviewController.get);

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/current-unit/role/:id',auth, overviewController.getByRole);

// Lấy tất cả mục tiêu con của mục tiêu hiện tại
router.get('/child-target/:id',auth, overviewController.getChildTargetByParentId);

// Khởi tạo KPI đơn vị
router.post('/create',auth, overviewController.create);

// Cập nhật dữ liệu mới nhất cho kpi đơn vị
router.put('/evaluate/:id',auth, overviewController.evaluateKPI);

module.exports = router;