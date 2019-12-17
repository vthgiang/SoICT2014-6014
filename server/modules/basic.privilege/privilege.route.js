const express = require("express");
const router = express.Router();
const PrivilegeController = require('./privilege.controller');

router.get("/", PrivilegeController.get);
router.post("/", PrivilegeController.create);
router.get("/:id", PrivilegeController.show);
router.patch("/:id", PrivilegeController.edit);
router.delete("/:id", PrivilegeController.delete);

router.get("/get-links-of-role/:idRole", PrivilegeController.getLinksOfRole);

module.exports = router;
