const express = require('express');
const router = express.Router();
const TransportScheduleController = require('./transportSchedule.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, ExampleController.getExampleById);
// router.get('/', auth, TransportRequirementController.getAllTransportRequirements);
router.post('/', auth, TransportScheduleController.createTransportSchedule);
// router.patch('/:id', auth, ExampleController.editExample);
// router.delete('/:id', auth, ExampleController.deleteExample);

module.exports = router;

