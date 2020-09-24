const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);
const SystemController = require('./system.controller');

router.get("/backup", auth, SystemController.getBackups);

router.post("/backup", auth, SystemController.createBackup);

router.delete("/backup/:version", auth, SystemController.deleteBackup);

router.patch("/restore/:version", auth, SystemController.restore);

module.exports = router;
