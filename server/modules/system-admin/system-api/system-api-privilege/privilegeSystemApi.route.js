const express = require("express");
const router = express.Router();
const { SystemApiPrivilegeControllers } = require('./privilegeSystemApi.controller');
const { auth } = require(`../../../../middleware`);

router.post("/privilege-apis", auth, SystemApiPrivilegeControllers.createPrivilegeApi);

module.exports = router;
