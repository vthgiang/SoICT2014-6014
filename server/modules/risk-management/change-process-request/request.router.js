const express = require('express');
const router = express.Router();
const RiskResponsePlanRequestController = require('./request.controller');
const { auth } = require(`../../../middleware`);
router.get('/', auth,RiskResponsePlanRequestController.getRiskResponsePlanRequests);
router.post('/',auth,RiskResponsePlanRequestController.createRiskResponsePlanRequest)
router.delete('/:id', auth, RiskResponsePlanRequestController.deleteRiskResponsePlanRequest);
router.patch('/:id',auth,RiskResponsePlanRequestController.editRiskResponsePlanRequest)

module.exports = router;