const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');
const { auth } = require('../../../middleware/auth.middleware');
const { createValidation, editValidation } = require('./role.validation');

router.get("/", auth, RoleController.get);
router.post("/paginate", auth, RoleController.getPaginate);
router.post("/", auth, createValidation, RoleController.create);
router.get("/:id", auth, RoleController.show);
router.patch("/:id", auth, editValidation, RoleController.edit);
router.delete("/:id", auth, RoleController.delete);

router.patch("/test/:id", auth, RoleController.test);

router.get('/same-department/:id', RoleController.getRoleSameDepartment);
module.exports = router;
