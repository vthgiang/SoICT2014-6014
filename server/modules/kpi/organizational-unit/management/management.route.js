const express = require("express");
const router = express.Router();
const managerController = require("./management.controller");
const {auth} = require('../../../../middleware/index');

// get all kpi unit
router.get('/unit/:id',auth, managerController.get);

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/current-unit/role/:id',auth, managerController.getByRole);

// Lấy tất cả mục tiêu con của mục tiêu hiện tại
router.get('/child-target/:id',auth, managerController.getChildTargetByParentId);

// Khởi tạo KPI đơn vị
router.post('/create',auth, managerController.create);

// Cập nhật dữ liệu mới nhất cho kpi đơn vị
router.put('/evaluate/:id',auth, managerController.evaluateKPI);

module.exports = router;