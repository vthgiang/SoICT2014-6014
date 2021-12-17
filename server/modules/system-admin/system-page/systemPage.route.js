const express = require("express");

const { SystemPageControllers } = require('./systemPage.controller');
const { auth } = require(`../../../middleware`);

const router = express.Router();

router.get("/apis", auth, SystemPageControllers.getPageApis);

module.exports = router;
