const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require('../../../middleware');

const TaskProcessController = require("./taskProcess.controller");


router.get("/", auth, TaskProcessController.get);
router.get("/diagrams/:diagramId", auth, TaskProcessController.getXmlDiagramById);
router.post("/diagrams", auth, TaskProcessController.createXmlDiagram);
router.patch("/diagrams/:diagramId", auth, TaskProcessController.editXmlDiagram)
router.patch('/processes/:processId/diagram', auth, TaskProcessController.updateDiagram);
router.delete("/diagrams/:diagramId", auth, TaskProcessController.deleteXmlDiagram);
router.post("/processes/:processId/tasks/create", auth, TaskProcessController.createTaskByProcess);




module.exports = router;