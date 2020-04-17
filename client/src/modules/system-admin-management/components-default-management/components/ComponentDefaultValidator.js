import { VALIDATOR } from '../../../../helpers/Validator';

export const ComponentDefaultValidator = {
    validateName,
    validateDescription
}

function validateName(url) {
    let msg = undefined;
    if (url.trim() === ""){
        msg = "Tên không được để trống";
    } else if(!VALIDATOR.isValidName(url)){
        msg = "Tên không hợp lệ. Tên không được chứa kí tự đặc biệt";
    }
    return msg;
}

function validateDescription(url) {
    let msg = undefined;
    if (url.trim() === ""){
        msg = "Mô tả không được để trống";
    } else if(!VALIDATOR.isValidName(url)){
        msg = "Mô tả không được chứa kí tự đặc biệt";
    }
    return msg;
}