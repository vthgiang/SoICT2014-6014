import {
    VALIDATOR
} from '../../../../helpers/validator';

export const AssetCrashFromValidator = {
    validateCode,
    validateReportDate,
    validateAnnunciator,
    validateDetectionDate,
    validateReason,
    

}


//2. Kiểm tra "Ngày báo cáo" nhập vào
function validateReportDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày báo cáo không được để trống";
    }
    return msg;
}

// Kiểm tra "Ngày phát hiện" nhập vào
function validateDetectionDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày phát hiện sự cố không được để trống";
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

// Kiểm tra "Người báo cáo" nhập vào
function validateAnnunciator(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người báo cáo không được để trống";
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

