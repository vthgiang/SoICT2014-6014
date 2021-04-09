const express = require('express');
const router = express.Router();
const TransportRequirementController = require('./transportRequirements.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
router.get('/:id', auth, TransportRequirementController.getTransportRequirementById);
router.get('/', auth, TransportRequirementController.getAllTransportRequirements);
router.post('/', auth, TransportRequirementController.createTransportRequirement);
router.patch('/:id', auth, TransportRequirementController.editTransportRequirement);
router.delete('/:id', auth, TransportRequirementController.deleteTransportRequirement);

module.exports = router;

