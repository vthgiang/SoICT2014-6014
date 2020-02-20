const express = require("express");
const router = express.Router();

const EmployeeController = require("./employee.controller");

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
router.patch('/contract/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateContract);

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
router.patch('/certificateShort/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateCertificateShort);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
router.patch('/certificate/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateCertificate);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
router.patch('/file/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateFile);

// update avartar of employee
router.patch('/avatar/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateAvatar);
// get all list employee
router.post('/paginate', EmployeeController.get);

// get imformation employee by employeeNumber
router.get('/:id', EmployeeController.getById);

// create a new employee
router.post('/', EmployeeController.create);

// update information employee
router.put('/:id', EmployeeController.updateInformationEmployee);

module.exports = router;