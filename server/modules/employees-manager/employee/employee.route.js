const express = require("express");
const router = express.Router();

const EmployeeController = require("./employee.controller");


// 
router.post('/avatar', EmployeeController.uploadFile, EmployeeController.getInforFile);
// get all list employee
router.post('/paginate', EmployeeController.get);

// get imformation employee by employeeNumber
router.get('/:id', EmployeeController.getById);

// create a new employee
router.post('/', EmployeeController.create);

// update information employee
router.put('/:id', EmployeeController.updateInformationEmployee);

module.exports = router;