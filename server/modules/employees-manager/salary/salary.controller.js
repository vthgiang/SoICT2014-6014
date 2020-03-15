const SalaryService = require('./salary.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách các bảng lương
exports.get = async (req, res) => {
    try {
        var ListSaraly = await SalaryService.get(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(200).json({
            message: "success",
            content: ListSaraly
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới một bảng lương 
exports.create = async (req, res) => {
    try {
        var saraly = await SalaryService.create(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(200).json({
            message: "success",
            content: saraly
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(400).json({
            message: error
        });
    }
}

// delete a educationProgram
exports.delete = async (req, res) => {
    try {
        var saralyDelete = await SalaryService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(200).json({
            message: "success",
            content: saralyDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin bảng lương
exports.update = async (req, res) => {
    try {
        var saralyUpdate = await SalaryService.update(req.params.id,req.body);
        await LogInfo(req.user.email, 'EDIT_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(200).json({
            message: "success",
            content: saralyUpdate
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_SARALY', req.user.company._id, req.user.company.short_name);
        res.status(400).json({
            message: error
        });
    }
}