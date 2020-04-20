const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// lấy kpi cá nhân hiện tại
router.get('/current/:id',auth, KPIPersonalController.getByUser);

// Khởi tạo KPI cá nhân
router.post('/create',auth, KPIPersonalController.create);

// edit kpi personal by id
router.put('/:id',auth, KPIPersonalController.edit);

// edit status of personal by id
router.put('/status/:id/:status',auth, KPIPersonalController.editStatusKPIPersonal);

// delete kpi personal
router.delete('/:id',auth, KPIPersonalController.delete);

// thêm mục tiêu cho kpi cá nhân
router.post('/create-target',auth, KPIPersonalController.createTarget);

// edit target of personal by id
router.put('/target/:id',auth, KPIPersonalController.editTarget);

// delete target of personal
router.delete('/target/:kpipersonal/:id',auth, KPIPersonalController.deleteTarget);

// // phê duyệt tất cả mục tiêu của kpi cá nhân
// router.put('/approve/:id',auth, KPIPersonalController.approveAllTarget);

module.exports = router;