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
// router.patch('/:id', auth, ExampleController.editExample);
// router.delete('/:id', auth, ExampleController.deleteExample);

module.exports = router;

