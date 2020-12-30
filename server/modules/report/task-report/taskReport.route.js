const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);
const TaskReportController = require('./taskReport.controller');

router.get('/', auth, TaskReportController.getTaskReports);
router.get('/:id', auth, TaskReportController.getTaskReportById);
router.post('/', auth, TaskReportController.createTaskReport);
router.delete('/:id', auth, TaskReportController.deleteTaskReport);
router.patch('/:id', auth, TaskReportController.editTaskReport)

module.exports = router;
