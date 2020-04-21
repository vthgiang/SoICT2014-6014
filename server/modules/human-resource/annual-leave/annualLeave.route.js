const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const SabbaticalController = require("./annualLeave.controller");

// Lấy danh sách kỷ luật
router.post('/paginate',auth, SabbaticalController.searchAnnualLeaves);

// thêm mới kỷ luật
router.post('/create',auth, SabbaticalController.createAnnualLeave);

// Xoá bẳng thông tin kỷ luật
router.delete('/:id',auth, SabbaticalController.deleteAnnualLeave);

// Cập nhật thông tin nghỉ phép
router.put('/:id',auth, SabbaticalController.updateAnnualLeave);

module.exports = router;