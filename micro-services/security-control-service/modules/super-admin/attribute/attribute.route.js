const express = require('express');
const router = express.Router();
const AttributeController = require('./attribute.controller');
const { auth } = require(`../../../middleware`);

router.get('/attributes', auth, AttributeController.getAttributes);
router.get('/attributes/:id', auth, AttributeController.getAttributeById);
router.post('/attributes', auth, AttributeController.createAttribute);
router.patch('/attributes/:id', auth, AttributeController.editAttribute);
router.delete('/attributes', auth, AttributeController.deleteAttributes);

module.exports = router;

