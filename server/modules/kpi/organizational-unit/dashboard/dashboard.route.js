const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require('../../../../middleware/index');


module.exports = router;