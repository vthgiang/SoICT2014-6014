const HolidayService = require('./holiday.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/**
 * Hàm tiện ích kiểm tra trùng lặp thời gian nghỉ lễ tết
 */
exports.checkForFuplicate = (data, array) => {
    let startDate = new Date(data.startDate);
    let endDate = new Date(data.endDate);
    let checkData = true;
    for (let n in array) {
        let date1 = new Date(array[n].startDate);
        let date2 = new Date(array[n].endDate);
        if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
            (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
            checkData = false;
            break;
        }
    }
    return checkData
}

/**
 * Lấy danh sách nghỉ lễ tết
 */
exports.getAllHolidays = async (req, res) => {
    try {
        let data = await HolidayService.getAllHolidays(req.user.company._id);
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
        } else if (req.body.description.trim() === "") {
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
            let holidays = await HolidayService.getAllHolidays(req.user.company._id);
            let checkData = this.checkForFuplicate(req.body, holidays);
            if (checkData) {
                let data = await HolidayService.createHoliday(req.body, req.user.company._id);
                await LogInfo(req.user.email, 'CREATE_HOLIDAY', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["create_holiday_success"],
                    content: data
                });
            } else {
                await LogError(req.user.email, 'CREATE_HOLIDAY', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["holiday_duplicate_required"],
                    content: {
                        inputData: req.body
                    }
                });
            }
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
        let data = await HolidayService.deleteHoliday(req.params.id);
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
        } else if (req.body.description.trim() === "") {
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
            let holidays = await HolidayService.getAllHolidays(req.user.company._id);
            let checkData = this.checkForFuplicate(req.body, holidays);
            if (checkData) {
                let data = await HolidayService.updateHoliday(req.params.id, req.body);
                await LogInfo(req.user.email, 'EDIT_HOLIDAY', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["edit_holiday_success"],
                    content: data
                });
            } else {
                await LogError(req.user.email, 'EDIT_HOLIDAY', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["holiday_duplicate_required"],
                    content: {
                        inputData: req.body
                    }
                });
            }

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
};

// Import dữ liệu nghỉ lễ tết
exports.importHolidays = async (req, res) => {
    try {
        var data = await HolidayService.importHolidays(req.body, req.user.company._id);
        if (data.rowError !== undefined) {
            await LogError(req.user.email, 'IMPORT_HOLIDAY', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["import_holiday_faile"],
                content: data
            });
        } else {
            await LogInfo(req.user.email, 'IMPORT_HOLIDAY', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["import_holiday_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'IMPORT_HOLIDAY', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["import_holiday_faile"],
            content: {
                error: error
            }
        });
    }
};