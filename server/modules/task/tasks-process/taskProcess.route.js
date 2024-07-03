const express = require('express');
const router = express.Router();
const { auth } = require(`../../../middleware`);

const TaskProcessController = require('./taskProcess.controller');

router.get('/diagrams/current-user-progress-task', auth, TaskProcessController.getListUserProgressTask);

router.get('/', auth, TaskProcessController.get);
router.get('/diagrams/:diagramId', auth, TaskProcessController.getXmlDiagramById);
router.get('/process/:processId', auth, TaskProcessController.getProcessById);

router.post('/diagrams', auth, TaskProcessController.createXmlDiagram);
router.post('/diagrams/import', auth, TaskProcessController.importProcessTemplate);

router.patch('/diagrams/:diagramId', auth, TaskProcessController.editXmlDiagram);
router.patch('/processes/:processId/diagram', auth, TaskProcessController.updateDiagram);
router.patch('/processes/:processId', auth, TaskProcessController.editProcessInfo);

router.delete('/diagrams/:diagramId', auth, TaskProcessController.deleteXmlDiagram);
router.delete('/:taskProcessId', auth, TaskProcessController.deleteTaskProcess);

router.post('/processes/:processId/tasks/create', auth, TaskProcessController.createTaskByProcess);

module.exports = router;

