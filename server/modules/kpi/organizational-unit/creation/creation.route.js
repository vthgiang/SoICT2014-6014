const express = require("express");
const router = express.Router();
const KPIUnitController = require("./creation.controller");
const {auth} = require('../../../../middleware/index');

// Lấy KPI đơn vị hiện tại qua vai trò
router.get('/current-unit/role/:id',auth, KPIUnitController.getByRole);

// edit kpi unit by id
router.put('/:id',auth, KPIUnitController.edit);

// delete kpi unit
router.delete('/:id',auth, KPIUnitController.delete);

// delete target of unit
router.delete('/target/:kpiunit/:id',auth, KPIUnitController.deleteTarget);

// edit status of unit by id
router.put('/status/:id/:status',auth, KPIUnitController.editStatusKPIUnit);

// get all parent target kpi of a unit
router.get('/parent/:id',auth, KPIUnitController.getParentByUnit);

// add a new target of unit
router.post('/create-target',auth, KPIUnitController.createTarget);

// edit target of unit by id
router.put('/target/:id',auth, KPIUnitController.editTargetById);

// Khởi tạo KPI đơn vị(add kpi-unit)
router.post('/create',auth, KPIUnitController.create);


module.exports = router;