const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');

const PraiseController = require("./praise.controller");

// Lấy danh sách kỷ luật
router.post('/paginate',auth, PraiseController.get);

// thêm mới kỷ luật
router.post('/create',auth, PraiseController.create);

// Xoá bẳng thông tin kỷ luật
router.delete('/:id', PraiseController.delete);

// update thông tin kyt luật
router.put('/:id', PraiseController.update);

module.exports = router;