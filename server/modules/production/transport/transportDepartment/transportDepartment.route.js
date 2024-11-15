const express = require('express');
const router = express.Router();
const TransportDepartmentController = require('./transportDepartment.controller');
const { auth } = require(`../../../../middleware`);

// router.get('/', auth, ExampleController.getExamples);
// router.get('/getOnlyExampleName', auth, ExampleController.getOnlyExampleName);
// router.get('/:id', auth, TransportRequirementController.getTransportRequirementById);
router.get('/', auth, TransportDepartmentController.getAllTransportDepartments);
router.post('/', auth, TransportDepartmentController.createTransportDepartment);
router.get('/get-user-by-role', auth, TransportDepartmentController.getUserByRole);
// router.patch('/:id', auth, TransportRequirementController.editTransportRequirement);
router.delete('/:id', auth, TransportDepartmentController.deleteTransportDepartment);

module.exports = router;

