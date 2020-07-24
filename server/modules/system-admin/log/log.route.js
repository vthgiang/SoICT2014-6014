const express = require("express");
const router = express.Router();
const LogControllers = require('./log.controller');
const { auth } = require('../../../middleware');

router.get("/get-log-state", auth, LogControllers.getLogState);
router.patch("/toggle-log-state", auth, LogControllers.toggleLogState);

module.exports = router;
