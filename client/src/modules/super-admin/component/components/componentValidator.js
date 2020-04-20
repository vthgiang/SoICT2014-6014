import { VALIDATOR } from '../../../../helpers/validator';

export const ComponentValidator = {
    validateDescription
}

function validateDescription(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "Mô tả component không được để trống";
    } else if(value.length > 255){
        msg = "Mô tả component không được nhiều hơn 255 ký tự";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "Mô tả component không được chứa ký tự đặc biệt";
    }
    return msg;
}