export const TaskFormValidator = {
    validateTaskStartDate,
    validateTaskEndDate,
}


/**
 * @param {*} value Định dạng: dd-mm-yyyy
 */
function validateTaskStartDate(startDate, endDate, translate) {
    let msg = undefined;

    if (startDate.trim() === ""){
        msg = translate('task.task_management.add_err_empty_start_date');
    } else if (endDate !== ""){
        msg = _validateTaskDate(startDate, endDate, translate);
    }
    return msg;
}

/**
 * @param {*} startDate Định dạng: dd-mm-yyyy
 * @param {*} endDate Định dạng: dd-mm-yyyy
 */
function validateTaskEndDate(startDate, endDate, translate) {
    let msg = undefined;

    if (endDate.trim() === ""){
        msg = translate('task.task_management.add_err_empty_end_date');
    } else if (startDate !== ""){
        msg = _validateTaskDate(startDate, endDate, translate);
    }
    return msg;
}

/**
 * Hàm tiện ích kiểm tra ngày bắt đầu phải trước ngày kết thúc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 */
function _validateTaskDate(startDate, endDate, translate){
    let msg = undefined;
    var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;

    var startDate = new Date(startDate.replace(pattern,'$3-$2-$1'));
    var endDate = new Date(endDate.replace(pattern,'$3-$2-$1'));
    if (startDate > endDate){
        msg = translate('task.task_management.add_err_end_date');
    }
    return msg;
}