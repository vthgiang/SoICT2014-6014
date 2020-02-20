const express = require("express");
const router = express.Router();

const EmployeeController = require("./employee.controller");

// Cập nhật Avatar của nhân viên theo mã nhân viên
router.patch('/avatar/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateAvatar);

// Lấy danh sách nhân viên
router.post('/paginate', EmployeeController.get);

// Lấy thông tin cá nhân
router.get('/:email', EmployeeController.getInforPersonal);

// Thêm mới một nhân viên
router.post('/', EmployeeController.create);

// Cập nhật thông tin cá nhân
router.put('/:email', EmployeeController.updateInforPersonal);

// Cập nhật Avatar của nhân viên theo mã nhân viên
router.patch('/avatar/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateAvatar);

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
router.patch('/contract/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateContract);

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
router.patch('/certificateShort/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateCertificateShort);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
router.patch('/certificate/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateCertificate);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
router.patch('/file/:employeeNumber', EmployeeController.uploadFile, EmployeeController.updateFile);

module.exports = router;