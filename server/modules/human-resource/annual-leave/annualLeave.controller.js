const AnnualLeaveService = require('./annualLeave.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 *  Lấy danh sách nghỉ phép
 */
exports.searchAnnualLeaves = async (req, res) => {
    try {
        let data = {};
        if(req.query.page === undefined && req.query.limit === undefined){
            data = await AnnualLeaveService.getTotalAnnualLeave(req.user.company._id, req.query.organizationalUnit, req.query.month)
        } else {
            let params = {
                organizationalUnit: req.query.organizationalUnit,
                position: req.query.position,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                status: req.query.status,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await AnnualLeaveService.searchAnnualLeaves(params, req.user.company._id);
        }
        
        await LogInfo(req.user.email, 'GET_ANNUALLEAVE', req.user.company);
            res.status(200).json({ success: true, messages: ["get_annual_leave_success"], content: data });
    } catch (error) {
        await LogError(req.user.email, 'GET_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, messages: ["get_annual_leave_faile"], content: {error:error}});
    }
}

/**
 * Tạo mới thông tin nghỉ phép
 */ 
exports.createAnnualLeave = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_annual_leave_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["end_date_annual_leave_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_annual_leave_required"], content:{ inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["status_annual_leave_required"], content:{ inputData: req.body } });
        } else {
            var newAnnualLeave = await AnnualLeaveService.createAnnualLeave(req.body, req.user.company._id);
            if (newAnnualLeave === null) {
                await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else { 
                await LogInfo(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["create_annual_leave_success"],
                    content: newAnnualLeave 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, messages: "create_annual_leave_faile", content: { inputData: req.body } });
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
            messages: ["delete_annual_leave_success"], 
            content: annualleaveDelete 
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, messages: ["delete_annual_leave_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin nghỉ phép
 */ 
exports.updateAnnualLeave = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_annual_leave_required"], content: { inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["end_date_annual_leave_required"], content: { inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_annualleave_required"], content: { inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
            res.status(400).json({ success: false, messages: ["status_annual_leave_required"], content: { inputData: req.body } });
        } else {
            var annualleaveUpdate = await AnnualLeaveService.updateAnnualLeave(req.params.id, req.body);
            if(annualleaveUpdate===null){
                await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content: { inputData: req.body } });
            }else{
                await LogInfo(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
                res.status(200).json({ 
                    success: true, 
                    messages: ["edit_annual_leave_success"], 
                    content: annualleaveUpdate 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_ANNUALLEAVE', req.user.company);
        res.status(400).json({ success: false, messages: ['edit_annual_leave_faile'], content: { error: error } });
    }
}