const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const HolidayController = require("./holiday.controller");

/**
 * Lấy danh sách nghỉ lễ tết
 */
router.get('/', auth, HolidayController.getAllHolidays);

/**
 * Thêm mới thông tin nghỉ lễ tết
 */
router.post('/', auth, HolidayController.createHoliday);

/**
 * Xoá thông tin nghỉ lễ tết
 */
router.delete('/:id', auth, HolidayController.deleteHoliday);

/**
 * chỉnh thông tin nghỉ lễ tết
 */
router.put('/:id', auth, HolidayController.updateHoliday);

// Import thông tin nghỉ lễ tết
router.post('/import', auth, HolidayController.importHolidays);

module.exports = router;