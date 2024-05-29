const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
// const { auth, authFunc, authTrueOwner, uploadFile, rateLimitRequest } = require("../../middleware");

router.post("/login", AuthController.login);
router.post("/revoke-token", AuthController.logout);

module.exports = router;
