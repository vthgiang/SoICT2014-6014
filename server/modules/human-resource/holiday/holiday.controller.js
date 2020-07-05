const HolidayService = require('./holiday.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/**
 * Lấy danh sách nghỉ lễ tết
 */
exports.getAllHolidays = async (req, res) => {
    try {
        var data = await HolidayService.getAllHolidays(req.user.company._id);
        await LogInfo(req.user.email, 'GET_HOLIDAY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_holiday_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_HOLIDAY', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_holiday_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Tạo mới thông tin nghỉ lễ tết
 */
exports.createHoliday = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (req.body.startDate.trim() === "") {
            await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["end_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["reason_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Tạo mới thông tin nghỉ lễ
            var data = await HolidayService.createHoliday(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["create_holiday_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["create_holiday_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Xoá thông tin nghỉ lễ tết
 */
exports.deleteHoliday = async (req, res) => {
    try {
        var data = await HolidayService.deleteHoliday(req.params.id);
        await LogInfo(req.user.email, 'DELETE_HOLIDAY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["delete_holiday_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_HOLIDAY', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["delete_holiday_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * chỉnh sửa thông tin nghỉ lễ tết
 */
exports.updateHoliday = async (req, res) => {
    try {
        // Kiểm tra thông tin truyền vào
        if (req.body.startDate.trim() === "") {
            await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["end_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["reason_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Chỉnh sửa thông tin nghỉ lễ 
            var data = await HolidayService.updateHoliday(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_HOLIDAY', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_holiday_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_HOLIDAY', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["edit_holiday_faile"],
            content: {
                error: error
            }
        });
    }
}