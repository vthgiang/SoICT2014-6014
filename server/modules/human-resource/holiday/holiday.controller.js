const HolidayService = require('./holiday.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách nghỉ lễ tết
exports.getAllHolidays = async (req, res) => {
    try {
        var listHoliday = await HolidayService.getAllHolidays(req.user.company._id);
        await LogInfo(req.user.email, 'GET_HOLIDAY', req.user.company);
        res.status(200).json({
            message: "success",
            content: listHoliday
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_HOLIDAY', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới thông tin nghỉ lễ tết
exports.createHoliday = async (req, res) => {
    try {
        var newHoliday = await HolidayService.createHoliday(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_HOLIDAY', req.user.company);
        res.status(200).json({
            message: "success",
            content: newHoliday
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// delete thông tin nghỉ lễ tết
exports.deleteHoliday = async (req, res) => {
    try {
        var holidayDelete = await HolidayService.deleteHoliday(req.params.id);
        await LogInfo(req.user.email, 'DELETE_HOLIDAY', req.user.company);
        res.status(200).json({
            message: "success",
            content: holidayDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_HOLIDAY', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin nghỉ lễ tết
exports.updateHoliday = async (req, res) => {
    try {
        var holidayUpdate = await HolidayService.updateHoliday(req.params.id,req.body);
        await LogInfo(req.user.email, 'EDIT_HOLIDAY', req.user.company);
        res.status(200).json({
            message: "success",
            content: holidayUpdate
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_HOLIDAY', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}