import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const PraiseFromValidator = {
    validateEmployeeNumber,
    validateReason,
    validateNumber,
    validateUnit,
    validateType,
    validateStartDate
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

// Kiểm tra số ra quyết định nhập vào
function validateNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.number_decisions_required');
    }
    return msg;
}
// Kiểm tra cấp ra quyết định
function validateUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.unit_decisions_required');
    }
    return msg;
}
// Kiểm tra lý do nhập vào
function validateType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.type_praise_required');
    }
    return msg;
}
// Kiểm tra lý do nhập vào
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.reason_praise_required');
    }
    return msg;
}
// Kiểm tra ngày ra quyết định
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.decisions_date_required');
    }
    return msg;
}