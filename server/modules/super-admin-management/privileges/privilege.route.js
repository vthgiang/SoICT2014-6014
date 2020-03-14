const express = require("express");
const router = express.Router();
const PrivilegeController = require('./privilege.controller');
const { auth } = require('../../../middleware/auth.middleware');

router.get("/", auth, PrivilegeController.get);
router.post("/", auth, PrivilegeController.create);
router.get("/:id", auth, PrivilegeController.show);
router.patch("/:id", auth, PrivilegeController.edit);
router.delete("/:id", auth, PrivilegeController.delete);

router.get("/get-links-of-role/:idRole", auth, PrivilegeController.getLinksOfRole);

module.exports = router;
