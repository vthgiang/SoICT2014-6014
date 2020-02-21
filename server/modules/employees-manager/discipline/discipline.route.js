const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');

const DisciplineController = require("./discipline.controller");

// Lấy danh sách kỷ luật
router.post('/paginate',auth, DisciplineController.get);

// thêm mới kỷ luật
router.post('/create',auth, DisciplineController.create);

// Xoá bẳng thông tin kỷ luật
router.delete('/:id', DisciplineController.delete);

// update thông tin kyt luật
router.put('/:id', DisciplineController.update);

module.exports = router;