import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const RepairUpgradeFromValidator = {
    validateRepairNumber,
    validateAssetNumber,
    validateReason,
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

//2. Kiểm tra "Mã tài sản" nhập vào
function validateAssetNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    }
    return msg;
}

//3. Kiểm tra "Nội dung" nhập vào
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}
//4. Kiểm tra "Chi phí" nhập vào
function validateCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Chi phí không được để trống";
    }
    return msg;
}
