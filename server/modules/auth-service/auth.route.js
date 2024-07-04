const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const { verifyToken } = require('../../middleware');

router.post('/login', AuthController.login);
router.delete('/revoke-token', verifyToken, AuthController.revokeToken);
router.delete('/revoke-all-token', verifyToken, AuthController.revokeAllToken);
module.exports = router;
