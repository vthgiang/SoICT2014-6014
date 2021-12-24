const express = require("express");
const router = express.Router();
const { SystemApiControllers } = require('./systemApi.controller');
const { auth } = require(`../../../../middleware`);

router.get("/system-apis", auth, SystemApiControllers.getSystemApis);

router.get("/system-apis/update-log", auth, SystemApiControllers.getSystemApisUpdateLog);

router.delete("/system-apis/update-log", auth, SystemApiControllers.deleteSystemApisUpdateLog);

router.post("/system-apis", auth, SystemApiControllers.createSystemApi);

router.patch("/system-apis/:id", auth, SystemApiControllers.editSystemApi);

router.delete("/system-apis/:id", auth, SystemApiControllers.deleteSystemApi);

module.exports = router;
