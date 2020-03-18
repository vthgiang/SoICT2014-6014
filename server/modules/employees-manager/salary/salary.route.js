const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const SalaryController = require("./salary.controller");

// Lấy danh sách các bảng lương
router.post('/paginate',auth, SalaryController.get);

// thêm mới bảng lương nhân viên
router.post('/create',auth, SalaryController.create);

// Xoá bẳng lương nhan viên theo mã nhân viên
router.delete('/:id',auth, SalaryController.delete);

// update thông tin bảng lương
router.put('/:id',auth, SalaryController.update);

module.exports = router;