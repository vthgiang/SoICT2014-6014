const HolidayService = require('./holiday.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');


/**
 * Hàm tiện ích kiểm tra trùng lặp thời gian lịch làm việc
 * @param {*} data : Thông tin lịch làm việc
 * @param {*} array : Danh sách lịch làm việc
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

/** Lấy danh sách lịch làm việc */
exports.getAllHolidays = async (req, res) => {
    try {
        let data;
        if (req.query.year) {
            data = await HolidayService.getHolidaysOfYear(req.user.company._id, req.query.year);
        } else {
            data = await HolidayService.getAllHolidays(req.user.company._id);
        }
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

/** Tạo mới thông tin lịch làm việc */
exports.createHoliday = async (req, res) => {
    try {
        let numberDateLeaveOfYear = false;
        if (req.body.numberDateLeaveOfYear) {
            numberDateLeaveOfYear = true
        };
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
            // Tạo mới thông tin lịch làm việc
            let result = await HolidayService.getAllHolidays(req.user.company._id);
            let checkData = this.checkForFuplicate(req.body, result.holidays);
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

/** Xoá thông tin lịch làm việc */
exports.deleteHoliday = async (req, res) => {
    try {
        let data = await HolidayService.deleteHoliday(req.params.id, req.user.company._id);
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

/** Chỉnh sửa thông tin lịch làm việc */
exports.updateHoliday = async (req, res) => {
    try {
        if (req.body.numberDateLeaveOfYear) {
            let data = await HolidayService.updateNumberDateLeaveOfYear(req.body.numberDateLeaveOfYear, req.user.company._id);
            await LogInfo(req.user.email, 'EDIT_HOLIDAY', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_number_date_leave_of_year_success"],
                content: data
            });
        } else {
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
                // Chỉnh sửa thông tin lịch làm việc
                let result = await HolidayService.getAllHolidays(req.user.company._id);
                result.holidays = result.holidays.filter(x => x._id.toString() !== req.params.id);
                let checkData = this.checkForFuplicate(req.body, result.holidays);
                if (checkData) {
                    let data = await HolidayService.updateHoliday(req.params.id, req.body, req.user.company._id);
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

/** Import dữ liệu lịch làm việc */
exports.importHolidays = async (req, res) => {
    try {
        let data = await HolidayService.importHolidays(req.body, req.user.company._id);
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