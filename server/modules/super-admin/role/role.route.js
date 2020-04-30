const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, RoleController.getAllRoles);
router.post("/paginate", auth, RoleController.getPaginatedRoles);
router.post("/", auth, RoleController.createRole);
router.get("/:id", auth, RoleController.getRoleById);
router.patch("/:id", auth, RoleController.editRole);
router.delete("/:id", auth, RoleController.deleteRole);
router.get('/same-department/:id', auth, RoleController.getAllRolesInSameOrganizationalUnitWithRole);
module.exports = router;