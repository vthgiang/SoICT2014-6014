const express = require('express');
const router = express.Router();

const { auth } = require(`../../../middleware`);
const AssetTemplateController = require('./assetTemplate.controller')

router.get('/', auth, AssetTemplateController.getAllAssetTemplate)
router.get('/:id', auth, AssetTemplateController.getAssetTemplateById)
router.post('/', auth, AssetTemplateController.createAssetTemplate)

module.exports = router;