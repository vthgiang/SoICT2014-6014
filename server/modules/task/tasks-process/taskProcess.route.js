const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const TaskProcessController = require("./taskProcess.controller");


router.get("/diagrams", auth, TaskProcessController.getAllXmlDiagrams);
router.get("/diagrams/:diagramId", auth, TaskProcessController.getXmlDiagramById);
router.post("/diagrams", auth, TaskProcessController.createXmlDiagram);
router.patch("/diagrams/:diagramId/edit",auth,TaskProcessController.editXmlDiagram)

router.delete("/diagrams/:diagramId", auth, TaskProcessController.deleteXmlDiagram);

module.exports = router;