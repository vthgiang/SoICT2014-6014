const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');

// get all kpi unit
router.get('/unit/:id',auth, dashboardController.get);

// // Lấy KPI đơn vị hiện tại qua vai trò
// router.get('/current-unit/role/:id',auth, dashboardController.getByRole);

// // Lấy tất cả mục tiêu con của mục tiêu hiện tại
// router.get('/child-target/:id',auth, dashboardController.getChildTargetByParentId);

// // Khởi tạo KPI đơn vị
// router.post('/create',auth, dashboardController.create);

// Cập nhật dữ liệu mới nhất cho kpi đơn vị
router.put('/evaluate/:id',auth, dashboardController.evaluateKPI);

module.exports = router;