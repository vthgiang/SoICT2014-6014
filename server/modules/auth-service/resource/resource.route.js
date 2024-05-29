const express = require('express');
const router = express.Router();
const ResourceController = require('./resource.controller');
const { auth } = require(`../../../middleware`);

router.get('/resources', auth, ResourceController.find);
router.get('/resources/:id', auth, ResourceController.findOne);
// router.post('/resources', auth, ResourceController.create);
router.patch('/resources/:id', auth, ResourceController.updateAttributes);
// router.delete('/resources/:id', auth, RequesterController.remove);

module.exports = router;

