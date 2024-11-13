const express = require('express');
const router = express.Router();
const EntityController = require('./entity.controller');
const { auth } = require(`../../../middleware`);

router.get('/entities', auth, EntityController.find);
router.get('/entities-all', auth, EntityController.findAll);
router.get('/entities/:id', auth, EntityController.findOne);
// router.post('/entities', auth, EntityController.create);
// router.delete('/entities/:id', auth, EntityController.remove);

module.exports = router;

