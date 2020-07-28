const express = require("express");
const router = express.Router();
const PrivilegeController = require('./privilege.controller');
const { auth } = require('../../../middleware');

router.get("/privileges", auth, PrivilegeController.getPriveleges);
router.get("/privileges/:id", auth, PrivilegeController.getPrivelege);
router.get("/roles/:idRole/privileges", auth, PrivilegeController.getLinksThatRoleCanAccess);

router.post("/privileges", auth, PrivilegeController.createPrivelege);

router.patch("/privileges/:id", auth, PrivilegeController.editPrivelege);

router.delete("/privileges/:id", auth, PrivilegeController.deletePrivelege);

module.exports = router;
