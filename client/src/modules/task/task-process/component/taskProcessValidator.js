import { VALIDATOR } from '../../../../helpers/validator';

export const TaskProcessValidator = {
    validateManager,
    validateProcessDescription,
    validateProcessName,
    validateViewer,
}


// validate name
function validateProcessName(value) {
    let msg;
    if (value.trim() === "") {
        msg = "Tên quy trình không được bỏ trống"
    } else if (!VALIDATOR.isValidName(value)) {
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

// validate description
function validateProcessDescription(value) {
    let msg;
    if (value.trim() === "") {
        msg = "Mô tả quy trình không được bỏ trống"
    }
    return msg;
}

// validate viewer
function validateViewer(value) {
    let msg;
    if (value.length === 0) {
        msg = "Cần chỉ rõ những người có quyền xem mẫu quy trình"
    }
    return msg;
}


// validate manager
function validateManager(value) {
    let msg;
    if (value.length === 0) {
        msg = "Cần chỉ rõ những người quản lý mẫu quy trình"
    }
    return msg;
}

