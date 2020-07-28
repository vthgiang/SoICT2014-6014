export const HolidayFormValidator = {
    validateStartDate,
    validateEndDate,
    validateDescription,
}

// Function kiểm tra thới gian bắt đầu nhập vào
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.holiday.start_date_required');
    }
    return msg;
}
// Function kiểm tra thời gian kết thúc nhập vào
function validateEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.holiday.end_date_required');
    }
    return msg;
}

// Function kiểm tra lý do nghỉ
function validateDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.holiday.reason_required');
    }
    return msg;
}