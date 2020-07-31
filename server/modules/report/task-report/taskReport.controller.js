const TaskReportService = require('./taskReport.service');
const { LogInfo, LogError } = require('../../../logs');


/**
 * Hàm lấy danh sách báo cáo công việc
 * @param {*} req request
 * @param {*} res response 
 */
exports.getTaskReports = async (req, res) => {
    try {
        let taskReports = await TaskReportService.getTaskReports(req.query);
        LogInfo(req.user.email, ' get_task_report ', req.user.company);

        res.status(200).json({
            success: true,
            messages: ['get_report_success'],
            content: taskReports,
        });
    } catch (error) {
        LogError(req.user.email, ' get_task_report ', req.user.company);
        res.status(404).json({
            success: false,
            messages: ['get_report_fail'],
            content: error,
        });
    }
}


/**
 * Hàm lấy danh sách báo cáo công việc theo Id
 * @param {*} req 
 * @param {*} res 
 */
exports.getTaskReportById = async (req, res) => {
    try {
        let report = await TaskReportService.getTaskReportById(req.params.id);
        LogInfo(req.user.email, ' get_task_report_by_id ', req.user.company);

        res.status(200).json({
            success: true,
            messages: ['get_report_success'],
            content: report,
        });
    } catch (error) {
        LogError(req.user.email, ' get_task_report_by_id ', req.user.company);
        res.status(404).json({
            success: false,
            messages: ['get_report_fail'],
            content: error,
        });
    }
}


/**
 * Hàm tạo mới một báo cáo công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.createTaskReport = async (req, res) => {
    try {
        let data = await TaskReportService.createTaskReport(req.body, req.user._id);
        LogInfo(req.user.email, ' create_task_report ', req.user.company);

        res.status(200).json({
            success: true,
            messages: ['create_report_manager_success'],
            content: data,
        });
    } catch (error) {
        LogError(req.user.email, ' create_task_report ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['create_report_manager_faile'],
            content: error,
        });
    }
}



/**
 * Hàm xóa 1 báo cáo công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteTaskReport = async (req, res) => {
    try {
        let deleteTaskReport = await TaskReportService.deleteTaskReport(req.params.id);
        LogInfo(req.user.email, ' delete_task_report ', req.user.company);

        res.status(200).json({
            success: true,
            messages: ['delete_report_manager_success'],
            content: deleteTaskReport,
        });
    } catch (error) {
        LogError(req.user.email, ' delete_task_report ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_report_manager_faile'],
            content: error,
        });
    }
}


/**
 * Hàm chỉnh sửa một báo cáo công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.editTaskReport = async (req, res) => {
    try {
        let editTaskReport = await TaskReportService.editTaskReport(req.params.id, req.body, req.user._id);
        LogInfo(req.user.email, ' edit_task_report ', req.user.company);

        res.status(200).json({
            success: true,
            messages: ['edit_report_manager_success'],
            content: editTaskReport,
        });
    } catch (error) {
        LogError(req.user.email, ' edit_task_report ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_report_manager_faile'],
            content: error,
        });
    }
}