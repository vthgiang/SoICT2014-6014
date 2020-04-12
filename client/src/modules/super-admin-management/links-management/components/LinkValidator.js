import { VALIDATOR } from '../../../../helpers/Validator';

export const LinkValidator = {
    validateDescription
}

function validateDescription(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Mô tả không được để trống";
    } else if(value.length > 255){
        msg = "Mô tả không được nhiều hơn 255 ký tự";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Mô tả không được chứa ký tự đặc biệt";
    }
    return msg;
}