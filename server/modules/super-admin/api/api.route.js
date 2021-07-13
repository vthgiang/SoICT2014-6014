const express = require("express");
const router = express.Router();
const ApiController = require('./api.controller');
const { auth } = require(`../../../middleware`);


router.get("/companies", auth, ApiController.getApis);

router.get("/privilege-apis", auth, ApiController.getApiRegistration);

router.post("/privilege-apis/register", auth, ApiController.registerToUseApi);

module.exports = router;
