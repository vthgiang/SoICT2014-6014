const express = require("express");
const router = express.Router();
const EmployeeKpiSetController = require("./creation.controller");
const { auth, uploadFile } = require('../../../../middleware/index');

// Lấy tập KPI cá nhân hiện tại
router.get('/employee-kpi-sets', auth, EmployeeKpiSetController.getEmployeeKpiSet);

// Khởi tạo KPI cá nhân
router.post('/employee-kpi-sets', auth, EmployeeKpiSetController.createEmployeeKpiSet);

// Chỉnh sửa thông tin chung của KPI cá nhân
router.post('/employee-kpi-sets/:id/edit', auth, EmployeeKpiSetController.editEmployeeKpiSet);

// Xóa KPI cá nhân
router.delete('/employee-kpi-sets/:id', auth, EmployeeKpiSetController.deleteEmployeeKpiSet);

// Tạo 1 mục tiêu KPI mới
router.post('/employee-kpis', auth, EmployeeKpiSetController.createEmployeeKpi);

// Xóa 1 mục tiêu KPI cá nhân
router.delete('/employee-kpis/:id', auth, EmployeeKpiSetController.deleteEmployeeKpi);

//tạo comment
router.post('/creation/employee-kpi-sets/:kpiId/comments', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), EmployeeKpiSetController.createComment)
router.patch('/employee-kpi-sets/:kpiId/comments/:commentId', auth, EmployeeKpiSetController.editComment)
router.delete('/employee-kpi-sets/:kpiId/comments/:commentId', auth, EmployeeKpiSetController.deleteComment)

//tao comment cua comment
router.post('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), EmployeeKpiSetController.createCommentOfComment)
router.patch('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/childCommentId', auth, EmployeeKpiSetController.editCommentOfComment)
router.delete('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/childCommentId', auth, EmployeeKpiSetController.deleteCommentOfComment)

module.exports = router;