const express = require("express");
const router = express.Router();
const EmployeeKpiSetController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// Lấy tập KPI cá nhân hiện tại
router.get('/current/:id',auth, EmployeeKpiSetController.getEmployeeKpiSet);

// Khởi tạo KPI cá nhân
router.post('/create',auth, EmployeeKpiSetController.createEmployeeKpiSet);

// Chỉnh sửa thông tin chung của KPI cá nhân
router.put('/:id',auth, EmployeeKpiSetController.editEmployeeKpiSet);

// Chỉnh sửa trạng thái của KPI cá nhân
router.put('/status/:id/:status',auth, EmployeeKpiSetController.updateEmployeeKpiSetStatus);

// Xóa KPI cá nhân
router.delete('/:id',auth, EmployeeKpiSetController.deleteEmployeeKpiSet);

// Tạo 1 mục tiêu KPI mới
router.post('/create-target',auth, EmployeeKpiSetController.createEmployeeKpi);

// Chỉnh sửa mục tiêu của KPI cá nhân
router.put('/target/:id',auth, EmployeeKpiSetController.editEmployeeKpi);

// Xóa 1 mục tiêu KPI cá nhân
router.delete('/target/:kpipersonal/:id',auth, EmployeeKpiSetController.deleteEmployeeKpi);

// // phê duyệt tất cả mục tiêu của kpi cá nhân
// router.put('/approve/:id',auth, KPIPersonalController.approveAllTarget);

module.exports = router;