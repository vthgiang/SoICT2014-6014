const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');

const HolidayController = require("./holiday.controller");

// Lấy danh sách nghỉ lễ tết
router.get('/',auth, HolidayController.get);

// thêm mới thông tin nghỉ lễ tết
router.post('/create',auth, HolidayController.create);

// Xoá thông tin nghỉ lễ tết
router.delete('/:id', HolidayController.delete);

// update thông tin nghỉ lễ tết
router.put('/:id', HolidayController.update);

module.exports = router;