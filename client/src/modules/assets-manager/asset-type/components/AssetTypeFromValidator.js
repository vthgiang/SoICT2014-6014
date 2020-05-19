import {
    VALIDATOR
} from '../../../../helpers/validator';

export const AssetTypeFromValidator = {
    validateTypeNumber,

    validateTypeName,
}
// Kiểm tra mã loại tài sản nhập vào
function validateTypeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã loại tài sản không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã loại tài sản không được chứa kí tự đặc biệt";
    }
    return msg;
}

// Kiểm tra tên loại tài sản nhập vào
function validateTypeName(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên loại tài sản không được để trống";
    }
    return msg;
}
