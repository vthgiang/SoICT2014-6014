import {
    VALIDATOR
} from '../../../../helpers/validator';

export const DistributeTransferFromValidator = {
    validateDistributeNumber,
    validateDateCreate,
    validatePlace,
    validateHandoverMan,
    validateReceiver,
    validateAssetNumber,
    validateNextLocation,
    validateReason
}

//1. Kiểm tra "Mã phiếu" nhập vào
function validateDistributeNumber(value, translate) {
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

//3. Kiểm tra "Địa điểm bàn giao" nhập vào
function validatePlace(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Địa điểm bàn giao không được để trống";
    }
    return msg;
}

//4. Kiểm tra "Người bàn giao" nhập vào
function validateHandoverMan(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người bàn giao không được để trống";
    }
    return msg;
}

//5. Kiểm tra "Người tiếp nhận" nhập vào
function validateReceiver(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người tiếp nhận không được để trống";
    }
    return msg;
}

//6. Kiểm tra "Mã tài sản" nhập vào
function validateAssetNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    }
    return msg;
}

//7. Kiểm tra "Vị trí tiếp theo của tài sản" nhập vào
function validateNextLocation(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Vị trí tiếp theo của tài sản không được để trống";
    }
    return msg;
}
//8. Kiểm tra "Nội dung" nhập vào
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}




