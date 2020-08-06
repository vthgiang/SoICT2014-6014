import { VALIDATOR } from '../../../helpers/validator';

export const Validator = {
    validateName,
    validateEmail,
    validatePassword
}

function validateName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Tên không được để trống";
    } else if(value.length < 4){
        msg = "Tên không ít hơn 4 ký tự";
    } else if(value.length > 50){
        msg = "Tên không nhiều hơn 50 ký tự";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateEmail(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Email không được để trống";
    } else if(!VALIDATOR.isValidEmail(value))
        msg = "Email không hợp lệ";
    return msg;
}

function validatePassword(password){
    let msg = undefined;
    if(password.length < 6 || password.length > 30){
        msg = "auth.validator.password_length_error";
    }
    
    return msg;
}