const express = require('express');
const router = express.Router();
const TransportVehicleController = require('./transportVehicle.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, ExampleController.getExampleById);
// router.get('/', auth, TransportRequirementController.getAllTransportRequirements);
router.get('/', auth, TransportVehicleController.getAllTransportVehicles);
router.post('/', auth, TransportVehicleController.createTransportVehicle);
router.post('/:id', auth, TransportVehicleController.editTransportVehicleToSetPlan);
router.patch('/:id', auth, TransportVehicleController.editTransportVehicle);
// router.delete('/:id', auth, ExampleController.deleteExample);

module.exports = router;

