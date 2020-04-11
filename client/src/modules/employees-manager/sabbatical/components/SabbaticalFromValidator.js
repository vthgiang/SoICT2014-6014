import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const SabbaticalFormValidator = {
    validateEmployeeNumber,
    validateReason,

}

function validateEmployeeNumber(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã nhân viên không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã nhân viên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateReason(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Lý do không được để trống";
    }
    return msg;
}