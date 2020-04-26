import {
    VALIDATOR
} from '../../../../helpers/validator';

export const CommendationFromValidator = {
    validateEmployeeNumber,
    validateReason,
    validateDecisionNumber,
    validateOrganizationalUnit,
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
function validateDecisionNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.number_decisions_required');
    }
    return msg;
}
// Kiểm tra cấp ra quyết định
function validateOrganizationalUnit(value, translate) {
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
        msg = translate('error.type_commendations_required');
    }
    return msg;
}
// Kiểm tra lý do nhập vào
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.reason_commendations_required');
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