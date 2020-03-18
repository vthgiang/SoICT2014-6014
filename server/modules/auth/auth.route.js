const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
const { auth } = require('../../middleware');

router.post("/login", AuthController.login);
router.get("/logout", auth, AuthController.logout);
router.get("/logout-all-account", auth, AuthController.logoutAllAccount);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
module.exports = router;
