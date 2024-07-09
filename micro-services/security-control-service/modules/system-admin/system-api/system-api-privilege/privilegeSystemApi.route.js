const express = require("express");
const router = express.Router();
const { SystemApiPrivilegeControllers } = require('./privilegeSystemApi.controller');
const { auth } = require(`../../../../middleware`);

router.get("/privilege-apis", auth, SystemApiPrivilegeControllers.getPrivilegeApis);

router.post("/privilege-apis", auth, SystemApiPrivilegeControllers.createPrivilegeApi);

router.patch("/privilege-apis", auth, SystemApiPrivilegeControllers.editPrivilegeApi);

router.delete("/privilege-apis", auth, SystemApiPrivilegeControllers.deletePrivilegeApis);

module.exports = router;
