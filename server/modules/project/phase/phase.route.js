const express = require("express");
const router = express.Router();
const { auth } = require('../../middleware');

const ProjectController = require("./phase.controller");

router.get('/phase', auth, ProjectController.get);
router.get('/phase/:id', auth, ProjectController.show);
router.post('/phase', auth, ProjectController.create);
router.patch('/phase/:id', auth, ProjectController.edit);
router.delete('/phase/:id', auth, ProjectController.delete);

module.exports = router;
