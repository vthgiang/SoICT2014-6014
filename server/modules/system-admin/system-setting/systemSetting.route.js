const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');
const {auth} = require('../../../middleware');

router.patch("/backup-database/backup", auth, SystemSettingController.backup);

module.exports = router;
