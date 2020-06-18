const express = require('express');
const router = express.Router();
const { auth } = require("../../../middleware");

const ImportConfiguraionController = require('./importConfiguration.controller');

/**
 * Lấy thông tin cấu hình file import theo id
 */
router.get('/:type', auth, ImportConfiguraionController.getImportConfiguraion);

/**
 * Tạo mới thông tin cấu hình file import
 */
router.post('/', auth, ImportConfiguraionController.createImportConfiguraion);

/**
 * Chỉnh sửa thông tin cấu hình file import theo id
 */
router.patch('/:id', auth, ImportConfiguraionController.editImportConfiguraion);


module.exports = router