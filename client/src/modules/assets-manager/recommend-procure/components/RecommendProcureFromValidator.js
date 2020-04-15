import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const RecommendProcureFromValidator = {
    validateRecommendNumber,
    validateEquipment,
    validateTotal,
    validateUnit,

}

// Kiểm tra "Mã phiếu" nhập vào
function validateRecommendNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã phiếu không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã phiếu không được chứa kí tự đặc biệt";
    }
    return msg;
}
// Kiểm tra "Thiết bị đề nghị mua" nhập vào
function validateEquipment(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thiết bị đề nghị mua không được để trống";
    }
    return msg;
}
// Kiểm tra "Số lượng" nhập vào
function validateTotal(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số lượng không được để trống";
    }
    return msg;
}
// Kiểm tra "Đơn vị tính" nhập vào
function validateUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Đơn vị tính không được để trống";
    }
    return msg;
}