const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, UserController.getAllUsers);
router.post("/paginate", auth, UserController.getPaginatedUsers);
router.post("/", auth, UserController.createUser);
router.get("/:id", auth, UserController.getUserById);
router.patch("/:id", auth, UserController.editUser);
router.delete("/:id", auth, UserController.deleteUser);

router.get("/same-department/:id", auth, UserController.getAllUsersInSameOrganizationalUnitWithUserRole);

router.get("/users-of-department/:id", auth, UserController.getAllUsersInOrganizationalUnit);

module.exports = router;
