const express = require('express');
const router = express.Router();
const CostFormulaController = require('./costFormula.controller');
const { auth } = require(`../../../middleware`);

router.get('/', auth, CostFormulaController.getVehicleCostFormula);
router.post('/', auth, CostFormulaController.createOrUpdateVehicleCostFormula);

module.exports = router;