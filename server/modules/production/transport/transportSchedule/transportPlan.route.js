const express = require('express');
const router = express.Router();
const TransportPlanController = require('./transportPlan.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, ExampleController.getExampleById);
router.get('/:id', auth, TransportPlanController.getPlanById);
// router.get('/', auth, TransportRequirementController.getAllTransportRequirements);
router.get('/', auth, TransportPlanController.getAllTransportPlans);
router.post('/', auth, TransportPlanController.createTransportPlan);
router.patch('/:id', auth, TransportPlanController.editTransportPlan);
// router.delete('/:id', auth, ExampleController.deleteExample);

module.exports = router;

