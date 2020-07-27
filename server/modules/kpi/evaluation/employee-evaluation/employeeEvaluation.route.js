const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./employeeEvaluation.controller");
const { auth } = require('../../../../middleware');

router.get('/employee-kpi-sets', auth, KPIPersonalController.getEmployeeKPISets);

router.get('/employee-kpi-sets/:id', auth, KPIPersonalController.getKpisByKpiSetId);

router.patch('/employee-kpi-sets/:id/approve', auth, KPIPersonalController.approveAllKpis);

router.patch('/employee-kpi-sets/:id', auth, KPIPersonalController.editKpi);

router.patch('/employee-kpis/:id', auth, KPIPersonalController.editStatusKpi);

router.get('/employee-kpis/:id/task', auth, KPIPersonalController.getTasksByKpiId); 

router.patch('/employee-kpis/:id/task-importance-level', auth, KPIPersonalController.setTaskImportanceLevel); 

module.exports = router;