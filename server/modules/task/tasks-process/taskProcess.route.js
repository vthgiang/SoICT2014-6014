const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware');

const TaskProcess = require("./taskProcess.controller");

router.post("/",auth,TaskProcess.exportXmlDiagram);



module.exports = router;