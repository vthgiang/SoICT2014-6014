const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const SalaryController = require("./salary.controller");

// Lấy danh sách các bảng lương
router.post('/paginate',auth, SalaryController.get);

// Thêm mới bảng lương nhân viên
router.post('/create',auth, SalaryController.create);

// Xoá bẳng lương nhan viên theo mã nhân viên
router.delete('/:id',auth, SalaryController.delete);

// Chỉnh sửa thông tin bảng lương
router.put('/:id',auth, SalaryController.update);

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương 
router.get('/checkSalary/:employeeNumber/:month',auth, SalaryController.checkSalary);

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array truyền vào
router.post('/checkArraySalary',auth, SalaryController.checkArraySalary);

// Import lương nhân viên
router.post('/import',auth, SalaryController.importSalary);

module.exports = router;