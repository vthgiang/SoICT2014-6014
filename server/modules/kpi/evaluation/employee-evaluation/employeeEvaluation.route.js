const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./employeeEvaluation.controller");
const { auth } = require('../../../../middleware');
// Tìm kiếm KPI nhân viên
router.get('/', auth, KPIPersonalController.getKPIAllMember);

// Lấy kpi nhân viên theo người khởi tạo
router.get('/employee-kpis/:userId/user', auth, KPIPersonalController.getKpiByCreator);

// Lấy kpi cá nhân theo id của kpi
router.get('/employee-kpis/:kpiId', auth, KPIPersonalController.getKpiByEmployeeKpiId);

// phê duyệt tất cả mục tiêu của kpi 
router.put('/employee-kpis/:kpiId/approve', auth, KPIPersonalController.approveAllTarget);

// Chỉnh sửa kpi 
router.put('/employee-kpis/:kpiId/target', auth, KPIPersonalController.editTarget);

// chỉnh sửa trạng thái từng mục tiêu của kpi
router.put('/employee-kpis/:kpiId/status-target', auth, KPIPersonalController.editStatusTarget);

// lấy task cho kpi
router.get('/employee-kpis/:kpiId/task', auth, KPIPersonalController.getTaskByKpiId);

// lấy điểm hệ thống
router.get('/employee-kpis/:kpiId/detailkpi', auth, KPIPersonalController.getSystemPoint);

// đánh giá độ quan trọng của công việc
router.put('/employee-kpis/:kpiId/taskImportanceLevel', auth, KPIPersonalController.setTaskImportanceLevel);

module.exports = router;