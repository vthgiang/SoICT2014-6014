const express = require("express");
const router = express.Router();
const EmployeeKpiSetController = require("./creation.controller");
const {auth,uploadFile} = require('../../../../middleware/index');

// Lấy tập KPI cá nhân hiện tại
router.get('/current/:id',auth, EmployeeKpiSetController.getEmployeeKpiSet);

// Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước
router.get('/kpi-set-by-month/:id/:startDate/:endDate', auth, EmployeeKpiSetController.getAllEmployeeKpiSetByMonth);

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

//tạo comment
router.post('/comment',auth,uploadFile([{name:'files', path:'/files/kpisets'}], 'array'),EmployeeKpiSetController.createComment)
//sua comment
router.patch('/comment/:id',auth,EmployeeKpiSetController.editComment)
router.delete('/comment/:id/:idKPI',auth,EmployeeKpiSetController.deleteComment)

//tao comment cua comment
router.post('/comment-comment',auth,uploadFile([{name:'files', path:'/files/kpisets'}], 'array'),EmployeeKpiSetController.createCommentOfComment)
//sua comment cua comment
router.patch('/comment-comment/:id',auth,EmployeeKpiSetController.editCommentOfComment)

router.delete('/comment-comment/:id/:idKPI',auth,EmployeeKpiSetController.deleteCommentOfComment)
module.exports = router;