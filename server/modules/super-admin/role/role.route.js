const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');
const { auth } = require('../../../middleware');

router.get("/roles", auth, RoleController.getRoles);
router.get("/roles/:id", auth, RoleController.getRole);

router.post("/roles", auth, RoleController.createRole);

router.patch("/roles/:id", auth, RoleController.editRole);

router.delete("/roles/:id", auth, RoleController.deleteRole);

module.exports = router;
