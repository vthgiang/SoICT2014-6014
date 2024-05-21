const express = require('express');
const router = express.Router();
const ExternalServiceConsumersController = require('./external-service-consumers.controller');
const { auth } = require(`../../../middleware`);

router.post('/external-service-consumers', auth, ExternalServiceConsumersController.create);
router.get('/external-service-consumers', auth, ExternalServiceConsumersController.findAll);
router.get('/external-service-consumers/:id', auth, ExternalServiceConsumersController.findOne);
router.patch('/external-service-consumers/:id', auth, ExternalServiceConsumersController.update);
router.delete('/external-service-consumers/:id', auth, ExternalServiceConsumersController.remove);

module.exports = router;

