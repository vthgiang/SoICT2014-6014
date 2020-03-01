const express = require("express");
const router = express.Router();
const overviewController = require("./overview.controller");

// get all kpi unit
router.get('/unit/:id', overviewController.get);

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/current-unit/role/:id', overviewController.getByRole);

// Lấy tất cả mục tiêu con của mục tiêu hiện tại
router.get('/child-target/:id', overviewController.getChildTargetByParentId);

// Khởi tạo KPI đơn vị
router.post('/create', overviewController.create);

// Cập nhật dữ liệu mới nhất cho kpi đơn vị
router.put('/evaluate/:id', overviewController.evaluateKPI);

module.exports = router;