const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const PraiseController = require("./commendation.controller");

// Lấy danh sách khen thưởng
router.post('/paginate',auth, PraiseController.searchCommendations);

// Thêm mới khen thưởng
router.post('/create',auth, PraiseController.createCommendation);

// Xoá bẳng thông tin khen thưởng
router.delete('/:id',auth, PraiseController.deleteCommendation);

// Chỉnh sửa thông tin khen thưởng
router.put('/:id',auth, PraiseController.updateCommendation);

module.exports = router;