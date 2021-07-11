const express = require("express");
const router = express.Router();
const ApiController = require('./api.controller');
const { auth } = require(`../../../middleware`);


router.get("/companies", auth, ApiController.getApis);

module.exports = router;
