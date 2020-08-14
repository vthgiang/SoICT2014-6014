const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');
const {auth} = require('../../../middleware');

router.patch("/backup", auth, SystemSettingController.backup);
router.delete("/backup/:version", SystemSettingController.deleteBackup);
router.patch("/restore", auth, SystemSettingController.restore);
router.get("/restore-data", SystemSettingController.getRestoreData)

module.exports = router;
