const express = require('express');
const router = express.Router();
const ManufacturingQualityCriteriaController = require('./manufacturingQualityCriteria.controller');
const { auth } = require('../../../../../middleware');

router.get('/', auth, ManufacturingQualityCriteriaController.getAllManufacturingQualityCriterias);
router.get('/:id', auth, ManufacturingQualityCriteriaController.getManufacturingQualityCriteriaById);

module.exports = router;
