const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const ManufacturingCommandController = require('./manufacturingCommand.controller');

router.post('/', auth, ManufacturingCommandController.createManufacturingCommand);
// router.get('/', auth, ManufacturingPlanController.getAllManufacturingPlans);
// router.get('/:id', auth, ManufacturingPlanController.getManufacturingPlanById);
// router.patch('/:id', auth, ManufacturingPlanController.editManufacturingPlan);

module.exports = router;