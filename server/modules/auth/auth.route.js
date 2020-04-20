const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
const { auth, uploadAvatar } = require('../../middleware');

router.post("/login", AuthController.login);
router.get("/logout", auth, AuthController.logout);
router.get("/logout-all-account", auth, AuthController.logoutAllAccount);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/profile/:id", auth, AuthController.getProfile);
router.patch("/profile/:id/change-information", auth, uploadAvatar.single('avatar'), AuthController.changeInformation);
router.patch("/profile/:id/change-password", auth, AuthController.changePassword);
router.get("/get-links-of-role/:id", auth, AuthController.getLinksOfRole);

module.exports = router;
