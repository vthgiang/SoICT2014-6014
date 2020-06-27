const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, UserController.getAllUsers);
router.post("/", auth, UserController.createUser);
router.get("/:id", auth, UserController.getUser);
router.patch("/:id", auth, UserController.editUser);
router.delete("/:id", auth, UserController.deleteUser);
router.get("/same-department/:id", auth, UserController.getAllUsersInSameOrganizationalUnitWithUserRole);
router.get("/users-of-department/:id", auth, UserController.getAllUsersInOrganizationalUnit);
router.get('/:id/organizational-units', auth, UserController.getOrganizationalUnitsOfUser);
router.get("/download-file",auth, UserController.downloadFile);
router.get('/organizational-units/all/users', auth,UserController.getAllUserInAllDepartmentsOfCompany );
router.get('/organizational-units/:id', auth, UserController.getAllUserInUnitAndItsSubUnits );

module.exports = router;
