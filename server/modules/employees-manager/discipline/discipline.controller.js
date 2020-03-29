const DisciplineService = require('./discipline.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách kỷ luật
exports.get = async (req, res) => {
    try {
        var listDiscipline = await DisciplineService.get(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_DISCIPLINE', req.user.company);
        res.status(200).json({
            message: "success",
            content: listDiscipline
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_DISCIPLINE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới kỷ luật của nhân viên
exports.create = async (req, res) => {
    try {
        var newDiscipline = await DisciplineService.create(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
        res.status(200).json({
            message: "success",
            content: newDiscipline
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// delete thông tin kỷ luật
exports.delete = async (req, res) => {
    try {
        var disciplineDelete = await DisciplineService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_DISCIPLINE', req.user.company);
        res.status(200).json({
            message: "success",
            content: disciplineDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_DISCIPLINE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin kỷ luật
exports.update = async (req, res) => {
    try {
        var disciplineUpdate = await DisciplineService.update(req.params.id,req.body);
        await LogInfo(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
        res.status(200).json({
            message: "success",
            content: disciplineUpdate
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}