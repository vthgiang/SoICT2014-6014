const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');

const SabbaticalController = require("./sabbatical.controller");

// Lấy danh sách kỷ luật
router.post('/paginate',auth, SabbaticalController.get);

// thêm mới kỷ luật
router.post('/create',auth, SabbaticalController.create);

// Xoá bẳng thông tin kỷ luật
router.delete('/:id', SabbaticalController.delete);

// Cập nhật thông tin nghỉ phép
router.put('/:id', SabbaticalController.update);

module.exports = router;