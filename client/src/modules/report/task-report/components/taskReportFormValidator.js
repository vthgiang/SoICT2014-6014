import { VALIDATOR } from '../../../../helpers/validator';
export const taskReportFormValidator = {
    validateNameTaskReport,
    validateDescriptionTaskReport,
}

function validateNameTaskReport(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên báo cáo không được để trống";
    } else if (value.length < 4) {
        msg = "Tên báo cáo không ít hơn 4 ký tự";
    } else if (value.length > 50) {
        msg = "Tên không nhiều hơn 50 ký tự";
    } else if (!VALIDATOR.isValidName(value)) {
        msg = "Tên báo cáo không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateDescriptionTaskReport(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả báo cáo không được để trống";
    } 
    return msg;
}