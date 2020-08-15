const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const HolidayController = require("./holiday.controller");


router.get('/holidays', auth, HolidayController.getAllHolidays);

router.post('/holidays', auth, HolidayController.createHoliday);

router.put('/holidays/:id', auth, HolidayController.updateHoliday);
router.delete('/holidays/:id', auth, HolidayController.deleteHoliday);

// Import thông tin lịch làm việc
router.post('/holidays/import', auth, HolidayController.importHolidays);

module.exports = router;