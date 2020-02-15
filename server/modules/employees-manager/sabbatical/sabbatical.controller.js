const SabbaticalService = require('./sabbatical.service');

// Lấy danh sách nghỉ phép
exports.get = async (req, res) => {
    try {
        var listSabbatical = await SabbaticalService.get(req.body);
        res.status(200).json({
            message: "success",
            content: listSabbatical
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới thông tin nghỉ phép
exports.create = async (req, res) => {
    try {
        var newSabbatical = await SabbaticalService.create(req.body);
        res.status(200).json({
            message: "success",
            content: newSabbatical
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Xoá thông tin nghỉ phép
exports.delete = async (req, res) => {
    try {
        var sabbaticalDelete = await SabbaticalService.delete(req.params.id);
        res.status(200).json({
            message: "success",
            content: sabbaticalDelete
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Cập nhật thông tin nghỉ phép
exports.update = async (req, res) => {
    try {
        var sabbaticalUpdate = await SabbaticalService.update(req.params.id, req.body);
        res.status(200).json({
            message: "success",
            content: sabbaticalUpdate
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}