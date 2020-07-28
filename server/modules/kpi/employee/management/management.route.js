const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./management.controller");
const {auth} = require('../../../../middleware/index');
// get all kpi personal
router.get('/employee-kpi-sets/user/:member',auth, KPIPersonalController.getAllEmployeeKpiSets);

// get all kpi personal
router.get('/employee-kpi-sets/task/:member',auth, KPIPersonalController.getAllFinishedEmployeeKpiSets);

// get all kpi employee in department by month
router.get('/employee-kpi-sets/:user/:department/:date', auth, KPIPersonalController.getAllKPIEmployeeSetsInOrganizationByMonth);

<<<<<<< HEAD
router.post('/employee-kpi-sets/copykpi/:id/:idunit/:dateold/:datenew', auth, KPIPersonalController.copyKPI);
=======
router.post('/copykpi/:id/:idunit/:dateold/:datenew', auth, KPIPersonalController.copyKPI);

// Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại 
router.get('/employee-kpis', auth, KPIPersonalController.getAllEmployeeKpiInOrganizationalUnit);

// Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
router.get('/employee-kpi-sets/all-employee-kpi-sets-by-month', auth, KPIPersonalController.getAllEmployeeKpiSetInOrganizationalUnit);

// Lấy tất cả employeeKpi thuộc các đơn vị con của đơn vị hiện tại
router.get('/employee-kpis/all-employee-kpis-children-by-month', auth, KPIPersonalController.getAllEmployeeKpiInChildrenOrganizationalUnit);

// Lấy tất cả mục tiêu nhân viên của một mục tiêu KPI đơn vị hiện tại
router.get('/employee-kpi-sets',auth, KPIPersonalController.getChildTargetByParentId);

>>>>>>> aacb82851a8d75affd47ec0d6f9ef2eb397c6740
module.exports = router;