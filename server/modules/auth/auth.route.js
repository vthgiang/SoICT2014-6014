const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
const { auth, authFunc, uploadAvatar } = require('../../middleware');

router.post("/login", AuthController.login);
router.get("/logout", auth, AuthController.logout);
router.get("/logout-all-account", auth, AuthController.logoutAllAccount);
router.post("/forgot-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/profile/:id", authFunc(false), AuthController.getProfile);
router.patch("/profile/:id/change-information", auth, uploadAvatar.single('avatar'), AuthController.changeInformation);
router.patch("/profile/:id/change-password", auth, AuthController.changePassword);
router.get("/get-links-of-role/:id", authFunc(false), AuthController.getLinksThatRoleCanAccess);

module.exports = router;
