const express = require("express");
const router = express.Router();
const ModuleConfigurationController = require('./moduleConfiguration.controller');

const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);

router.get("/configurations", auth, ModuleConfigurationController.getHumanResourceConfiguration);


module.exports = router;