const EmployeeService = require('./employee.service');

// get all list employee
exports.get = (req, res) => {
    return EmployeeService.get(req, res);
}

// get imformation employee by employeeNumber
exports.getByEmployeeNumber = (req, res) => {
    return EmployeeService.getByEmployeeNumber(req, res);
}

// get list employee by nameDepartment and position
exports.getBydepartment = (req, res) => {
    return EmployeeService.getBydepartment(req, res);
}

// create a new employee
exports.create = (req, res) => {
    return EmployeeService.create(req, res);
}

// update information employee
exports.updateInformationEmployee = (req, res) => {
    return EmployeeService.updateByEmployeeNumber(req, res);
}