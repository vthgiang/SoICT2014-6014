import {
    VALIDATOR
} from '../../../../helpers/validator';

export const TimesheetsFormValidator = {
    validateEmployeeNumber,
    validateMonth,
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

// Function kiểm tra tháng chấm công
function validateMonth(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tháng chấm công không được để trống";
    }
    return msg;
}