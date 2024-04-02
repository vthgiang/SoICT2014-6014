const express = require('express');
const router = express.Router();
const DeliveryPlanController = require('./deliveryPlan.controller');
const { auth } = require(`../../../middleware`);

router.get('/', auth, DeliveryPlanController.getDeliveryPlans);
router.get('/all-journeys', auth, DeliveryPlanController.getAllJourneys);
router.get('/getOnlyDeliveryPlanName', auth, DeliveryPlanController.getOnlyDeliveryPlanName);
router.get('/:id', auth, DeliveryPlanController.getDeliveryPlanById);
router.post('/', auth, DeliveryPlanController.createDeliveryPlan);
router.patch('/:id', auth, DeliveryPlanController.editDeliveryPlan);
router.delete('/', auth, DeliveryPlanController.deleteDeliveryPlans);

module.exports = router;