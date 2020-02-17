const express = require("express");
const router = express.Router();
const SystemController = require('./system.controller');
const { auth } = require('../../middleware/auth.middleware');

router.get("/get-log-state", auth, SystemController.getLogState);
router.patch("/toggle-log-state", auth, SystemController.toggleLogState);

module.exports = router;
