import {
    VALIDATOR
} from '../../../../helpers/validator';

export const RepairUpgradeFromValidator = {
    validateRepairNumber,
    validateDateCreate,
    validateCode,
    validateReason,
    validateRepairDate,
    validateCost,

}

//1. Kiểm tra "Mã phiếu" nhập vào
function validateRepairNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã phiếu không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã phiếu không được chứa kí tự đặc biệt";
    }
    return msg;
}

//2. Kiểm tra "Ngày lập" nhập vào
function validateDateCreate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày lập không được để trống";
    }
    return msg;
}

//3. Kiểm tra "Mã tài sản" nhập vào
function validateCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    }
    return msg;
}

//4. Kiểm tra "Nội dung" nhập vào
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}

//5. Kiểm tra "Ngày sửa chữa" nhập vào
function validateRepairDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày sửa chữa không được để trống";
    }
    return msg;
}

//6. Kiểm tra "Chi phí" nhập vào
function validateCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Chi phí không được để trống";
    }
    return msg;
}
