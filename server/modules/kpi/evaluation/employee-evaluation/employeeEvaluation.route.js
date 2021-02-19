const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./employeeEvaluation.controller");
const { auth } = require(`../../../../middleware`);

router.get('/employee-kpi-sets', auth, KPIPersonalController.getEmployeeKPISets);

router.get('/employee-kpi-sets/:id', auth, KPIPersonalController.getKpisByKpiSetId);

router.patch('/employee-kpi-sets/:id', auth, KPIPersonalController.editKpi);

router.patch('/employee-kpis/:id', auth, KPIPersonalController.editStatusKpi);

router.get('/employee-kpis/:id/tasks', auth, KPIPersonalController.getTasksByKpiId);

router.post('/employee-kpis/:id/set-task-importance-level', auth, KPIPersonalController.setTaskImportanceLevel);

router.post('/employee-kpis/:id/set-point-all-kpi', auth, KPIPersonalController.setPointAllKpi);

module.exports = router;