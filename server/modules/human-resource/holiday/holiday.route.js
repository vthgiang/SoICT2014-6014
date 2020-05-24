const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const HolidayController = require("./holiday.controller");

/**
 * Lấy danh sách nghỉ lễ tết
 */
router.get('/',auth, HolidayController.getAllHolidays);

/**
 * Thêm mới thông tin nghỉ lễ tết
 */
router.post('/create',auth, HolidayController.createHoliday);

/**
 * Xoá thông tin nghỉ lễ tết
 */
router.delete('/:id',auth, HolidayController.deleteHoliday);

/**
 * chỉnh thông tin nghỉ lễ tết
 */
router.put('/:id',auth, HolidayController.updateHoliday);

module.exports = router;