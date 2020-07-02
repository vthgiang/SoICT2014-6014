const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const CommendationController = require("./commendation.controller");

/**
 * Lấy danh sách khen thưởng
 */
router.get('/', auth, CommendationController.searchCommendations);

/**
 * Thêm mới khen thưởng
 */
router.post('/', auth, CommendationController.createCommendation);

/**
 * Xoá bẳng thông tin khen thưởng
 */
router.delete('/:id', auth, CommendationController.deleteCommendation);

/**
 * Chỉnh sửa thông tin khen thưởng
 */
router.patch('/:id', auth, CommendationController.updateCommendation);

module.exports = router;