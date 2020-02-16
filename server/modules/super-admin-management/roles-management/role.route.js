const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');
const { auth } = require('../../../middleware/auth.middleware');

router.get("/", auth, RoleController.get);
router.post("/paginate", auth, RoleController.getPaginate);
router.post("/", auth, RoleController.create);
router.get("/:id", auth, RoleController.show);
router.patch("/:id", auth, RoleController.edit);
router.delete("/:id", auth, RoleController.delete);

router.patch("/test/:id", auth, RoleController.test);

module.exports = router;
