const express = require('express');
const router = express.Router();
const RiskController = require('./risk.controller');
const { auth } = require(`../../../middleware`);
router.get('/', auth,RiskController.getRisks);
router.post('/',auth,RiskController.createRisk)
router.get('/:id', auth, RiskController.getRiskById);
router.delete('/:id', auth, RiskController.deleteRisk);
router.patch('/:id', auth, RiskController.editRisk)
router.get('/bayes/autoConfig',auth,RiskController.bayesianNetworkAutoConfiguaration)
router.get('/task/tasksByRisk',auth,RiskController.getTasksByRisk)
router.post('/requestCloseRisk/close',auth,RiskController.requestCloseRisk)
router.post('/plans',auth,RiskController.getRiskPlan)
module.exports = router;