import { VALIDATOR } from '../../../../helpers/Validator';

export const CompanyFormValidator = {
    validateName,
    validateShortName,
    validateEmailSuperAdmin,
    validateDescription,
    validateUrl
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
    } else if (!VALIDATOR.isStringNotSpace(value)){
        msg = "Tên ngắn của công ty không hợp lê. Các chữ không được cách nhau";
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
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Tên không chứa ký tự đặc biệt";
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

function validateUrl(url) {
    let msg = undefined;
    if (url.trim() === ""){
        msg = "Url không được để trống";
    } else if(!VALIDATOR.isValidUrl(url)){
        msg = "Url không hợp lệ. Url phải bắt đầu bằng kí tự /";
    }
    return msg;
}