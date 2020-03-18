const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const PraiseController = require("./praise.controller");

// Lấy danh sách khen thưởng
router.post('/paginate',auth, PraiseController.get);

// thêm mới khen thưởng
router.post('/create',auth, PraiseController.create);

// Xoá bẳng thông tin khen thưởng
router.delete('/:id',auth, PraiseController.delete);

// update thông tin khen thưởng
router.put('/:id',auth, PraiseController.update);

module.exports = router;