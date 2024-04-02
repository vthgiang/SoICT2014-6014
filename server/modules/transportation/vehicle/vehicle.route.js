const express = require('express');
const router = express.Router();
const VehicleController = require('./vehicle.controller');
const { auth } = require(`../../../middleware`);

router.get('/', auth, VehicleController.getVehicles);
router.get('/with-cost', auth, VehicleController.getAllVehicleWithCostList)
router.get('/available', auth, VehicleController.getAllVehicleWithCondition);
router.get('/all-free-vehicles', auth, VehicleController.getAllFreeVehicleSchedule);
router.get('/getOnlyVehicleName', auth, VehicleController.getOnlyVehicleName);
router.get('/:id', auth, VehicleController.getVehicleById);
router.post('/', auth, VehicleController.createVehicle);
router.patch('/:id', auth, VehicleController.editVehicle);
router.delete('/', auth, VehicleController.deleteVehicles);
router.post('/calculate-cost', auth, VehicleController.calculateVehiclesCost);

module.exports = router;