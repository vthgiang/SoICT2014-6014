const express = require("express");
const router = express.Router();
const KPIUnitController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/roles/:id',auth, KPIUnitController.getOrganizationalUnitKpiSet);

// edit kpi unit by id
router.patch('/:id',auth, KPIUnitController.editOrganizationalUnitKpiSet);

// delete kpi unit
router.delete('/:id',auth, KPIUnitController.deleteOrganizationalUnitKpiSet);

// delete target of unit
router.delete('/:kpiunit/organizational-unit-kpis/:id',auth, KPIUnitController.deleteOrganizationalUnitKpi);

// edit status of unit by id
router.patch('/:id/:status',auth, KPIUnitController.editOrganizationalUnitKpiSetStatus);

// get all parent target kpi of a unit
router.get('/:id/parent-organizational-unit-kpi-sets',auth, KPIUnitController.getParentOrganizationalUnitKpiSet);

// add a new target of unit
router.post('/organizational-unit-kpis',auth, KPIUnitController.createOrganizationalUnitKpi);

// edit target of unit by id
router.put('/organizational-unit-kpis/:id',auth, KPIUnitController.editOrganizationalUnitKpi);

// Khởi tạo KPI đơn vị(add kpi-unit)
router.post('/',auth, KPIUnitController.createOrganizationalUnitKpiSet);


module.exports = router;