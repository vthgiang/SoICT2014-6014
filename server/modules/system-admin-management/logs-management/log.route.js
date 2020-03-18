const express = require("express");
const router = express.Router();
const SystemController = require('./log.controller');
const { auth } = require('../../../middleware');

router.get("/get-log-state", auth, SystemController.getLogState);
router.patch("/toggle-log-state", auth, SystemController.toggleLogState);

module.exports = router;
