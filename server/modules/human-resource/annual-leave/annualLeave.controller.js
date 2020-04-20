const SabbaticalService = require('./annualLeave.service');
const {LogInfo, LogError} = require('../../../logs');

// Lấy danh sách nghỉ phép
exports.get = async (req, res) => {
    try {
        var listSabbatical = await SabbaticalService.get(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_SABBATICAL', req.user.company);
        res.status(200).json({ success: true, message: ["get_sabbatical_success"], content: listSabbatical });
    } catch (error) {
        await LogError(req.user.email, 'GET_SABBATICAL', req.user.company);
        res.status(400).json({ success: false, message: ["get_sabbatical_faile"], content: {error:error}});
    }
}

// Tạo mới thông tin nghỉ phép
exports.create = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["start_date_sabbatical_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["end_date_sabbatical_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["reason_sabbatical_required"], content:{ inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["status_sabbatical_required"], content:{ inputData: req.body } });
        } else {
            var newSabbatical = await SabbaticalService.create(req.body, req.user.company._id);
            if (newSabbatical === null) {
                await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
                res.status(404).json({ success: false, message: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else { 
                await LogInfo(req.user.email, 'CREATE_SABBATICAL', req.user.company);
                res.status(200).json({
                    success: true,
                    message: ["create_sabbatical_success"],
                    content: newSabbatical 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
        res.status(400).json({ success: false, message: "create_sabbatical_faile", content: { inputData: req.body } });
    }
}

// Xoá thông tin nghỉ phép
exports.delete = async (req, res) => {
    try {
        var sabbaticalDelete = await SabbaticalService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_SABBATICAL', req.user.company);
        res.status(200).json({ 
            success: true, 
            message: ["delete_sabbatical_success"], 
            content: sabbaticalDelete 
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_SABBATICAL', req.user.company);
        res.status(400).json({ success: false, message: ["delete_sabbatical_success"], content:{ error: error } });
    }
}

// Cập nhật thông tin nghỉ phép
exports.update = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["start_date_sabbatical_required"], content: { inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["end_date_sabbatical_required"], content: { inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["reason_sabbatical_required"], content: { inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
            res.status(400).json({ success: false, message: ["status_sabbatical_required"], content: { inputData: req.body } });
        } else {
            var sabbaticalUpdate = await SabbaticalService.update(req.params.id, req.body);
            if(sabbaticalUpdate===null){
                await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
                res.status(404).json({ success: false, message: ["staff_code_not_find"], content: { inputData: req.body } });
            }else{
                await LogInfo(req.user.email, 'EDIT_SABBATICAL', req.user.company);
                res.status(200).json({ 
                    success: true, 
                    message: ["edit_sabbatical_success"], 
                    content: sabbaticalUpdate 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_SABBATICAL', req.user.company);
        res.status(400).json({ success: false, message: ['edit_sabbatical_faile'], content: { error: error } });
    }
}