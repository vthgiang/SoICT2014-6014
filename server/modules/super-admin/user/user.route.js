const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, UserController.getUsers);
router.get("/:id", auth, UserController.getUser);
router.get('/:id/organizational-units', auth, UserController.getOrganizationalUnitsOfUser);
router.get('/organizational-units/:id/users', auth, UserController.getAllUserInUnitAndItsSubUnits );

router.post("/", auth, UserController.createUser);

router.patch("/:id", auth, UserController.editUser);

router.delete("/:id", auth, UserController.deleteUser);

module.exports = router;
