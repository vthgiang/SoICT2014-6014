import {
    VALIDATOR
} from '../../../../helpers/validator';

export const MaterialFormValidator = {
    validateMaterialName,
    validateMaterialCode,
    validateMaterialCost
}

function validateMaterialName(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên không được để trống";
    } else if (value.length < 4) {
        msg = "Tên không ít hơn 4 ký tự";
    } else if (value.length > 50) {
        msg = "Tên không nhiều hơn 50 ký tự";
    } else if (!VALIDATOR.isValidName(value)) {
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}
function validateMaterialCode(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Code không được để trống";
    } else if (value.length < 4) {
        msg = "Code không ít hơn 4 ký tự";
    } else if (value.length > 30) {
        msg = "Code không nhiều hơn 50 ký tự";
    } else if (!VALIDATOR.isValidName(value)) {
        msg = "Code không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateMaterialCost(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị không được để trống";
    }
    return msg;
}