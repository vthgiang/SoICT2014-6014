const TimesheetService = require('./timesheets.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/**
 * Lấy danh sách thông tin chấm công
 */
exports.searchTimesheets = async (req, res) => {
    try {
        let data = {};
        if (req.query.page !== undefined && req.query.limit !== undefined) {
            let params = {
                organizationalUnit: req.query.organizationalUnit,
                position: req.query.position,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await TimesheetService.searchTimesheets(params, req.user.company._id);
        }
        await LogInfo(req.user.email, 'GET_TIMESHEETS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_timesheets_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_TIMESHEETS', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}
/**
 * Tạo mới thông tin chấm công
 */
exports.createTimesheets = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (req.body.employeeNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_TIMESHEETS', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.month.trim() === "") {
            await LogError(req.user.email, 'CREATE_TIMESHEETS', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["month_timesheets_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let createTimesheets = await TimesheetService.createTimesheets(req.body, req.user.company._id);
            // Kiểm tra sự tồn tại của mã nhân viên
            if (createTimesheets === null) {
                await LogError(req.user.email, 'CREATE_TIMESHEETS', req.user.company);
                res.status(404).json({
                    success: false,
                    messages: ["staff_code_not_find"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (createTimesheets === "have_exist") { // Kiểm tra trùng lặp
                await LogError(req.user.email, 'CREATE_TIMESHEETS', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["month_timesheets_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await LogInfo(req.user.email, 'CREATE_TIMESHEETS', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["create_timesheets_success"],
                    content: createTimesheets
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_TIMESHEETS', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["create_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Xoá thông tin chấm công
 */
exports.deleteTimesheets = async (req, res) => {
    try {
        let timesheetsDelete = await TimesheetService.deleteTimesheets(req.params.id);
        await LogInfo(req.user.email, 'DELETE_TIMESHEETS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["delete_timesheets_success"],
            content: timesheetsDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_TIMESHEETS', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["delete_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}
/**
 * Chỉnh sửa thông tin chấm công
 */
exports.updateTimesheets = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.employeeNumber.trim() === "") {
            await LogError(req.user.email, 'EDIT_TIMESHEETS', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.month.trim() === "") {
            await LogError(req.user.email, 'EDIT_TIMESHEETS', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["month_timesheets_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            var timesheetsUpdate = await TimesheetService.updateTimesheets(req.params.id, req.body, req.user.company._id);
            // Kiểm tra sự tồn tại của mã nhân viên
            if (timesheetsUpdate === null) {
                await LogError(req.user.email, 'EDIT_TIMESHEETS', req.user.company);
                res.status(404).json({
                    success: false,
                    messages: ["staff_code_not_find"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await LogInfo(req.user.email, 'EDIT_TIMESHEETS', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["edit_timesheets_success"],
                    content: timesheetsUpdate
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_TIMESHEETS', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["edit_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}

// Import dữ liệu chấm công
exports.importTimesheets = async (req, res) => {
    try {
        var data = await TimesheetService.importTimesheets(req.body, req.user.company._id);
        if(data.rowError!==undefined){
            await LogError(req.user.email, 'IMPORT_TIMESHEETS', req.user.company);
            res.status(400).json({
                success: false,
                messages:["import_timesheets_faile"],
                content: data
            });
        }else{
            await LogInfo(req.user.email, 'IMPORT_TIMESHEETS', req.user.company);
            res.status(200).json({
                success: true,
                messages:["import_timesheets_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'IMPORT_TIMESHEETS', req.user.company);
        res.status(400).json({
            success: false,
            messages:["import_timesheets_faile"],
            content: {error: error}
        });
    }
}