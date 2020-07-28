const express = require("express");
const router = express.Router();
const LogControllers = require('./log.controller');
const { auth } = require('../../../middleware');

router.get("/logs", auth, LogControllers.getLogState);
router.patch("/logs", auth, LogControllers.toggleLogState);

module.exports = router;
