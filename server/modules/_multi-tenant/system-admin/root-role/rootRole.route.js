const express = require("express");
const router = express.Router();
const RootRoleControllers = require('./rootRole.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);

router.get("/root-roles", auth, RootRoleControllers.getAllRootRoles);

module.exports = router;
