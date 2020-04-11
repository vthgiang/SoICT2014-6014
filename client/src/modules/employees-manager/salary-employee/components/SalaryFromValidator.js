import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const SalaryFormValidator = {
    validateEmployeeNumber,
    validateMainSalary,
    validateNameSalary,
    validateMoreMoneySalary

}
// Function kiểm tra mã nhân viên
function validateEmployeeNumber(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã nhân viên không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã nhân viên không chứa ký tự đặc biệt";
    }
    return msg;
}
// Function kiểm tra tiền lương chính
function validateMainSalary(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tiền lương chính không được để trống";
    }
    return msg;
}
// Function kiểm tra tên lương thưởng khác
function validateNameSalary(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên lương thưởng khác không được để trống";
    }
    return msg;
}
// Function kiểm tra tiền lương thưởng khác
function validateMoreMoneySalary(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tiền lương thưởng khác không được để trống";
    }
    return msg;
}