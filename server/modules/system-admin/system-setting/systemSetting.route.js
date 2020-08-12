const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');

router.get("/", SystemSettingController.get);

router.post("/", SystemSettingController.create);
router.get("/:id", SystemSettingController.show);
router.patch("/:id", SystemSettingController.edit);
router.delete("/:id", SystemSettingController.delete);

module.exports = router;
