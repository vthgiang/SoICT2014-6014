const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const SalaryController = require("./salary.controller");

/**
 * Lấy danh sách các bảng lương
 */ 
router.get('/',auth, SalaryController.searchSalaries);

/**
 *  Thêm mới bảng lương nhân viên
 */
router.post('/',auth, SalaryController.createSalary);

/**
 * Xoá bẳng lương nhan viên theo mã nhân viên
 */
router.delete('/:id',auth, SalaryController.deleteSalary);

/**
 * Chỉnh sửa thông tin bảng lương
 */
router.patch('/:id',auth, SalaryController.updateSalary);

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương 
router.get('/checkSalary/:employeeNumber/:month',auth, SalaryController.checkSalaryExisted);

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array truyền vào
router.post('/checkArraySalary',auth, SalaryController.checkSalariesExisted);

// Import lương nhân viên
router.post('/import',auth, SalaryController.importSalaries);

module.exports = router;