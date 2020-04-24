const AnnualLeaveService = require('./annualLeave.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 *  Lấy danh sách nghỉ phép
 */
exports.searchAnnualLeaves = async (req, res) => {
    try {
        var listAnnualLeave = await AnnualLeaveService.searchAnnualLeaves(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_ANNUALLEAVE', req.user.company);
        res.status(200).json({ success: true, message: ["get_annual_leave_success"], content: listAnnualLeave });
    } catch (error) {
        await LogError(req.user.email, 'GET_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, message: ["get_annual_leave_faile"], content: {error:error}});
    }
}

/**
 * Tạo mới thông tin nghỉ phép
 */ 
exports.createAnnualLeave = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["start_date_annual_leave_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["end_date_annual_leave_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["reason_annual_leave_required"], content:{ inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["status_annual_leave_required"], content:{ inputData: req.body } });
        } else {
            var newAnnualLeave = await AnnualLeaveService.createAnnualLeave(req.body, req.user.company._id);
            if (newAnnualLeave === null) {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(404).json({ success: false, message: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else { 
                await LogInfo(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(200).json({
                    success: true,
                    message: ["create_annual_leave_success"],
                    content: newAnnualLeave 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, message: "create_annual_leave_faile", content: { inputData: req.body } });
    }
}

/**
 * Xoá thông tin nghỉ phép
 */
exports.deleteAnnualLeave = async (req, res) => {
    try {
        var annualleaveDelete = await AnnualLeaveService.deleteAnnualLeave(req.params.id);
        await LogInfo(req.user.email, 'DELETE_ANNUALLEAVE', req.user.company);
        res.status(200).json({ 
            success: true, 
            message: ["delete_annual_leave_success"], 
            content: annualleaveDelete 
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, message: ["delete_annual_leave_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin nghỉ phép
 */ 
exports.updateAnnualLeave = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["start_date_annual_leave_required"], content: { inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["end_date_annual_leave_required"], content: { inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["reason_annualleave_required"], content: { inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, message: ["status_annual_leave_required"], content: { inputData: req.body } });
        } else {
            var annualleaveUpdate = await AnnualLeaveService.updateAnnualLeave(req.params.id, req.body);
            if(annualleaveUpdate===null){
                await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
                res.status(404).json({ success: false, message: ["staff_code_not_find"], content: { inputData: req.body } });
            }else{
                await LogInfo(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
                res.status(200).json({ 
                    success: true, 
                    message: ["edit_annual_leave_success"], 
                    content: annualleaveUpdate 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, message: ['edit_annual_leave_faile'], content: { error: error } });
    }
}