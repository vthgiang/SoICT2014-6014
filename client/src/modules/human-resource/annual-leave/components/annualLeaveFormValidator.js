import {
    VALIDATOR
} from '../../../../helpers/validator';

export const AnnualLeaveFormValidator = {
    validateEmployeeNumber,
    validateReason,
    validateStartDate,
    validateEndDate

}

// Kiểm tra mã nhân viên nhập vào
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.annual_leave.employee_number_required');
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = translate('human_resource.annual_leave.staff_code_not_special');
    }
    return msg;
}
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.annual_leave.reason_annual_leave_required');
    }
    return msg;
}
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.annual_leave.start_date_annual_leave_required');
    }
    return msg;
}
function validateEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.annual_leave.end_date_annual_leave_required');
    }
    return msg;
}