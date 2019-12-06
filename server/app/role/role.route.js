const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');

router.get("/", RoleController.get);
router.post("/", RoleController.create);
router.get("/:id", RoleController.show);
router.patch("/:id", RoleController.edit);
router.delete("/:id", RoleController.delete);

module.exports = router;
