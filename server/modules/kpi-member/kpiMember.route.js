const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./kpiMember.controller");

// Tìm kiếm KPI nhân viên
router.get('/all-member/:role/:user/:status/:starttime/:endtime', KPIPersonalController.getKPIAllMember);

// get all kpi personal
router.get('/user/:member', KPIPersonalController.getByMember);

// Lấy kpi cá nhân theo id
router.get('/:id', KPIPersonalController.getById);

// Lấy kpi cá nhân theo tháng
router.get('/member/:id/:time', KPIPersonalController.getByMonth);

// phê duyệt tất cả mục tiêu của kpi cá nhân
router.put('/approve/:id', KPIPersonalController.approveAllTarget);

// edit target of personal by id
router.put('/target/:id', KPIPersonalController.editTarget);

// chỉnh sửa trạng thái từng mục tiêu của kpi cá nhân
router.put('/status-target/:id/:status', KPIPersonalController.editStatusTarget);


module.exports = router;