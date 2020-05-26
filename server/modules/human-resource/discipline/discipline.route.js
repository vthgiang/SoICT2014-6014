const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const DisciplineController = require("./discipline.controller");

/**
 * Lấy danh sách kỷ luật
 */ 
router.get('/',auth, DisciplineController.searchDisciplines);

/**
 * Thêm mới kỷ luật
 */
router.post('/',auth, DisciplineController.createDiscipline);

/**
 * Xoá bẳng thông tin kỷ luật
 */
router.delete('/:id',auth, DisciplineController.deleteDiscipline);

/**
 * Chỉnh sửa thông tin kỷ luật
 */
router.patch('/:id',auth, DisciplineController.updateDiscipline);

module.exports = router;