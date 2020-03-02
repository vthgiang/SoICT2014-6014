const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./create.controller");

// lấy kpi cá nhân hiện tại
router.get('/current/:id', KPIPersonalController.getByUser);

// Khởi tạo KPI cá nhân
router.post('/create', KPIPersonalController.create);

// edit kpi personal by id
router.put('/:id', KPIPersonalController.edit);

// edit status of personal by id
router.put('/status/:id/:status', KPIPersonalController.editStatusKPIPersonal);

// delete kpi personal
router.delete('/:id', KPIPersonalController.delete);

// thêm mục tiêu cho kpi cá nhân
router.post('/create-target', KPIPersonalController.createTarget);

// edit target of personal by id
router.put('/target/:id', KPIPersonalController.editTarget);

// delete target of personal
router.delete('/target/:kpipersonal/:id', KPIPersonalController.deleteTarget);

// phê duyệt tất cả mục tiêu của kpi cá nhân
router.put('/approve/:id', KPIPersonalController.approveAllTarget);

module.exports = router;