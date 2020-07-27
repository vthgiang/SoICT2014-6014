const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, RoleController.getRoles);
router.get("/:id", auth, RoleController.getRole);
router.get('/organizational-units/:id', auth, RoleController.getAllRolesInSameOrganizationalUnitWithRole);

router.post("/", auth, RoleController.createRole);

router.patch("/:id", auth, RoleController.editRole);

router.delete("/:id", auth, RoleController.deleteRole);

module.exports = router;
