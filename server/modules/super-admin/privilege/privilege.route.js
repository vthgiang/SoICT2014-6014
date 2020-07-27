const express = require("express");
const router = express.Router();
const PrivilegeController = require('./privilege.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, PrivilegeController.getPriveleges);
router.get("/:id", auth, PrivilegeController.getPrivelege);
router.get("/roles/:idRole/links", auth, PrivilegeController.getLinksThatRoleCanAccess);

router.post("/", auth, PrivilegeController.createPrivelege);

router.patch("/:id", auth, PrivilegeController.editPrivelege);

router.delete("/:id", auth, PrivilegeController.deletePrivelege);

module.exports = router;
