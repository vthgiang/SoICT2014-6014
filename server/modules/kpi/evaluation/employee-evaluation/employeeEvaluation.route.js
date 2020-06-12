const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./employeeEvaluation.controller");
const { auth } = require('../../../../middleware');
// Tìm kiếm KPI nhân viên
router.get('/all-member/:role/:user/:status/:startDate/:endDate', auth, KPIPersonalController.getKPIAllMember);

// get all kpi personal
router.get('/user/:member', auth, KPIPersonalController.getByMember);

// Lấy kpi cá nhân theo id
router.get('/:id',auth,  KPIPersonalController.getById);

// Lấy kpi cá nhân theo tháng
router.get('/member/:id/:date', auth, KPIPersonalController.getByMonth);

// phê duyệt tất cả mục tiêu của kpi cá nhân
router.put('/approve/:id', auth, KPIPersonalController.approveAllTarget);

// edit target of personal by id
router.put('/target/:id', auth, KPIPersonalController.editTarget);

// chỉnh sửa trạng thái từng mục tiêu của kpi cá nhân
router.put('/status-target/:id/:status', auth, KPIPersonalController.editStatusTarget);

// lấy task cho kpi
router.get('/task/:id/:employeeId/:date/:kpiType',  KPIPersonalController.getTaskById);

router.get('/detailkpi/:id', auth, KPIPersonalController.getSystemPoint);

// đánh giá điểm của kpi
router.put('/appovepoint/:id_kpi/:id_target', KPIPersonalController.setPointKPI);

// đánh giá độ quan trọng của công việc
router.put('/taskImportanceLevel/:id', KPIPersonalController.setTaskImportanceLevel);

// thêm comment 
router.get('/comment/:kpi', auth, KPIPersonalController.getAllComments);

// thêm comment 
router.post('/comment/create', auth, KPIPersonalController.createCommentOfApproveKPI);

// chinh sua comment 
router.put('/comment/:id', auth, KPIPersonalController.editCommentOfApproveKPI);

// xoa comment 
router.delete('/comment/:kpimember/:id', auth, KPIPersonalController.deleteCommentOfApproveKPI);

// thêm comment cho comment
router.post('/sub-comment/create', auth, KPIPersonalController.createCommentOfComment);

// chinh sua comment 
router.put('/sub-comment/:id', auth, KPIPersonalController.editCommentOfComment);

// xoa comment 
router.delete('/sub-comment/:kpimember/:id', auth, KPIPersonalController.deleteCommentOfComment);

module.exports = router;