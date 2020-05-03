const express = require("express");
const router = express.Router();
const KPIUnitController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/current-unit/role/:id',auth, KPIUnitController.getOrganizationalUnitKpiSet);

// edit kpi unit by id
router.put('/:id',auth, KPIUnitController.editOrganizationalUnitKpiSet);

// delete kpi unit
router.delete('/:id',auth, KPIUnitController.deleteOrganizationalUnitKpiSet);

// delete target of unit
router.delete('/target/:kpiunit/:id',auth, KPIUnitController.deleteOrganizationalUnitKpi);

// edit status of unit by id
router.put('/status/:id/:status',auth, KPIUnitController.editOrganizationalUnitKpiSetStatus);

// get all parent target kpi of a unit
router.get('/parent/:id',auth, KPIUnitController.getParentOrganizationalUnitKpiSet);

// add a new target of unit
router.post('/create-target',auth, KPIUnitController.createOrganizationalUnitKpi);

// edit target of unit by id
router.put('/target/:id',auth, KPIUnitController.editOrganizationalUnitKpi);

// Khởi tạo KPI đơn vị(add kpi-unit)
router.post('/create',auth, KPIUnitController.createOrganizationalUnitKpiSet);


module.exports = router;