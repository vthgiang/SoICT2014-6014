const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const ManufacturingPlanController = require('./manufacturingPlan.controller');

router.post('/', auth, ManufacturingPlanController.createManufacturingPlan);
// router.get('/', auth, ManufacturingPlanController.getAllManufacturingPlans);
// router.get('/:id', auth, ManufacturingPlanController.getManufacturingPlanById);
// router.patch('/:id', auth, ManufacturingPlanController.editManufacturingPlan);

module.exports = router;