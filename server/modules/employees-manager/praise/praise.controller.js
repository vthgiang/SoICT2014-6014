const PraiseService = require('./praise.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách khen thưởng
exports.get = async (req, res) => {
    try {
        var listPraise = await PraiseService.get(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_PRAISE', req.user.company);
        res.status(200).json({
            message: "success",
            content: listPraise
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_PRAISE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Tạo mới khen thưởng của nhân viên
exports.create = async (req, res) => {
    try {
        var newPraise = await PraiseService.create(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_PRAISE', req.user.company);
        res.status(200).json({
            message: "success",
            content: newPraise
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// delete thông tin khen thưởng
exports.delete = async (req, res) => {
    try {
        var praiseDelete = await PraiseService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_PRAISE', req.user.company);
        res.status(200).json({
            message: "success",
            content: praiseDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_PRAISE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// update thông tin khen thưởng
exports.update = async (req, res) => {
    try {
        var praiseUpdate = await PraiseService.update(req.params.id,req.body);
        await LogInfo(req.user.email, 'EDIT_PRAISE', req.user.company);
        res.status(200).json({
            message: "success",
            content: praiseUpdate
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}