const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');
const {auth} = require('../../../middleware');

router.patch("/database/backup", auth, SystemSettingController.backup);
router.patch("/database/restore", auth, SystemSettingController.restore);
router.get("/database/restore-data", SystemSettingController.getRestoreData)

module.exports = router;
