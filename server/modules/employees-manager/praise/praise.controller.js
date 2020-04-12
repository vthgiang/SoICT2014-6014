const PraiseService = require('./praise.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách khen thưởng
exports.get = async (req, res) => {
    try {
        var listPraise = await PraiseService.get(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_PRAISE', req.user.company);
        res.status(200).json({ success: true, message:["get_praise_success"], content: listPraise});
    } catch (error) {
        await LogError(req.user.email, 'GET_PRAISE', req.user.company);
        res.status(400).json({ success: false, message:["get_praise_faile"], content: {error: error}});
    }
}

// Tạo mới khen thưởng của nhân viên
exports.create = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.number.trim()===""){
            await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["number_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.unit.trim()===""){
            await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["unit_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["decisions_date_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["type_praise_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["reason_praise_required"], content:{ inputData: req.body } });
        } else {
            var createPraise = await PraiseService.create(req.body, req.user.company._id);
            if(createPraise===null){
                await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
                res.status(404).json({ success: false, message: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else if(createPraise==="have_exist") {
                await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
                res.status(400).json({ success: false, message: ["number_decisions_have_exist"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'CREATE_PRAISE', req.user.company);
                res.status(200).json({
                    success: true,
                    message:["create_praise_success"],
                    content: createPraise
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_PRAISE', req.user.company);
        res.status(400).json({success: false, message:["create_praise_faile"], content: {error: error}});
    }
}

// Xoá thông tin khen thưởng
exports.delete = async (req, res) => {
    try {
        var praiseDelete = await PraiseService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_PRAISE', req.user.company);
        res.status(200).json({ success: true, message:["delete_praise_success"], content: praiseDelete});
    } catch (error) {
        await LogError(req.user.email, 'DELETE_PRAISE', req.user.company);
        res.status(400).json({ success: false, message:["delete_praise_faile"], content: {error: error}});
    }
}

// Chỉnh sửa thông tin khen thưởng
exports.update = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.number.trim()===""){
            await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["number_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.unit.trim()===""){
            await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["unit_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["start_date_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["type_praise_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
            res.status(400).json({ success: false, message: ["reason_praise_required"], content:{ inputData: req.body } });
        } else {
            var praiseUpdate = await PraiseService.update(req.params.id, req.body, req.user.company._id);
            if(praiseUpdate===null){
                await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
                res.status(404).json({ success: false, message: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'EDIT_PRAISE', req.user.company);
                res.status(200).json({
                    success: true,
                    message:["edit_praise_success"],
                    content: praiseUpdate
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_PRAISE', req.user.company);
        res.status(400).json({success: false, message:["edit_praise_faile"], content: {error: error}});
    }
}