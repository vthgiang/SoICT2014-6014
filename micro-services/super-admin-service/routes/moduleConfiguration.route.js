const express = require("express");
const router = express.Router();
const ModuleConfigurationController = require('../controllers/moduleConfiguration.controller');
const {auth} = require('../middleware/index');

router.get("/configurations", auth, ModuleConfigurationController.getConfiguration);

router.patch("/configurations", auth, ModuleConfigurationController.editConfiguration);


module.exports = router;