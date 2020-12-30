const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const TaskProjectController = require("./taskProject.controller");

router.get('/task-project', auth, TaskProjectController.get);
router.get('/task-project/:id', auth, TaskProjectController.show);
router.post('/task-project', auth, TaskProjectController.create);
router.patch('/task-project/:id', auth, TaskProjectController.edit);
router.delete('/task-project/:id', auth, TaskProjectController.delete);

module.exports = router;
