import {
    VALIDATOR
} from '../../../../helpers/validator';

export const AnnualLeaveFormValidator = {
    validateEmployeeNumber,
    validateReason,

}

/**
 * Kiểm tra mã nhân viên nhập vào
 * @param {*} value : Mã nhân viên
 * @param {*} translate : Props song ngữ
 */
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.annual_leave.employee_number_required');
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = translate('human_resource.annual_leave.staff_code_not_special');
    }
    return msg;
}

/**
 * Kiểm tra mã lý do nhập vào
 * @param {*} value : Lý do nghỉ
 * @param {*} translate : Props song ngữ
 */
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.annual_leave.reason_annual_leave_required');
    }
    return msg;
}