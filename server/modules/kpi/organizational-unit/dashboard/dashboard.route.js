const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');


module.exports = router;