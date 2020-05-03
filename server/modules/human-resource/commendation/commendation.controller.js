const CommendationService = require('./commendation.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy danh sách khen thưởng
 */
exports.searchCommendations = async (req, res) => {
    try {
        var listCommendations = await CommendationService.searchCommendations(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_COMMENDATIONS', req.user.company);
        res.status(200).json({ success: true, messages:["get_commendations_success"], content: listCommendations});
    } catch (error) {
        await LogError(req.user.email, 'GET_COMMENDATIONS', req.user.company);
        res.status(400).json({ success: false, messages:["get_commendations_faile"], content: {error: error}});
    }
}
/**
 * Tạo mới khen thưởng của nhân viên
 */
exports.createCommendation = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.decisionNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["number_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.organizationalUnit.trim()===""){
            await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["unit_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["decisions_date_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["type_commendations_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_commendations_required"], content:{ inputData: req.body } });
        } else {
            var createCommendation = await CommendationService.createCommendation(req.body, req.user.company._id);
            if(createCommendation===null){
                await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else if(createCommendation==="have_exist") {
                await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
                res.status(400).json({ success: false, messages: ["number_decisions_have_exist"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
                res.status(200).json({
                    success: true,
                    messages:["create_commendations_success"],
                    content: createCommendation
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_COMMENDATIONS', req.user.company);
        res.status(400).json({success: false, messages:["create_commendations_faile"], content: {error: error}});
    }
}
/**
 * Xoá thông tin khen thưởng
 */
exports.deleteCommendation = async (req, res) => {
    try {
        var commendationDelete = await CommendationService.deleteCommendation(req.params.id);
        await LogInfo(req.user.email, 'DELETE_COMMENDATIONS', req.user.company);
        res.status(200).json({ success: true, messages:["delete_commendations_success"], content: commendationDelete});
    } catch (error) {
        await LogError(req.user.email, 'DELETE_COMMENDATIONS', req.user.company);
        res.status(400).json({ success: false, messages:["delete_commendations_faile"], content: {error: error}});
    }
}
/**
 * Chỉnh sửa thông tin khen thưởng
 */
exports.updateCommendation = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.decisionNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["number_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.organizationalUnit.trim()===""){
            await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["unit_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["type_commendations_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_commendations_required"], content:{ inputData: req.body } });
        } else {
            var commendationUpdate = await CommendationService.updateCommendation(req.params.id, req.body, req.user.company._id);
            if(commendationUpdate===null){
                await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
                res.status(200).json({
                    success: true,
                    messages:["edit_commendations_success"],
                    content: commendationUpdate
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_COMMENDATIONS', req.user.company);
        res.status(400).json({success: false, messages:["edit_commendations_faile"], content: {error: error}});
    }
}