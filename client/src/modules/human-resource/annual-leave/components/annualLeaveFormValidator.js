export const AnnualLeaveFormValidator = {
    validateEmployeeNumber,
    validateReason,
    validateTotalHour,
}


/**
 * Kiểm tra mã nhân viên nhập vào
 * @param {*} value : Mã nhân viên
 * @param {*} translate : Props song ngữ
 */
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value && value.trim() === "") {
        msg = translate('human_resource.annual_leave.employee_number_required');
    }
    return msg;
}

/**
 * Kiểm tra lý do nhập vào
 * @param {*} value : Lý do nghỉ
 * @param {*} translate : Props song ngữ
 */
function validateReason(value, translate) {
    let msg = undefined;
    if (!value||value?.trim() === "") {
        // msg = translate('human_resource.annual_leave.reason_annual_leave_required');
        msg = 'Giá trị không được để trống';
    }
    return msg;
}

/**
 * Kiểm tra tổng giờ nhập vào nhập vào
 * @param {*} value : Lý do nghỉ
 * @param {*} translate : Props song ngữ
 */
function validateTotalHour(value, translate) {
    let msg = undefined;
    if (value.toString().trim() === "") {
        msg = 'Giá trị không được để trống';
    }
    let t = parseFloat(value.toString().trim());
    if (value.toString().trim() !== "" && (!t || t<0)) {
        msg = 'Giá trị lớn hơn 0'
    }

    return msg;
}