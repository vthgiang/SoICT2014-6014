const express = require("express");
const router = express.Router();

const DisciplineController = require("./discipline.controller");

// Lấy danh sách kỷ luật
router.post('/paginate', DisciplineController.get);

// thêm mới kỷ luật
router.post('/create', DisciplineController.create);

// Xoá bẳng thông tin kỷ luật
router.delete('/:employeeNumber/:number', DisciplineController.delete);

// update thông tin kyt luật
router.put('/:employeeNumber/:number', DisciplineController.update);

module.exports = router;