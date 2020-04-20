const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, UserController.get);
router.post("/paginate", auth, UserController.getPaginate);
router.post("/", auth, UserController.create);
router.get("/:id", auth, UserController.show);
router.patch("/:id", auth, UserController.edit);
router.delete("/:id", auth, UserController.delete);

router.get("/same-department/:id", auth, UserController.getUsersSameDepartment);

router.get("/users-of-department/:id", auth, UserController.getUsersOfDepartment);

module.exports = router;
