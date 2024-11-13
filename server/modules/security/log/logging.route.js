const express = require('express');
const router = express.Router();
const LoggingController = require('./logging.controller');
const { auth } = require(`../../../middleware`);

router.get('/authorization', auth, LoggingController.getLogs);

module.exports = router;