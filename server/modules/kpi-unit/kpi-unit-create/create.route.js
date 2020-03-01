const express = require("express");
const router = express.Router();
const KPIUnitController = require("./create.controller");

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/current-unit/role/:id', KPIUnitController.getByRole);

// edit kpi unit by id
router.put('/:id', KPIUnitController.edit);

// delete kpi unit
router.delete('/:id', KPIUnitController.delete);

// delete target of unit
router.delete('/target/:kpiunit/:id', KPIUnitController.deleteTarget);

// edit status of unit by id
router.put('/status/:id/:status', KPIUnitController.editStatusKPIUnit);

// get all parent target kpi of a unit
router.get('/parent/:id', KPIUnitController.getParentByUnit);

// add a new target of unit
router.post('/create-target', KPIUnitController.createTarget);

// edit target of unit by id
router.put('/target/:id', KPIUnitController.editTargetById);

// Khởi tạo KPI đơn vị(add kpi-unit)
router.post('/create', KPIUnitController.create);


module.exports = router;