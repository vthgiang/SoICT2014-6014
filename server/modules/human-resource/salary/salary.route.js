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

// Import lương nhân viên
router.post('/import',auth, SalaryController.importSalaries);

module.exports = router;