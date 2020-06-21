const SalaryService = require('./salary.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy danh sách các bảng lương
 */
exports.searchSalaries = async (req, res) => {
    try {
        let data = {};
        if(req.query.page !== undefined && req.query.limit !== undefined ){
            let params = {
                organizationalUnit: req.query.organizationalUnit,
                position: req.query.position,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await SalaryService.searchSalaries(params, req.user.company._id);
        }
        await LogInfo(req.user.email, 'GET_SARALY', req.user.company);
        res.status(200).json({ success: true, messages:["get_salary_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'GET_SARALY', req.user.company);
        res.status(400).json({success: false, messages:["get_salary_faile"], content: {error: error}});
    }
}
/**
 * Tạo mới một bảng lương 
 */
exports.createSalary = async (req, res) => {
    try {
        if (req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.month.trim()===""){
            await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
            res.status(400).json({ success: false, messages: ["month_salary_required"], content:{ inputData: req.body } });
        } else if(req.body.mainSalary.trim()===""){
            await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
            res.status(400).json({ success: false, messages: ["money_salary_required"], content:{ inputData: req.body } });
        } else {
            var createSaraly = await SalaryService.createSalary(req.body, req.user.company._id);
            if(createSaraly===null){
                await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else if(createSaraly==="have_exist") {
                await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
                res.status(400).json({ success: false, messages: ["month_salary_have_exist"], content:{ inputData: req.body } });
            } else{
                await LogInfo(req.user.email, 'CREATE_SARALY', req.user.company);
                res.status(200).json({
                    success: true,
                    messages:["create_salary_success"],
                    content: createSaraly
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
        res.status(400).json({success: false, messages:["create_salary_faile"], content: {error: error}});
    }
}

/**
 * Xoá thông tin bảng lương
 */ 
exports.deleteSalary = async (req, res) => {
    try {
        var saralyDelete = await SalaryService.deleteSalary(req.params.id);
        await LogInfo(req.user.email, 'DELETE_SARALY', req.user.company);
        res.status(200).json({success: true, messages:["delete_salary_success"], content: saralyDelete});
    } catch (error) {
        await LogError(req.user.email, 'DELETE_SARALY', req.user.company);
        res.status(400).json({success: false, messages:["delete_salary_faile"], content: {error: error}});
    }
}
/**
 * Chỉnh sửa thông tin bảng lương
 */
exports.updateSalary = async (req, res) => {
    try {
        if(req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_SARALY', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.month.trim()===""){
            await LogError(req.user.email, 'EDIT_SARALY', req.user.company);
            res.status(400).json({ success: false, messages: ["month_salary_required"], content:{ inputData: req.body } });
        } else if(req.body.mainSalary.trim()===""){
            await LogError(req.user.email, 'EDIT_SARALY', req.user.company);
            res.status(400).json({ success: false, messages: ["money_salary_required"], content:{ inputData: req.body } });
        } else {
            var saralyUpdate = await SalaryService.updateSalary(req.params.id,req.body,req.user.company._id);
            if(saralyUpdate===null){
                await LogError(req.user.email, 'CREATE_SARALY', req.user.company);
                res.status(404).json({ success: false, messages: ["staff_code_not_find"], content:{ inputData: req.body } });
            } else {
                await LogInfo(req.user.email, 'EDIT_SARALY', req.user.company);
                res.status(200).json({
                    success: true,
                    messages:["edit_salary_success"],
                    content: saralyUpdate
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_SARALY', req.user.company);
        res.status(400).json({
            success: false,
            messages:["edit_salary_faile"],
            content: {error: error}
        });
    }
}

// Import dữ liệu bảng lương
exports.importSalaries = async (req, res) => {
    try {
        var data = await SalaryService.importSalaries(req.body, req.user.company._id);
        console.log(data);
        if(data.rowError!==undefined){
            await LogError(req.user.email, 'IMPORT_SARALY', req.user.company);
            res.status(400).json({
                success: false,
                messages:["import_salary_faile"],
                content: data
            });
        }else{
            await LogInfo(req.user.email, 'IMPORT_SARALY', req.user.company);
            res.status(200).json({
                success: true,
                messages:["import_salary_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'IMPORT_SARALY', req.user.company);
        res.status(400).json({
            success: false,
            messages:["import_salary_faile"],
            content: {error: error}
        });
    }
}
