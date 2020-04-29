import {
    VALIDATOR
} from '../../../../helpers/validator';

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
        msg = translate('human_resource.employee_number_required');
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = translate('human_resource.staff_code_not_special');
    }
    return msg;
}
// Function kiểm tra tháng lương 
function validateMonthSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.month_salary_required');
    }
    return msg;
}
// Function kiểm tra tiền lương chính
function validateMainSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.money_salary_required');
    }
    return msg;
}
// Function kiểm tra tên lương thưởng khác
function validateNameSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.name_other_salary_required');
    }
    return msg;
}
// Function kiểm tra tiền lương thưởng khác
function validateMoreMoneySalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.money_other_salary_required');
    }
    return msg;
}