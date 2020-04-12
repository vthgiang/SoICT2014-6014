import { VALIDATOR } from '../../../../helpers/Validator';

export const CompanyFormValidator = {
    validateName,
    validateShortName,
    validateEmailSuperAdmin,
    validateDescription
}

function validateName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } else if(value.length < 4){
        msg = "Tên không ít hơn 4 ký tự";
    } else if(value.length > 255){
        msg = "Tên không nhiều hơn 255 ký tự";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateShortName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } else if(value.length < 3){
        msg = "Tên không ít hơn 3 ký tự";
    } else if(value.length > 255){
        msg = "Tên không nhiều hơn 255 ký tự";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateDescription(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } else if(value.length < 3){
        msg = "Tên không ít hơn 3 ký tự";
    } else if(value.length > 255){
        msg = "Tên không nhiều hơn 255 ký tự";
    }
    return msg;
}

function validateEmailSuperAdmin(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Email không được để trống";
    } else if(!VALIDATOR.isValidEmail(value))
        msg = "Email không hợp lệ";
    return msg;
}