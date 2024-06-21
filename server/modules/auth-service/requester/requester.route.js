const express = require('express');
const router = express.Router();
const RequesterController = require('./requester.controller');
const { auth } = require(`../../../middleware`);

router.get('/requesters', auth, RequesterController.find);
router.get('/requesters-all', auth, RequesterController.findAll);
router.get('/requesters/:id', auth, RequesterController.findOne);
// router.post('/requesters', auth, RequesterController.create);
router.patch('/requesters/:id', auth, RequesterController.updateAttributes);
// router.delete('/requesters/:id', auth, RequesterController.remove);

router.get('/accessible-resources/:id', auth, RequesterController.getAccessibleResources);
module.exports = router;

