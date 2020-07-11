import { VALIDATOR } from '../../../../helpers/validator';

export const TaskFormValidator = {
    validateTaskUnit,
    validateTaskName,
    validateTaskDescription,
    validateTaskResponsibleEmployees,
    validateTaskAccountableEmployees,
    validateTaskStartDate,
    validateTaskEndDate,
}

function validateTaskUnit(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Cần chọn đơn vị";
    }
    return msg;
}

function validateTaskName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateTaskDescription(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Mô tả không được để trống";
    }
    return msg;
}

/**
 * @param {*} value Định dạng: dd-mm-yyyy
 */
function validateTaskStartDate(startDate, endDate) {
    let msg = undefined;

    if (startDate.trim() === ""){
        msg = "Hãy chọn ngày bắt đầu công việc";
    } else if (endDate !== ""){
        msg = _validateTaskDate(startDate, endDate);
    }
    return msg;
}

/**
 * @param {*} startDate Định dạng: dd-mm-yyyy
 * @param {*} endDate Định dạng: dd-mm-yyyy
 */
function validateTaskEndDate(startDate, endDate) {
    let msg = undefined;

    if (endDate.trim() === ""){
        msg = "Hãy chọn ngày kết thúc công việc";
    } else if (startDate !== ""){
        msg = _validateTaskDate(startDate, endDate);
    }
    return msg;
}

/**
 * Hàm tiện ích kiểm tra ngày bắt đầu phải trước ngày kết thúc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 */
function _validateTaskDate(startDate, endDate){
    let msg = undefined;
    var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;

    var startDate = new Date(startDate.replace(pattern,'$3-$2-$1'));
    var endDate = new Date(endDate.replace(pattern,'$3-$2-$1'));
    if (startDate > endDate){
        msg = "Thời gian kết thúc phải sau thời gian bắt đầu!"
    }
    return msg;
}


function validateTaskResponsibleEmployees(value) {
    let msg = undefined;
    if (value.length === 0){
        msg = "Cần chỉ rõ người thực hiện công việc";
    }
    return msg;
}
function validateTaskAccountableEmployees(value) {
    let msg = undefined;
    if (value.length === 0){
        msg = "Cần chỉ rõ người phê duyệt công việc";
    }
    return msg;
}