const express = require("express");
const router = express.Router();
const managerController = require("./management.controller");
const {auth} = require('../../../../middleware/index');

// get all kpi unit
router.get('/unit/:id',auth, managerController.get);
// Tìm kiếm kpi đơn vị
router.get('/all-unit/:role/:status/:startDate/:endDate', auth, managerController.getKPIUnits);

// Lấy tất cả mục tiêu con của mục tiêu hiện tại
router.get('/child-target/:id',auth, managerController.getChildTargetByParentId);

// Cập nhật dữ liệu mới nhất cho kpi đơn vị
router.put('/evaluate/:id',auth, managerController.evaluateKPI);

module.exports = router;