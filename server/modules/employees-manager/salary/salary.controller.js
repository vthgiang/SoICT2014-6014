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
        var saralyUpdate = await SalaryService.update(req.params.id,req.body,req.user.company._id);
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

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
exports.checkSalary = async (req, res) => {
    try {
        var checkSalary = await SalaryService.checkSalary(req.params.employeeNumber,req.params.month, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkSalary
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array truyền vào
exports.checkArraySalary = async (req, res) => {
    try {
        var checkArraySalary = await SalaryService.checkArraySalary(req.body, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkArraySalary
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}

// Import dữ liệu bảng lương
exports.importSalary = async (req, res) => {
    try {
        var importSalary = await SalaryService.importSalary(req.body, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: importSalary
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}