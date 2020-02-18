const SalaryService = require('./salary.service');

// Lấy danh sách các bảng lương
exports.get = async (req, res) => {
    try {
        var ListSaraly = await SalaryService.get(req.body);
        res.status(200).json({
            message: "success",
            content: ListSaraly
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới một bảng lương 
exports.create = async (req, res) => {
    try {
        var saraly = await SalaryService.create(req.body);
        res.status(200).json({
            message: "success",
            content: saraly
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// delete a educationProgram
exports.delete = async (req, res) => {
    try {
        var saralyDelete = await SalaryService.delete(req.params.id);
        res.status(200).json({
            message: "success",
            content: saralyDelete
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin bảng lương
exports.update = async (req, res) => {
    try {
        var saralyUpdate = await SalaryService.update(req.params.id,req.body);
        res.status(200).json({
            message: "success",
            content: saralyUpdate
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}