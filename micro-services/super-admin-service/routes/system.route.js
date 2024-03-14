const express = require("express");
const router = express.Router();
const {auth, uploadBackupFiles} = require('../middleware');
const SystemController = require('../controllers/system.controller');

router.get("/backup", auth, SystemController.getBackups);
router.get("/backup/download", auth, SystemController.downloadBackup);
router.get("/backup/config", auth, SystemController.getConfigBackup);
router.post("/backup", auth, SystemController.createBackup);
router.patch("/backup/config", auth, SystemController.configBackup);
router.patch("/backup/:version/edit", auth, SystemController.editBackupInfo);
router.delete("/backup/:version", auth, SystemController.deleteBackup);
router.patch("/restore/:version", auth, SystemController.restore);
router.post("/backup/upload", auth, uploadBackupFiles({db: true}), SystemController.uploadBackupFiles);

module.exports = router;
