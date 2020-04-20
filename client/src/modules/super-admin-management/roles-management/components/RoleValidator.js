import { VALIDATOR } from '../../../../helpers/validator';

export const RoleValidator = {
    validateName
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