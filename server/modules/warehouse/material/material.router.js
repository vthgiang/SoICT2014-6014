const express = require('express');
const router = express.Router();
const MaterialManagerController = require('./material.controller');
const { auth } = require('../../../middleware/index');

router.get('/', auth, MaterialManagerController.getAllMaterials);
router.post('/', auth, MaterialManagerController.createMaterial);
router.delete('/:id', auth, MaterialManagerController.deleteMaterial);
router.patch('/:id', auth, MaterialManagerController.updateMaterial);

module.exports = router;