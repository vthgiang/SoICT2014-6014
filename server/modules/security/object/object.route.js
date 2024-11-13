const express = require('express');
const router = express.Router();
const ObjectController = require('./object.controller');
const { auth } = require(`../../../middleware`);

router.get('/objects', auth, ObjectController.find);
router.get('/objects-all', auth, ObjectController.findAll);
router.get('/objects/:id', auth, ObjectController.findOne);
// router.post('/objects', auth, ObjectController.create);
// router.delete('/objects/:id', auth, ObjectController.remove);

module.exports = router;

