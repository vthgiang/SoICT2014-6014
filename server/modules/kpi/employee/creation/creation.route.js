const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tập KPI cá nhân hiện tại
router.get('/current/:id',auth, KPIPersonalController.getEmployeeKpiSet);

// Khởi tạo KPI cá nhân
router.post('/create',auth, KPIPersonalController.createEmployeeKpiSet);

// Chỉnh sửa thông tin chung của KPI cá nhân
router.put('/:id',auth, KPIPersonalController.editEmployeeKpiSet);

// Chỉnh sửa trạng thái của KPI cá nhân
router.put('/status/:id/:status',auth, KPIPersonalController.updateEmployeeKpiSetStatus);

// Xóa KPI cá nhân
router.delete('/:id',auth, KPIPersonalController.deleteEmployeeKpiSet);

// Tạo 1 mục tiêu KPI mới
router.post('/create-target',auth, KPIPersonalController.createEmployeeKpi);

// Chỉnh sửa mục tiêu của KPI cá nhân
router.put('/target/:id',auth, KPIPersonalController.editEmployeeKpi);

// Xóa 1 mục tiêu KPI cá nhân
router.delete('/target/:kpipersonal/:id',auth, KPIPersonalController.deleteEmployeeKpi);

// // phê duyệt tất cả mục tiêu của kpi cá nhân
// router.put('/approve/:id',auth, KPIPersonalController.approveAllTarget);

module.exports = router;