const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware');

router.get("/users", auth, UserController.getUsers);

router.post("/users", auth, UserController.createUser);
router.get("/users/:id", auth, UserController.getUser);
router.patch('/users/send-email-reset-password', auth, UserController.sendEmailResetPasswordUser);
router.patch("/users/:id", auth, UserController.editUser);
router.delete("/users/:id", auth, UserController.deleteUser);
router.get('/users/roles/abc', auth, UserController.getAllUsersWithRole);
router.post('/users/import', auth, UserController.importUsers);

module.exports = router;
