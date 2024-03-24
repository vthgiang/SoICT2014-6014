const express = require("express");
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const {auth} = require('../middleware/index');

router.get("/roles", auth, RoleController.getRoles);


router.post("/roles", auth, RoleController.createRole);
router.post("/roles/imports", auth, RoleController.importRoles);
router.get("/roles/:id", auth, RoleController.getRole);
router.patch("/roles/:id", auth, RoleController.editRole);
router.delete("/roles/:id", auth, RoleController.deleteRole);
router.post("/roles/attributes", auth, RoleController.createRoleAttribute);

module.exports = router;
