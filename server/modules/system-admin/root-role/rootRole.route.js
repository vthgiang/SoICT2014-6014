const express = require("express");
const router = express.Router();
const RootRoleControllers = require('./rootRole.controller');
const { auth } = require('../../../middleware');

router.get("/root-role/root-roles/root-roles", auth, RootRoleControllers.getAllRootRoles);

module.exports = router;
