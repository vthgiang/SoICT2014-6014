const express = require("express");
const router = express.Router();

const EmployeeController = require("./employee.controller");

// get all list employee
router.get('/', EmployeeController.get);

// get list employee by namedepartment ang position
router.get('/:nameDepartment/:chief/:deputy', EmployeeController.getBydepartment);

// get imformation employee by employeeNumber
router.get('/:id', EmployeeController.getByEmployeeNumber);

// create a new employee
router.post('/create', EmployeeController.create);

// update information employee
router.put('/:id', EmployeeController.updateInformationEmployee);

module.exports = router;