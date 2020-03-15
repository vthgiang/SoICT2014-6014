const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');

const EmployeeController = require("./employee.controller");

// Lấy danh sách nhân viên
router.post('/paginate',auth, EmployeeController.get);

// Kiểm tra sự tồn tại của MSNV
router.get('/checkMSNV/:employeeNumber',auth, EmployeeController.checkMSNV);

// Kiểm tra sự tồn tại của email công ty
router.get('/checkEmail/:email',auth, EmployeeController.checkEmail);

// Lấy thông tin cá nhân
router.get('/:email',auth, EmployeeController.getInforPersonal);

// Thêm mới một nhân viên
router.post('/',auth, EmployeeController.create);

// Cập nhật thông tin cá nhân
router.put('/:email',auth, EmployeeController.updateInforPersonal);

// Cập nhật thông tin nhân viên theo id
router.put('/update/:id',auth, EmployeeController.updateInfoEmployee);

// Cập nhật Avatar của nhân viên theo mã nhân viên
router.patch('/avatar/:employeeNumber',auth, EmployeeController.uploadFile, EmployeeController.updateAvatar);

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
router.patch('/contract/:employeeNumber',auth, EmployeeController.uploadFile, EmployeeController.updateContract);

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
router.patch('/certificateShort/:employeeNumber',auth, EmployeeController.uploadFile, EmployeeController.updateCertificateShort);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
router.patch('/certificate/:employeeNumber',auth, EmployeeController.uploadFile, EmployeeController.updateCertificate);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
router.patch('/file/:employeeNumber',auth, EmployeeController.uploadFile, EmployeeController.updateFile);

// Xoá thông tin nhân viên
router.delete('/:id',auth, EmployeeController.delete);

module.exports = router;