const express = require("express");
const router = express.Router();
const ApiController = require('../controllers/api');
const {auth} = require('../middleware/index');

router.get("/companies", auth, ApiController.getApis);

module.exports = router;
