const AnnualLeaveService = require('./annualLeave.service');
const UserService = require('../../super-admin/user/user.service');
const NotificationServices = require('../../notification/notification.service');
const EmployeeService = require('../profile/profile.service');
const {
    sendEmail
} = require('../../../helpers/emailHelper');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/** Lấy danh sách nghỉ phép */
exports.searchAnnualLeaves = async (req, res) => {
    try {
        let data = {};
        if (req.query.numberAnnulLeave) {
            data = await AnnualLeaveService.getNumberAnnaulLeave(req.user.email, req.user.company._id);
        } else if (req.query.numberMonth) {
            data = await AnnualLeaveService.getAnnualLeaveOfNumberMonth(req.query.organizationalUnits, req.query.numberMonth, req.user.company._id)
        } else if (req.query.page === undefined && req.query.limit === undefined) {
            data = await AnnualLeaveService.getTotalAnnualLeave(req.user.company._id, req.query.organizationalUnits, req.query.month)
        } else {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                position: req.query.position,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                status: req.query.status,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await AnnualLeaveService.searchAnnualLeaves(params, req.user.company._id);
        }

        await LogInfo(req.user.email, 'GET_ANNUALLEAVE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_annual_leave_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_ANNUALLEAVE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_annual_leave_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới thông tin nghỉ phép */
exports.createAnnualLeave = async (req, res) => {
    try {
        if (req.body.receiver) {
            let employee = await EmployeeService.getEmployeeInforByEmailInCompany(req.user.email, req.user.company._id);
            let html = `
                <h3><strong>Thông báo từ hệ thống VNIST-Việc.</strong></h3>
                <p>Nhân viên ${employee.fullName} - ${employee.employeeNumber} xin nghỉ phép từ ngày ${req.body.startDate} đến ngày ${req.body.endDate}.<p>
                <p>Lý do: ${req.body.reason}<p>
                <p>Để phê duyệt đơn xin nghỉ. Hãy click vào đây <a target="_blank" href="http://${process.env.WEBSITE}/hr-manage-leave-application">Phê duyệt</a><p>
                <br/>
                <br/>
                <h3><strong>Notification from system VNIST-Việc.</strong></h3>
                <p>Staff ${employee.fullName} - ${employee.employeeNumber} apply for leave from ${req.body.startDate} to ${req.body.endDate}.<p>
                <p>Reason: ${req.body.reason}<p>
                <p>To approve leave application. Please click here <a target="_blank" href="http://${process.env.WEBSITE}/hr-manage-leave-application">Approved</a><p>
            `
            sendEmail(req.body.receiver, 'Đơn xin nghỉ phép', "", html);

            let user = await UserService.getUserInformByEmail(req.body.receiver, req.user.company._id);
            let content = `
                <p>Nhân viên ${employee.fullName} - ${employee.employeeNumber} xin nghỉ phép từ ngày ${req.body.startDate} đến ngày ${req.body.endDate}.<p>
                <p>Lý do: ${req.body.reason}<p>
                <p>Để phê duyệt đơn xin nghỉ. Hãy click vào đây <a target="_blank" href="http://${process.env.WEBSITE}/hr-manage-leave-application">Phê duyệt</a><p>
                <br/>
                <p>Staff ${employee.fullName} - ${employee.employeeNumber} apply for leave from ${req.body.startDate} to ${req.body.endDate}.<p>
                <p>Reason: ${req.body.reason}<p>
                <p>To approve leave application. Please click here <a target="_blank" href="http://${process.env.WEBSITE}/hr-manage-leave-application">Approved</a><p>
            `
            let notification = {
                users: [user.id],
                organizationalUnits: [],
                title: 'Xin nghỉ phép',
                level: "important",
                content: content,
                sender: "VNIST-Việc",
            }
            await NotificationServices.createNotification(req.user.company._id, notification, undefined)

            let data = {
                employeeNumber: employee.employeeNumber,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                reason: req.body.reason,
                status: 'process',
            }
            let annualLeave = await AnnualLeaveService.createAnnualLeave(data, req.user.company._id);

            await LogInfo(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["aplication_annual_leave_success"],
                content: annualLeave
            });
        } else {
            // Kiểm tra dữ liệu truyền vào
            if (req.body.employeeNumber.trim() === "") {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["employee_number_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.startDate.trim() === "") {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["start_date_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.endDate.trim() === "") {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["end_date_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.reason.trim() === "") {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["reason_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.status.trim() === "") {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["status_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                let newAnnualLeave = await AnnualLeaveService.createAnnualLeave(req.body, req.user.company._id);
                // Kiểm tra sự tồn tại của mã nhân viên
                if (newAnnualLeave === null) {
                    await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                    res.status(404).json({
                        success: false,
                        messages: ["staff_code_not_find"],
                        content: {
                            inputData: req.body
                        }
                    });
                } else {
                    await LogInfo(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                    res.status(200).json({
                        success: true,
                        messages: ["create_annual_leave_success"],
                        content: newAnnualLeave
                    });
                }
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
        res.status(400).json({
            success: false,
            messages: "create_annual_leave_faile",
            content: {
                inputData: req.body
            }
        });
    }
}

/** Xoá thông tin nghỉ phép */
exports.deleteAnnualLeave = async (req, res) => {
    try {
        let annualleaveDelete = await AnnualLeaveService.deleteAnnualLeave(req.params.id);
        await LogInfo(req.user.email, 'DELETE_ANNUALLEAVE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["delete_annual_leave_success"],
            content: annualleaveDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_ANNUALLEAVE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["delete_annual_leave_success"],
            content: {
                error: error
            }
        });
    }
}

/** Cập nhật thông tin nghỉ phép */
exports.updateAnnualLeave = async (req, res) => {
    try {
        // Kiểm tra dữ liệu tryền vào
        if (req.body.employeeNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["start_date_annual_leave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["end_date_annual_leave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["reason_annualleave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.status.trim() === "") {
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["status_annual_leave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let annualleaveUpdate = await AnnualLeaveService.updateAnnualLeave(req.params.id, req.body);
            // Kiểm tra sự tồn tại của mã nhân viên
            if (annualleaveUpdate === null) {
                await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
                res.status(404).json({
                    success: false,
                    messages: ["staff_code_not_find"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await LogInfo(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["edit_annual_leave_success"],
                    content: annualleaveUpdate
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_annual_leave_faile'],
            content: {
                error: error
            }
        });
    }
}