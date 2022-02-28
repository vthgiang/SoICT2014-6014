const express = require("express");
const router = express.Router();
const GetDataController = require("./get-data.controller");
const { auth } = require(`../../../middleware`);

router.get("/", auth, GetDataController.getChartData);


module.exports = router;
