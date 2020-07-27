const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const TaskProcessController = require("./taskProcess.controller");


router.get("/diagrams", auth, TaskProcessController.getAllXmlDiagram);
router.get("/diagrams/:diagramId", auth, TaskProcessController.getXmlDiagramById);
router.post("/diagrams", auth, TaskProcessController.createXmlDiagram);



module.exports = router;