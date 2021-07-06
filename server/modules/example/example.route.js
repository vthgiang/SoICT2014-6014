const express = require('express');
const router = express.Router();
const ExampleController = require('./example.controller');
const { auth } = require(`../../middleware`);

router.get('/', auth, ExampleController.getExamples);
router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
router.get('/:id', auth, ExampleController.getExampleById);
router.post('/', auth, ExampleController.createExample);
router.patch('/:id', auth, ExampleController.editExample);
router.delete('/', auth, ExampleController.deleteExamples);

module.exports = router;

