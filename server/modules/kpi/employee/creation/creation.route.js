const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// lấy kpi cá nhân hiện tại
router.get('/current/:id',auth, KPIPersonalController.getEmployeeKpiSet);

// Khởi tạo KPI cá nhân
router.post('/create',auth, KPIPersonalController.createEmployeeKpiSet);

// edit kpi personal by id
router.put('/:id',auth, KPIPersonalController.editEmployeeKpiSet);

// edit status of personal by id
router.put('/status/:id/:status',auth, KPIPersonalController.updateEmployeeKpiSetStatus);

// delete kpi personal
router.delete('/:id',auth, KPIPersonalController.deleteEmployeeKpiSet);

// thêm mục tiêu cho kpi cá nhân
router.post('/create-target',auth, KPIPersonalController.createEmployeeKpi);

// edit target of personal by id
router.put('/target/:id',auth, KPIPersonalController.editEmployeeKpi);

// delete target of personal
router.delete('/target/:kpipersonal/:id',auth, KPIPersonalController.deleteEmployeeKpi);

// // phê duyệt tất cả mục tiêu của kpi cá nhân
// router.put('/approve/:id',auth, KPIPersonalController.approveAllTarget);

module.exports = router;