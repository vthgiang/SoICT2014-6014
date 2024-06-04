const express = require('express');
const router = express.Router();
const EmployeeController = require('./employee.controller');
const { auth } = require(`../../../middleware`);

router.get('/employees', auth, EmployeeController.getAllEmployeeTransport3);
router.put('/employees/:employeeId/confirm', auth, EmployeeController.confirmEmployeeTransport3);
router.delete('/employees/:employeeId', auth, EmployeeController.removeEmployeeTransport3);

module.exports = router;
