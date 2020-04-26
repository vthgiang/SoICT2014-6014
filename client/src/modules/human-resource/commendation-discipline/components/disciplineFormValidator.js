import {
    VALIDATOR
} from '../../../../helpers/validator';

export const DisciplineFromValidator = {
    validateEmployeeNumber,
    validateReason,
    validateDecisionNumber,
    validateOrganizationalUnit,
    validateType,
    validateStartDate,
    validateEndDate

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
        msg = translate('error.type_discipline_required');
    }
    return msg;
}
// Kiểm tra lý do nhập vào
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.reason_discipline_required');
    }
    return msg;
}
// Kiểm tra ngày có hiệu lực
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.start_date_discipline_required');
    }
    return msg;
}
// Kiểm tra ngày hết hiệu lực
function validateEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.end_date_discipline_required');
    }
    return msg;
}