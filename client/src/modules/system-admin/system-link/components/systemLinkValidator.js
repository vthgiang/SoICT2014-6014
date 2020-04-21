import { VALIDATOR } from '../../../../helpers/validator';

export const LinkDefaultValidator = {
    validateUrl,
    validateDescription
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

function validateDescription(url) {
    let msg = undefined;
    if (url.trim() === ""){
        msg = "Mô tả không được để trống";
    } else if(!VALIDATOR.isValidName(url)){
        msg = "Mô tả không được chứa kí tự đặc biệt";
    }
    return msg;
}