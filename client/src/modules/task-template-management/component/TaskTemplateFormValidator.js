import { VALIDATOR } from '../../../helpers/Validator';

export const TaskTemplateFormValidator = {
    validateTaskTemplateUnit,
    validateTaskTemplateRead,
    validateTaskTemplateName,
    validateTaskTemplateDescription,
    validateTaskTemplateFormula,
    validateActionName,
    validateActionDescription,
    validateInfoName,
    validateInfoDescription,
    validateInfoSetOfValues
}

function validateTaskTemplateUnit(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Cần chọn đơn vị";
    }
    return msg;
}

function validateTaskTemplateRead(value) {
    let msg = undefined;
    if (value.length === 0){
        msg = "Cần chỉ rõ người được xem mẫu công việc";
    }
    return msg;
}

function validateTaskTemplateName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateTaskTemplateDescription(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateTaskTemplateFormula(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Công thức tính không được để trống";
    }
    // TODO: Thêm validate công thức
    return msg;
}

function validateActionName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } 
    return msg;
}

function validateActionDescription(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateInfoName(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    }
    return msg;
}

function validateInfoDescription(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateInfoSetOfValues(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tập giá trị không được để trống";
    }
    return msg;
}