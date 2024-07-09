const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');
const {auth} = require(`../../../middleware`);
const {uploadBackupFiles} = require("../../../middleware");

router.get("/backup", auth, SystemSettingController.getBackups);
router.get("/backup/config", auth, SystemSettingController.getConfigBackup);
router.get("/backup/download", auth, SystemSettingController.downloadBackup);
router.post("/backup", auth, SystemSettingController.createBackup);
router.patch("/backup/config", auth, SystemSettingController.configBackup);
router.patch("/backup/:version/edit", auth, SystemSettingController.editBackupInfo);
router.delete("/backup/:version", auth, SystemSettingController.deleteBackup);
router.patch("/restore/:version", auth, SystemSettingController.restore);
router.post("/backup/upload", auth, uploadBackupFiles({}), SystemSettingController.uploadBackupFiles);

module.exports = router;
