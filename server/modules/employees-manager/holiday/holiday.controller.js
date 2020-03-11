const HolidayService = require('./holiday.service');

// Lấy danh sách nghỉ lễ tết
exports.get = async (req, res) => {
    try {
        var listHoliday = await HolidayService.get(req.user.company._id);
        res.status(200).json({
            message: "success",
            content: listHoliday
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới thông tin nghỉ lễ tết
exports.create = async (req, res) => {
    try {
        var newHoliday = await HolidayService.create(req.body,req.user.company._id);
        res.status(200).json({
            message: "success",
            content: newHoliday
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// delete thông tin nghỉ lễ tết
exports.delete = async (req, res) => {
    try {
        var holidayDelete = await HolidayService.delete(req.params.id);
        res.status(200).json({
            message: "success",
            content: holidayDelete
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin nghỉ lễ tết
exports.update = async (req, res) => {
    try {
        var holidayUpdate = await HolidayService.update(req.params.id,req.body);
        res.status(200).json({
            message: "success",
            content: holidayUpdate
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}