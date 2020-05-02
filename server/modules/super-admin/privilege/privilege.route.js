const express = require("express");
const router = express.Router();
const PrivilegeController = require('./privilege.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, PrivilegeController.getAllPriveleges);
router.post("/", auth, PrivilegeController.createPrivelege);
router.get("/:id", auth, PrivilegeController.getPrivelege);
router.patch("/:id", auth, PrivilegeController.editPrivelege);
router.delete("/:id", auth, PrivilegeController.deletePrivelege);

router.get("/get-links-of-role/:idRole", auth, PrivilegeController.getLinksThatRoleCanAccess);

module.exports = router;
