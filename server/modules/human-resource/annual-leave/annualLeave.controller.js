const AnnualLeaveService = require('./annualLeave.service');
const UserService = require(`../../super-admin/user/user.service`);
const NotificationServices = require(`../../notification/notification.service`);
const EmployeeService = require('../profile/profile.service');
const dayjs = require('dayjs');
const {
    sendEmail
} = require(`../../../helpers/emailHelper`);

const Log = require(`../../../logs`);

/** Lấy danh sách nghỉ phép */
exports.searchAnnualLeaves = async (req, res) => {
    try {
        let data = {};
        if (req.query.startDate && req.query.endDate && req.query.email){
            data = await AnnualLeaveService.getAnnualLeaveByStartDateAndEndDateUserOfOrganizationalUnits(req.portal,req.query.email, req.query.organizationalUnits, req.query.startDate, req.query.endDate, req.user.company._id)
        } else if(req.query.beforAndAfterOneWeek){
            data = await AnnualLeaveService.getAnnaulLeaveBeforAndAfterOneWeek(req.portal, req.query.organizationalUnits, req.user.company._id)
        }else if (req.query.numberAnnulLeave) {
            data = await AnnualLeaveService.getNumberAnnaulLeave(req.portal, req.user.email, req.query.year, req.user.company._id);
        } else if (req.query.startDate && req.query.endDate) {
            data = await AnnualLeaveService.getAnnualLeaveByStartDateAndEndDate(req.portal, req.query.organizationalUnits, req.query.startDate, req.query.endDate, req.user.company._id)
        } else if (req.query.page === undefined && req.query.limit === undefined) {
            data = await AnnualLeaveService.getTotalAnnualLeave(req.portal, req.user.company._id, req.query.organizationalUnits, req.query.month)
        } else {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                employeeNumber: req.query.employeeNumber,
                employeeName: req.query.employeeName,
                month: req.query.month,
                status: req.query.status,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await AnnualLeaveService.searchAnnualLeaves(req.portal, params, req.user.company._id);
        }

        await Log.info(req.user.email, 'GET_ANNUALLEAVE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_annual_leave_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_ANNUALLEAVE', req.portal);
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
        if (req.body.createApplication) {
            let users = await UserService.getUserIsManagerOfOrganizationalUnit(req.portal, req.body.organizationalUnit);
            let employee = await EmployeeService.getEmployeeInforByEmailInCompany(req.portal, req.user.email, req.user.company._id);
            if (!employee) throw ['employee_invalid']; // Thông báo lỗi không tìm thấy dữ liệu về nhân viên tương ứng
            
            let data = {
                employee: employee._id,
                organizationalUnit: req.body.organizationalUnit,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                reason: req.body.reason,
                type: req.body.type,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                totalHours: req.body.totalHours,
                status: 'waiting_for_approval',
            }
            let annualLeave = await AnnualLeaveService.createAnnualLeave(req.portal, data, req.user.company._id);
            const dataAnnualLeave = annualLeave.result;

            let html = `
                <h3><strong>Thông báo từ hệ thống ${process.env.WEB_NAME}.</strong></h3>
                <p>Nhân viên: ${employee.fullName} - ${employee.employeeNumber}. </p>
                <p>Thời gian nghỉ phép: ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} - ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                <p>Lý do: ${req.body.reason}<p>
                <p>Để phê duyệt đơn xin nghỉ. Hãy click vào đây <a target="_blank" href="${process.env.WEBSITE}/hr-manage-leave-application">Phê duyệt</a><p>
                <br/>
                <br/>
                <h3><strong>Notification from system ${process.env.WEB_NAME}.</strong></h3>
                <p>Staff ${employee.fullName} - ${employee.employeeNumber}<p/>
                <p>Time annual leave: ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} - ${req.body.startTime? req.body.endTime + ":" : ''} ${req.body.endDate}.</p>
                <p>Reason: ${req.body.reason}<p>
                <p>To approve leave application. Please click here <a target="_blank" href="${process.env.WEBSITE}/hr-manage-leave-application">Approved</a><p>
            `
            users.forEach(x => {
                sendEmail(x.email, 'Đơn xin nghỉ phép', "", html);
            })

            let content = `
                <p>Nhân viên: ${employee.fullName} - ${employee.employeeNumber}. </p>
                <p>Thời gian nghỉ phép: ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} - ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                <p>Lý do: ${req.body.reason}<p>
                <p>Để phê duyệt đơn xin nghỉ. Hãy click vào đây <a target="_blank" href="${process.env.WEBSITE}/hr-manage-leave-application">Phê duyệt</a><p>
                <br/>
                <p>Staff ${employee.fullName} - ${employee.employeeNumber}<p/>
                <p>Time annual leave: ${req.body.startTime? req.body.startTime+":": ''} ${req.body.startDate} - ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                <p>Reason: ${req.body.reason}<p>
                <p>To approve leave application. Please click here <a target="_blank" href="${process.env.WEBSITE}/hr-manage-leave-application">Approved</a><p>
            `
            users = users.map(x => x._id);
            users = [...users, ...annualLeave.userReceiveds];

            let notification = {
                users: users,
                organizationalUnits: [],
                title: 'Xin nghỉ phép',
                level: "important",
                content: content,
                sender: employee.fullName,
            }
            await NotificationServices.createNotification(req.portal, req.user.company._id, notification, undefined)

            await Log.info(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["aplication_annual_leave_success"],
                content: dataAnnualLeave
            });
        } else {
            if (req.body.startDate.trim() === "") {
                await Log.error(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["start_date_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.endDate.trim() === "") {
                await Log.error(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["end_date_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.reason.trim() === "") {
                await Log.error(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["reason_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.status.trim() === "") {
                await Log.error(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["status_annual_leave_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                let newAnnualLeave = await AnnualLeaveService.createAnnualLeave(req.portal, req.body, req.user.company._id);
                const dataAnnualLeave = newAnnualLeave.result;
                await Log.info(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_annual_leave_success"],
                    content: dataAnnualLeave
                });
            }
        }
    } catch (error) {
        console.log('error', error)
        await Log.error(req.user.email, 'CREATE_ANNUALLEAVE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_annual_leave_faile'],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin nghỉ phép */
exports.deleteAnnualLeave = async (req, res) => {
    try {
        let annualleaveDelete = await AnnualLeaveService.deleteAnnualLeave(req.portal, req.params.id);
        if (annualleaveDelete) {
            let status_vi, status_en;

            if (annualleaveDelete.status === 'approved') {
                status_vi = 'Được chấp nhận';
                status_en = 'Accepted';
            } else {
                if (annualleaveDelete.status === 'disapproved') {
                    status_vi = 'Không chấp nhận';
                    status_en = 'Not Accepted';
                } else {
                    status_vi = 'Chờ phê duyệt';
                    status_en = 'Waiting for approval';
                }
            }
            
            console.log('annualleaveDelete', annualleaveDelete);
            let html = `
                <h3><strong>Thông báo từ hệ thống ${process.env.WEBSITE}.</strong></h3>
                <p>Đơn xin nghỉ phép của bạn từ ${annualleaveDelete.startTime? annualleaveDelete.startTime + ":": ''} ${dayjs(annualleaveDelete.startDate).format("DD-MM-YYYY")} đến ${annualleaveDelete.startTime? annualleaveDelete.endTime + ":": ''} ${dayjs(annualleaveDelete.endDate).format("DD-MM-YYYY")} đã bị xóa bởi <strong>${req.user.name} - ${req.user.email}</strong></p>
                
                <h3><strong>Notification from system ${process.env.WEBSITE}.</strong></h3>
                <p>Your application for leave from ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} to ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate} deleted by <strong>${req.user.name} - ${req.user.email}</strong> </p>
            `
            sendEmail(annualleaveDelete.employee.emailInCompany, 'Xóa đơn xin nghỉ phép', "", html);
            let user = await UserService.getUserInformByEmail(req.portal, annualleaveDelete.employee.emailInCompany, req.user.company._id);
            let content = `
                <p>Đơn xin nghỉ phép của bạn từ ${annualleaveDelete.startTime? annualleaveDelete.startTime + ":" : ''} ${dayjs(annualleaveDelete.startDate).format("DD-MM-YYYY")} đến ${annualleaveDelete.startTime? annualleaveDelete.endTime + ":": ''} ${dayjs(annualleaveDelete.endDate).format("DD-MM-YYYY")} đã bị xóa bởi <strong>${req.user.name} - ${req.user.email}</strong></p>
                <br/>
                <br/>
                <p>Your application for leave from ${annualleaveDelete.startTime? annualleaveDelete.startTime + ":": ''} ${dayjs(annualleaveDelete.startDate).format("DD-MM-YYYY")} to ${annualleaveDelete.startTime? annualleaveDelete.endTime + ":": ''} ${dayjs(annualleaveDelete.endDate).format("DD-MM-YYYY")} deleted by <strong>${req.user.name} - ${req.user.email}</strong></p>
            `
            let notification = {
                users: user ? [user._id] : [],
                organizationalUnits: [],
                title: 'Xóa đơn xin nghỉ phép',
                level: "important",
                content: content,
                sender: req.user.name,
            }

            console.log('notification', notification);
            await NotificationServices.createNotification(req.portal, req.user.company._id, notification, undefined);
        }


        await Log.info(req.user.email, 'DELETE_ANNUALLEAVE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_annual_leave_success"],
            content: annualleaveDelete
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_ANNUALLEAVE', req.portal);
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
        if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'EDIT_ANNUALLEAVE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_annual_leave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await Log.error(req.user.email, 'EDIT_ANNUALLEAVE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["end_date_annual_leave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await Log.error(req.user.email, 'EDIT_ANNUALLEAVE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["reason_annualleave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.status.trim() === "") {
            await Log.error(req.user.email, 'EDIT_ANNUALLEAVE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["status_annual_leave_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            if (req.body.approvedApplication) {
                let status_vi, status_en;

                if (req.body.status === 'approved') {
                    status_vi = 'Được chấp nhận';
                    status_en = 'Accepted';
                } else {
                    if (req.body.status === 'disapproved') {
                        status_vi = 'Không chấp nhận';
                        status_en = 'Not Accepted';
                    } else {
                        status_vi = 'Chờ phê duyệt';
                        status_en = 'Waiting for approval';
                    }
                }
                
                let html = `
                    <h3><strong>Thông báo từ hệ thống ${process.env.WEBSITE}.</strong></h3>
                    <p>Đơn xin nghỉ phép của bạn từ ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} đến ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                    <p>Trạng thái: ${status_vi}<p>
                    <p>Người phê duyệt: ${req.user.name} (${req.user.email})</>
                    <br/>
                    <br/>
                    <h3><strong>Notification from system ${process.env.WEBSITE}.</strong></h3>
                    <p>Your application for leave from ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} to ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                    <p>Trạng thái: ${status_en}<p>
                    <p>Approver:  ${req.user.name} (${req.user.email})</>
                `
                sendEmail(req.body.employee.emailInCompany, 'Phê duyệt đơn xin nghỉ phép', "", html);
                let user = await UserService.getUserInformByEmail(req.portal, req.body.employee.emailInCompany, req.user.company._id);
                let content = `
                    <p>Đơn xin nghỉ phép của bạn từ ${req.body.startTime? req.body.startTime + ":" : ''} ${req.body.startDate} đến ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                    <p>Trạng thái: ${status_vi}<p>
                    <p>Người phê duyệt: ${req.user.name} (${req.user.email})</>
                    <br/>
                    <br/>
                    <p>Your application for leave from ${req.body.startTime? req.body.startTime + ":": ''} ${req.body.startDate} to ${req.body.startTime? req.body.endTime + ":": ''} ${req.body.endDate}.</p>
                    <p>Trạng thái: ${status_en}<p>
                    <p>Approver:  ${req.user.name} (${req.user.email})</>
                `
                let notification = {
                    users: user ? [user._id] : [],
                    organizationalUnits: [],
                    title: 'Phê duyệt đơn xin nghỉ phép',
                    level: "important",
                    content: content,
                    sender: req.user.name,
                }
                await NotificationServices.createNotification(req.portal, req.user.company._id, notification, undefined);
            };

            let annualleaveUpdate = await AnnualLeaveService.updateAnnualLeave(req.portal, req.params.id, req.body);
            await Log.info(req.user.email, 'EDIT_ANNUALLEAVE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_annual_leave_success"],
                content: annualleaveUpdate
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_ANNUALLEAVE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_annual_leave_faile'],
            content: {
                error: error
            }
        });
    }
}

/** Import dữ liệu nghỉ phép */
exports.importAnnualLeave = async (req, res) => {
    try {
        let data = await AnnualLeaveService.importAnnualLeave(req.portal, req.body, req.user.company._id);
        if (data.rowError !== undefined) {
            await Log.error(req.user.email, 'IMPORT_ANNUAL_LEAVE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["import_annual_leave_faile"],
                content: data
            });
        } else {
            await Log.info(req.user.email, 'IMPORT_ANNUAL_LEAVE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["import_annual_leave_success"],
                content: data
            });
        }
    } catch (error) {
        console.log('error', error)
        await Log.error(req.user.email, 'IMPORT_ANNUAL_LEAVE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_annual_leave_faile"],
            content: {
                error: error
            }
        });
    }
}