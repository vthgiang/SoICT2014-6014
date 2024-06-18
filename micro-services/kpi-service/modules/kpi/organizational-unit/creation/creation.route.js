const express = require("express");
const router = express.Router();
const KPIUnitController = require("./creation.controller");
const { auth, uploadFile } = require(`../../../../middleware`);

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/organizational-unit-kpi-sets', auth, KPIUnitController.getOrganizationalUnitKpiSet);

// Khởi tạo KPI đơn vị
router.post('/organizational-unit-kpi-sets',auth, KPIUnitController.createOrganizationalUnitKpiSet);

// Chỉnh sửa KPI đơn vị qua id
router.patch('/organizational-unit-kpi-sets/:id', auth, KPIUnitController.editOrganizationalUnitKpiSet);

// Xóa KPI đơn vị
router.delete('/organizational-unit-kpi-sets/:id', auth, KPIUnitController.deleteOrganizationalUnitKpiSet);

// Thêm mục tiêu cho KPI đơn vị
router.post('/organizational-unit-kpis', auth, KPIUnitController.createOrganizationalUnitKpi);

// Chỉnh sửa mục tiêu KPI đơn vị
router.patch('/organizational-unit-kpis/:id', auth, KPIUnitController.editOrganizationalUnitKpi);

// Xóa mục tiêu của KPI đơn vị
router.delete('/organizational-unit-kpi-sets/:idUnitKpiSet/organizational-unit-kpis/:idUnitKpi', auth, KPIUnitController.deleteOrganizationalUnitKpi);

//comments
router.post('/organizational-unit-kpi-sets/:kpiId/comments', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), KPIUnitController.createComment)
router.patch('/organizational-unit-kpi-sets/:kpiId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), KPIUnitController.editComment)
router.delete('/organizational-unit-kpi-sets/:kpiId/comments/:commentId', auth, KPIUnitController.deleteComment)
router.delete('/organizational-unit-kpi-sets/:kpiId/comments/:commentId/files/:fileId', auth, KPIUnitController.deleteFileComment)
//child comments
router.post('/organizational-unit-kpi-sets/:kpiId/comments/:commentId/child-comments', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), KPIUnitController.createChildComment)
router.patch('/organizational-unit-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), KPIUnitController.editChildComment)
router.delete('/organizational-unit-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId', auth, KPIUnitController.deleteChildComment)
router.delete('/organizational-unit-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId/files/:fileId', auth, KPIUnitController.deleteFileChildComment)

module.exports = router;