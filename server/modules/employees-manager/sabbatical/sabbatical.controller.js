const SabbaticalService = require('./sabbatical.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách nghỉ phép
exports.get = async (req, res) => {
    try {
        var listSabbatical = await SabbaticalService.get(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_SABBATICAL', req.user.company);
        res.status(200).json({
            message: "success",
            content: listSabbatical
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_SABBATICAL', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới thông tin nghỉ phép
exports.create = async (req, res) => {
    try {
        var newSabbatical = await SabbaticalService.create(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_SABBATICAL', req.user.company);
        res.status(200).json({
            message: "success",
            content: newSabbatical
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Xoá thông tin nghỉ phép
exports.delete = async (req, res) => {
    try {
        var sabbaticalDelete = await SabbaticalService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_SABBATICAL', req.user.company);
        res.status(200).json({
            message: "success",
            content: sabbaticalDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_SABBATICAL', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Cập nhật thông tin nghỉ phép
exports.update = async (req, res) => {
    try {
        var sabbaticalUpdate = await SabbaticalService.update(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_SABBATICAL', req.user.company);
        res.status(200).json({
            message: "success",
            content: sabbaticalUpdate
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}