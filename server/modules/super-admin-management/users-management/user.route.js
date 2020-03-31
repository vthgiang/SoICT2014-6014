const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');
const { createValidation, editValidation } = require('./user.validation');

router.get("/", auth, UserController.get);
router.post("/paginate", auth, UserController.getPaginate);
router.post("/", auth, createValidation, UserController.create);
router.get("/:id", auth, UserController.show);
router.patch("/:id", auth, editValidation, UserController.edit);
router.delete("/:id", auth, UserController.delete);

router.get("/same-department/:id", UserController.getUsersSameDepartment);

router.get("/users-of-department/:id", UserController.getUsersOfDepartment);

module.exports = router;
