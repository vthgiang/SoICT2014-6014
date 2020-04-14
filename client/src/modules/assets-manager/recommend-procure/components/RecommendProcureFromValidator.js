import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const RecommendProcureFromValidator = {
    validateEmployeeNumber,
    validateReason,

}

// Kiểm tra mã nhân viên nhập vào
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.employee_number_required');
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = translate('error.staff_code_not_special');
    }
    return msg;
}
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.reason_sabbatical_required');
    }
    return msg;
}