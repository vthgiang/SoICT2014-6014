const express = require("express");
const router = express.Router();

const SalaryController = require("./salary.controller");

// Lấy danh sách các bảng lương
router.post('/paginate', SalaryController.get);

// thêm mới bảng lương nhân viên
router.post('/create', SalaryController.create);

// Xoá bẳng lương nhan viên theo mã nhân viên
router.delete('/:employeeNumber/:month', SalaryController.delete);

// update thông tin bảng lương
router.put('/:employeeNumber/:month', SalaryController.update);

module.exports = router;