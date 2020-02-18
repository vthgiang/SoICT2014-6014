const DisciplineService = require('./discipline.service');

// Lấy danh sách kỷ luật
exports.get = async (req, res) => {
    try {
        var listDiscipline = await DisciplineService.get(req.body);
        res.status(200).json({
            message: "success",
            content: listDiscipline
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới kỷ luật của nhân viên
exports.create = async (req, res) => {
    try {
        var newDiscipline = await DisciplineService.create(req.body);
        res.status(200).json({
            message: "success",
            content: newDiscipline
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// delete thông tin kỷ luật
exports.delete = async (req, res) => {
    try {
        var disciplineDelete = await DisciplineService.delete(req.params.id);
        res.status(200).json({
            message: "success",
            content: disciplineDelete
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin kỷ luật
exports.update = async (req, res) => {
    try {
        var disciplineUpdate = await DisciplineService.update(req.params.id,req.body);
        res.status(200).json({
            message: "success",
            content: disciplineUpdate
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}