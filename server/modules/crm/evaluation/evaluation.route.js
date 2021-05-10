const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const EvaluationController = require('./evaluation.controller');

router.get('/', auth, EvaluationController.getEvaluations);
// router.get('/:id', auth, StatusController.getStatusById);
// router.post('/', auth, StatusController.createStatus);
// router.patch('/:id', auth, StatusController.editStatus);
// router.delete('/:id', auth, StatusController.deleteStatus);

module.exports = router;