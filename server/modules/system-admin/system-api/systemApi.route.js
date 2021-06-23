const express = require("express");
const router = express.Router();
const { SystemApiControllers } = require('./systemApi.controller');
const { auth } = require(`../../../middleware`);

router.get("/system-apis", auth, SystemApiControllers.getSystemApis);

router.post("/system-apis", auth, SystemApiControllers.createSystemApi);

router.post("/privilege-apis", auth, SystemApiControllers.createPrivilegeApi);

module.exports = router;
