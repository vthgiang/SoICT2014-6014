import {
    VALIDATOR
} from '../../../../helpers/validator';
export const UsageFormValidator = {

    validateStartDate, // ngày bắt đầu sử dụng
    validateEndDate, // ngày kết thúc sử dụng
    validateUsedBy, // người sử dụng
    validateDescription
}

function validateUsedBy(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người sử dụng không được để trống";
    }
    return msg;
}
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày bắt đầu sử dụng không được để trống";
    }
    return msg;
}

function validateEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày kết thúc sử dụng không được để trống";
    }
    return msg;
}

// Function kiểm tra nội dung
function validateDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}

