const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');

router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

module.exports = router;
