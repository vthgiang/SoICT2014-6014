import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const SalaryFormValidator = {
    validateEmployeeNumber,
    validateMonthSalary,
    validateMainSalary,
    validateNameSalary,
    validateMoreMoneySalary

}
// Function kiểm tra mã nhân viên
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.employee_number_required');
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = translate('error.staff_code_not_special');
    }
    return msg;
}
// Function kiểm tra tháng lương 
function validateMonthSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.month_salary_required');
    }
    return msg;
}
// Function kiểm tra tiền lương chính
function validateMainSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.money_salary_required');
    }
    return msg;
}
// Function kiểm tra tên lương thưởng khác
function validateNameSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.name_other_salary_required');
    }
    return msg;
}
// Function kiểm tra tiền lương thưởng khác
function validateMoreMoneySalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.money_other_salary_required');
    }
    return msg;
}