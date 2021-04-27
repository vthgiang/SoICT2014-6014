const express = require('express');
const router = express.Router();
const TransportProcessController = require('./transportProcess.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, TransportRequirementController.getTransportRequirementById);
router.get('/start-locate', auth, TransportProcessController.startLocate);
// router.post('/', auth, TransportRequirementController.createTransportRequirement);
// router.patch('/:id', auth, TransportRequirementController.editTransportRequirement);
// router.delete('/:id', auth, TransportRequirementController.deleteTransportRequirement);

module.exports = router;

