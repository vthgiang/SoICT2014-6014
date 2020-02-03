const express = require("express");
const router = express.Router();
const SystemController = require('./system.controller');
const { auth } = require('../../middleware/auth.middleware');

router.get("/get-log-state", SystemController.getLogState);
router.patch("/toggle-log-state", SystemController.toggleLogState);

module.exports = router;
