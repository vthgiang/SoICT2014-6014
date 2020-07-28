const express = require("express");
const router = express.Router();
const EmployeeKpiSetController = require("./creation.controller");
const {auth,uploadFile} = require('../../../../middleware/index');

// Lấy tập KPI cá nhân hiện tại
router.get('/employee-kpi-sets',auth, EmployeeKpiSetController.getEmployeeKpiSet);

// Khởi tạo KPI cá nhân
router.post('/employee-kpi-sets',auth, EmployeeKpiSetController.createEmployeeKpiSet);

// Chỉnh sửa thông tin chung của KPI cá nhân
router.post('/employee-kpi-sets/:id',auth, EmployeeKpiSetController.editEmployeeKpiSet);

// Chỉnh sửa trạng thái của KPI cá nhân
router.post('/employee-kpi-sets/:id/status',auth, EmployeeKpiSetController.updateEmployeeKpiSetStatus);

// Xóa KPI cá nhân
router.delete('/employee-kpi-sets/:id',auth, EmployeeKpiSetController.deleteEmployeeKpiSet);

// Tạo 1 mục tiêu KPI mới
router.post('/employee-kpis',auth, EmployeeKpiSetController.createEmployeeKpi);

// Chỉnh sửa mục tiêu của KPI cá nhân
// router.put('/target/:id',auth, EmployeeKpiSetController.editEmployeeKpi);
//(==========Chuyển sang employee-evaluation do trùng service=============)

// Xóa 1 mục tiêu KPI cá nhân
router.delete('/employee-kpis/:id',auth, EmployeeKpiSetController.deleteEmployeeKpi);

// // phê duyệt tất cả mục tiêu của kpi cá nhân
// router.put('/approve/:id',auth, KPIPersonalController.approveAllTarget);

//tạo comment
router.post('/employee-kpi-sets/comment',auth,uploadFile([{name:'files', path:'/files/kpisets'}], 'array'),EmployeeKpiSetController.createComment)
//sua comment
router.patch('/employee-kpi-sets/comment/:id',auth,EmployeeKpiSetController.editComment)
router.delete('/employee-kpi-sets/comment/:id',auth,EmployeeKpiSetController.deleteComment)

//tao comment cua comment
router.post('/employee-kpi-sets/comment-comment',auth,uploadFile([{name:'files', path:'/files/kpisets'}], 'array'),EmployeeKpiSetController.createCommentOfComment)
//sua comment cua comment
router.patch('/employee-kpi-sets/comment-comment/:id',auth,EmployeeKpiSetController.editCommentOfComment)

router.delete('/employee-kpi-sets/comment-comment/:id/:idKPI',auth,EmployeeKpiSetController.deleteCommentOfComment)
module.exports = router;