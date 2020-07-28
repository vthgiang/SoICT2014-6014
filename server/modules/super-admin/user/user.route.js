const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');

router.get("/users", auth, UserController.getUsers);
router.get("/users/:id", auth, UserController.getUser);
router.get('/users/:id/organizational-units', auth, UserController.getOrganizationalUnitsOfUser);
router.get('/organizational-units/:id/users', auth, UserController.getAllUserInUnitAndItsSubUnits);

router.post("/users", auth, UserController.createUser);

router.patch("/users/:id", auth, UserController.editUser);

router.delete("/users/:id", auth, UserController.deleteUser);

module.exports = router;
