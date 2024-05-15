const express = require('express');
const router = express.Router();
const AuthorizeServiceConsumerController = require('./authorize-service-consumer.controller');
const { auth } = require(`../../../middleware`);

router.post('/authorize-service-consumer', AuthorizeServiceConsumerController.authorizeServiceAccount);

module.exports = router;