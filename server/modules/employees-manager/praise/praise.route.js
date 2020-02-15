const express = require("express");
const router = express.Router();

const PraiseController = require("./praise.controller");

// Lấy danh sách kỷ luật
router.post('/paginate', PraiseController.get);

// thêm mới kỷ luật
router.post('/create', PraiseController.create);

// Xoá bẳng thông tin kỷ luật
router.delete('/:employeeNumber/:number', PraiseController.delete);

// update thông tin kyt luật
router.put('/:employeeNumber/:number', PraiseController.update);

module.exports = router;