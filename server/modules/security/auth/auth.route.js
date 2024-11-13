const express = require('express');
const router = express.Router();
const AuthorizationController = require('./auth.controller');
const { auth } = require(`../../../middleware`);

router.post('/check', auth, AuthorizationController.checkAuthorization);

module.exports = router;
