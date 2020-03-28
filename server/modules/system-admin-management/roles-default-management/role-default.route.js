const express = require("express");
const router = express.Router();
const RoleDefaultController = require('./role-default.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, RoleDefaultController.get);

module.exports = router;
