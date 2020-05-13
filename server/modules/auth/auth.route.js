const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
const { auth, authFunc, uploadFile } = require('../../middleware');

router.post("/login", AuthController.login);
router.get("/logout", auth, AuthController.logout);
router.get("/logout-all-account", auth, AuthController.logoutAllAccount);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/get-profile/:id", authFunc(false), AuthController.getProfile);
router.patch("/profile/:id/change-information", auth, uploadFile('avatar', '/avatars'), AuthController.changeInformation);
router.patch("/profile/:id/change-password", auth, AuthController.changePassword);
router.get("/get-links-that-role-can-access/:id", authFunc(false), AuthController.getLinksThatRoleCanAccess);

module.exports = router;
