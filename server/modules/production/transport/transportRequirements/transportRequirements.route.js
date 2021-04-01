const express = require('express');
const router = express.Router();
const TransportRequirementController = require('./transportRequirements.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, ExampleController.getExampleById);
router.post('/', auth, TransportRequirementController.createTransportRequirement);
// router.patch('/:id', auth, ExampleController.editExample);
// router.delete('/:id', auth, ExampleController.deleteExample);

module.exports = router;

