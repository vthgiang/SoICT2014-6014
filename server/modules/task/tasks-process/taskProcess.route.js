const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const TaskProcessController = require("./taskProcess.controller");


router.get("/diagrams", auth, TaskProcessController.getAllXmlDiagrams);
router.get("/diagrams/:diagramId", auth, TaskProcessController.getXmlDiagramById);
router.post("/diagrams", auth, TaskProcessController.createXmlDiagram);
router.patch("/diagrams/:diagramId",auth,TaskProcessController.editXmlDiagram)

router.delete("/diagrams/:diagramId", auth, TaskProcessController.deleteXmlDiagram);
router.post("/processes/:processId/tasks/create", auth, TaskProcessController.createTaskByProcess);

module.exports = router;