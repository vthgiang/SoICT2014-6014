const SalaryService = require('./salary.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy danh sách các bảng lương
 */
exports.searchSalary = async (req, res) => {
    try {
        var listSaralys = await SalaryService.searchSalary(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_SARALY', req.user.company);
        res.status(200).json({ success: true, messages:["get_salary_success"], content: listSaralys});
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

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
exports.checkSalary = async (req, res) => {
    try {
        var checkSalary = await SalaryService.checkSalary(req.params.employeeNumber,req.params.month, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: checkSalary
        });
    } catch (error) {
        res.status(400).json({
            messages: error,
        });
    }
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array truyền vào
exports.checkArraySalary = async (req, res) => {
    try {
        var checkArraySalary = await SalaryService.checkArraySalary(req.body, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: checkArraySalary
        });
    } catch (error) {
        res.status(400).json({
            messages: error,
        });
    }
}

// Import dữ liệu bảng lương
exports.importSalary = async (req, res) => {
    try {
        var importSalary = await SalaryService.importSalary(req.body, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: importSalary
        });
    } catch (error) {
        res.status(400).json({
            messages: error,
        });
    }
}