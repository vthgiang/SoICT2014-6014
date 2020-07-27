const express = require("express");
const router = express.Router();
const LogControllers = require('./log.controller');
const { auth } = require('../../../middleware');

router.get("/log/logs/logs", auth, LogControllers.getLogState);
router.patch("/log/logs/logs", auth, LogControllers.toggleLogState);

module.exports = router;
