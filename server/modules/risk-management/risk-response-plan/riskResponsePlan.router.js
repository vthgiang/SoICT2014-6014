const express = require('express');
const router = express.Router();
const RiskResponsePlanController = require('./riskResponsePlan.controller');
const { auth } = require(`../../../middleware`);
router.get('/', auth,RiskResponsePlanController.getRiskResponsePlans);
router.post('/',auth,RiskResponsePlanController.createRiskResponsePlan)
router.get('/:id', auth, RiskResponsePlanController.getRiskResponsePlanById);
router.delete('/:id', auth, RiskResponsePlanController.deleteRiskResponsePlan);
router.patch('/:id',auth,RiskResponsePlanController.editRiskResponsePlan)
router.get('/riskId/:id',auth,RiskResponsePlanController.getRiskResponsePlanByRiskId)
module.exports = router;