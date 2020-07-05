const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const TimsheetsController = require("./timesheets.controller");

/**
 * Lấy danh sách thông tin chấm công
 */
router.get('/', auth, TimsheetsController.searchTimesheets);

/**
 *  Thêm mới thông tin chấm công
 */
router.post('/', auth, TimsheetsController.createTimesheets);

/**
 * Xoá thông tin chấm công
 */
router.delete('/:id', auth, TimsheetsController.deleteTimesheets);

/**
 * Chỉnh sửa thông tin chấm công
 */
router.patch('/:id', auth, TimsheetsController.updateTimesheets);

// Import chấm công
router.post('/import', auth, TimsheetsController.importTimesheets);

module.exports = router;