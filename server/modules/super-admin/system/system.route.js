const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');
const SystemController = require('./system.controller');

router.get("/backup", auth, SystemController.getBackups);

router.get("/backup/download", auth, SystemController.downloadBackup);

router.get("/backup/config", auth, SystemController.getConfigBackup);

router.post("/backup", auth, SystemController.createBackup);

router.patch("/backup/:version", auth, SystemController.editBackupInfo);

router.patch("/backup/config", auth, SystemController.configBackup);

router.delete("/backup/:version", auth, SystemController.deleteBackup);

router.patch("/restore/:version", auth, SystemController.restore);

module.exports = router;
