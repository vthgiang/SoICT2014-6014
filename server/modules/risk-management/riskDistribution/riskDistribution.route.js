const express = require('express');
const router = express.Router();
const RiskDistributionController = require('./riskDistribution.controller');
const { auth } = require(`../../../middleware`);
const { route } = require('../../auth/auth.route');
router.get('/', auth,RiskDistributionController.getRiskDistributions);
router.get('/parents',auth,RiskDistributionController.getParentsOfRisk);
// router.post('/',auth,RiskController.createRisk)
router.get('/name', auth, RiskDistributionController.getRiskDistributionByName);
router.get('/updateProb',auth,RiskDistributionController.updateProbFromDataset);
router.delete('/:id', auth, RiskDistributionController.deleteRiskDistribution);
router.patch('/:id', auth, RiskDistributionController.editRiskRiskDistribution)
module.exports = router;