const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');
const {auth} = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get("/backup", auth, SystemSettingController.getBackups);
router.post("/backup", auth, SystemSettingController.createBackup);
router.delete("/backup/:version", auth, SystemSettingController.deleteBackup);
router.patch("/restore/:version", auth, SystemSettingController.restore);

module.exports = router;
