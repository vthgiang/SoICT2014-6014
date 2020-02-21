const PraiseService = require('./praise.service');

// Lấy danh sách kỷ luật
exports.get = async (req, res) => {
    try {
        var listPraise = await PraiseService.get(req.body,req.user.company._id);
        res.status(200).json({
            message: "success",
            content: listPraise
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
        var newPraise = await PraiseService.create(req.body,req.user.company._id);
        res.status(200).json({
            message: "success",
            content: newPraise
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
        var praiseDelete = await PraiseService.delete(req.params.id);
        res.status(200).json({
            message: "success",
            content: praiseDelete
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
        var praiseUpdate = await PraiseService.update(req.params.id,req.body);
        res.status(200).json({
            message: "success",
            content: praiseUpdate
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}