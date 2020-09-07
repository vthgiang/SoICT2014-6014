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

// //comments
// router.post('/tasks/:taskId/comments', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), TaskProcessController.createComment)
// router.patch('/tasks/:taskId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), TaskProcessController.editComment)
// router.delete('/tasks/:taskId/comments/:commentId', auth, TaskProcessController.deleteComment)
// router.delete('/tasks/:taskId/comments/:commentId/files/:fileId', auth, TaskProcessController.deleteFileComment)
// //child comments
// router.post('/tasks/:taskId/comments/:commentId/child-comments', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), TaskProcessController.createChildComment)
// router.patch('/tasks/:taskId/comments/:commentId/child-comments/:childCommentId', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), TaskProcessController.editChildComment)
// router.delete('/tasks/:taskId/comments/:commentId/child-comments/:childCommentId', auth, TaskProcessController.deleteChildComment)
// router.delete('/tasks/:taskId/comments/:commentId/child-comments/:childCommentId/files/:fileId', auth, TaskProcessController.deleteFileChildComment)


module.exports = router;