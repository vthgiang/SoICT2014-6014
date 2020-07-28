const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./employeeEvaluation.controller");
const { auth } = require('../../../../middleware');

router.get('/employee-kpi-sets', auth, KPIPersonalController.getEmployeeKPISets);

router.get('/employee-kpi-sets/:id', auth, KPIPersonalController.getKpisByKpiSetId);

router.post('/employee-kpi-sets/:id/edit', auth, KPIPersonalController.editKpi);

router.post('/employee-kpis/:id', auth, KPIPersonalController.editStatusKpi);

router.get('/employee-kpis/:id/tasks', auth, KPIPersonalController.getTasksByKpiId);

router.post('/employee-kpis/:id/set-task-importance-level', auth, KPIPersonalController.setTaskImportanceLevel);

module.exports = router;