const express = require('express')
const router = express.Router();

const ProductionLineTemplateController = require('./productionLineTemplate.controller');
const { auth } = require(`../../../middleware`)

router.get('/', auth, ProductionLineTemplateController.getAllProductionLineTemplate)
router.get('/:id', auth, ProductionLineTemplateController.getProductionLineTemplateById)
router.post('/', auth, ProductionLineTemplateController.createProductionLineTemplate)
router.patch('/:id', auth, ProductionLineTemplateController.editProductionLineTemplate)
router.delete('/:id', auth, ProductionLineTemplateController.deleteProductionLineTemplate)

module.exports = router;