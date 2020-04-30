const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./employeeEvaluation.controller");
const { auth } = require('../../../../middleware');
// Tìm kiếm KPI nhân viên
router.get('/all-member/:role/:user/:status/:starttime/:endtime', auth, KPIPersonalController.getKPIAllMember);

// get all kpi personal
router.get('/user/:member', auth, KPIPersonalController.getByMember);

// Lấy kpi cá nhân theo id
router.get('/:id',auth,  KPIPersonalController.getById);

// Lấy kpi cá nhân theo tháng
router.get('/member/:id/:time', auth, KPIPersonalController.getByMonth);

// phê duyệt tất cả mục tiêu của kpi cá nhân
router.put('/approve/:id', auth, KPIPersonalController.approveAllTarget);

// edit target of personal by id
router.put('/target/:id', auth, KPIPersonalController.editTarget);

// chỉnh sửa trạng thái từng mục tiêu của kpi cá nhân
router.put('/status-target/:id/:status', auth, KPIPersonalController.editStatusTarget);

// lấy task cho kpi
router.get('/task/:id',  KPIPersonalController.getTaskById);

router.get('/detailkpi/:id', auth, KPIPersonalController.getSystemPoint);

// đánh giá điểm của kpi
router.put('/appovepoint/:id_kpi/:id_target', KPIPersonalController.setPointKPI);

module.exports = router;