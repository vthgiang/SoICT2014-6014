const express = require('express');
const router = express.Router();
const transportScheduleController = require('./transportSchedule.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, ExampleController.getExampleById);

router.get('/get-by-plan-id/:id', auth, transportScheduleController.getTransportRouteByPlanId);
router.patch('/edit-by-plan-id/:planId', auth, transportScheduleController.editTransportScheduleByPlanId);
router.post('/driver-send-message', auth, transportScheduleController.driverSendMessage);

router.get('/get-schedule-route-by-carrier-id/:carrierId', auth, transportScheduleController.getAllTransportScheduleRouteByCarrierId);
router.patch('/change-transport-status-by-carrier-id/:carrierId', auth, transportScheduleController.changeTransportStatusByCarrierId);
// router.get('/', auth, TransportRequirementController.getAllTransportRequirements);
// router.get('/', auth, TransportVehicleController.getAllTransportVehicles);
// router.post('/', auth, TransportVehicleController.createTransportVehicle);
// router.post('/:id', auth, TransportVehicleController.editTransportVehicleToSetPlan);
router.patch('/change-transport-requirement-process', auth, transportScheduleController.changeTransportRequirementProcess);
// router.delete('/:id', auth, ExampleController.deleteExample);

module.exports = router;

