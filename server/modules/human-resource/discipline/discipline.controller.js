const DisciplineService = require('./discipline.service');
const { LogInfo, LogError } = require('../../../logs');
/**
 * Lấy danh sách kỷ luật
 */
exports.searchDisciplines = async (req, res) => {
    try {
        params = {
            organizationalUnit: req.query.organizationalUnit,
            position: req.query.position,
            employeeNumber: req.query.employeeNumber,
            decisionNumber: req.query.decisionNumber,
            page: req.query.page !==undefined ? Number(req.query.page) : 0,
            limit: req.query.limit !==undefined ? Number(req.query.limit) :100,
        }
        var listDisciplines = await DisciplineService.searchDisciplines(params, req.user.company._id);
        await LogInfo(req.user.email, 'GET_DISCIPLINE', req.user.company);
        res.status(200).json({ success: true, messages:["get_discipline_success"], content: listDisciplines});
    } catch (error) {
        await LogError(req.user.email, 'GET_DISCIPLINE', req.user.company);
        res.status(400).json({success: false, messages:["get_discipline_faile"], content: {error: error} });
    }
}

/**
 * Tạo mới kỷ luật của nhân viên
 */
exports.createDiscipline = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.decisionNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["number_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.organizationalUnit.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["unit_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_discipline_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["end_date_discipline_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_discipline_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_discipline_required"], content:{ inputData: req.body } });
        } else {
            var createDiscipline = await DisciplineService.createDiscipline(req.body, req.user.company._id, req.user.company._id);
            if(createDiscipline===null){
                await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else if(createDiscipline==="have_exist") {
                await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
                res.status(400).json({ success: false, messages: ["number_decisions_have_exist"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
                res.status(200).json({
                    success: true,
                    messages:["create_discipline_success"],
                    content: createDiscipline
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_DISCIPLINE', req.user.company);
        res.status(400).json({success: false, messages:["create_discipline_faile"], content: {error: error}});
    }
}

/**
 * Xoá thông tin kỷ luật
 */
exports.deleteDiscipline = async (req, res) => {
    try {
        var disciplineDelete = await DisciplineService.deleteDiscipline(req.params.id);
        await LogInfo(req.user.email, 'DELETE_DISCIPLINE', req.user.company);
        res.status(200).json({success: true, messages:["delete_discipline_success"], content: disciplineDelete});
    } catch (error) {
        await LogError(req.user.email, 'DELETE_DISCIPLINE', req.user.company);
        res.status(400).json({success: false, messages:["delete_discipline_faile"], content: {error: error}});
    }
}

/**
 * Chỉnh sửa thông tin kỷ luật
 */
exports.updateDiscipline = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.decisionNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["number_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.organizationalUnit.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["unit_decisions_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["end_date_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_discipline_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_discipline_required"], content:{ inputData: req.body } });
        } else {
            var disciplineUpdate = await DisciplineService.updateDiscipline(req.params.id, req.body, req.user.company._id);
            if(disciplineUpdate===null){
                await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
                res.status(200).json({
                    success: true,
                    messages:["edit_discipline_success"],
                    content: disciplineUpdate
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_DISCIPLINE', req.user.company);
        res.status(400).json({success: false, messages:["edit_discipline_faile"], content: {error: error}});
    }
}