const express = require("express");
const router = express.Router();

const PraiseController = require("./praise.controller");

// Lấy danh sách kỷ luật
router.post('/paginate', PraiseController.get);

// thêm mới kỷ luật
router.post('/create', PraiseController.create);

// Xoá bẳng thông tin kỷ luật
router.delete('/:id', PraiseController.delete);

// update thông tin kyt luật
router.put('/:id', PraiseController.update);

module.exports = router;