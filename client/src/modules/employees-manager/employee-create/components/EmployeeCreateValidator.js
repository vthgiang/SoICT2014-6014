import {
    VALIDATOR
} from '../../../../helpers/validator';
export const EmployeeCreateValidator = {
    validateEmployeeNumber,
    validateBrithday,
    validateMSCC,
    validateFullName,
    validateEmailCompany,
    validateCMND,
    validateCMNDDate,
    validateAddressCMND,
    validateAddress,
    validateEmail,
    validatePhone,

    validateTaxNumber,
    validateStartTax,
    validateUnitTax,
    validateUserTax,

    validateExperienceUnit,
    validateExperiencePosition,
    validateExperienceStartDate,
    validateExperienceEndDate,

    validateNameCertificate,
    validateAddressCertificate,
    validateYearCertificate,
    validateNameCertificateShort,
    validateUnitCertificateShort,
    validateStartDateCertificateShort,
    validateEndDateCertificateShort,

    validateStartDateContract,
    validateNameContract,
    validateTypeContract,

    validateNameFile,
    validateDiscFile,
    validateNumberFile
}

/**
 * Validate TabGeneralContent (Thông tin chung)
 */
// Kiểm tra mã nhân viên nhập vào
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('error.employee_number_required');
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = translate('error.staff_code_not_special');
    }
    return msg;
}

function validateBrithday(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày sinh không được để trống";
    }
    return msg;
}

function validateMSCC(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã số chấm công không được để trống";
    }
    return msg;
}

function validateFullName(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Họ và tên không được để trống";
    }
    return msg;
}

function validateEmailCompany(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Email công ty không được để trống";
    } else if (!VALIDATOR.isValidEmail(value)) {
        msg = "Email không hợp lệ";
    }
    return msg;
}

function validateCMND(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số chứng minh thư/hộ chiếu không được để trống";
    }
    return msg;
}

function validateCMNDDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày cấp không được để trống";
    }
    return msg;
}

function validateAddressCMND(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nơi cấp không được để trống";
    }
    return msg;
}

// Validate TabContactContent (Thông tin liên hệ)
function validateAddress(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Địa chỉ chỗ ở hiện tại không được để trống";
    }
    return msg;
}

function validateEmail(value, translate) {
    let msg = undefined;
    if (!VALIDATOR.isValidEmail(value)) {
        msg = "Email không hợp lệ";
    }
    return msg;
}

function validatePhone(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Điện thoại di động 1 không được để trống";
    }
    return msg;
}


// Validate TabExperienceContent (học vấn và kinh nghiêm làm việc)
function validateExperienceUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Đơn vị công tác không được để trống";
    }
    return msg;
}

function validateExperiencePosition(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Chức vụ không được để trống";
    }
    return msg;
}

function validateExperienceStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Từ tháng/năm không được để trống";
    }
    return msg;
}

function validateExperienceEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Đến tháng/năm không được để trống";
    }
    return msg;
}

// Validate TabCertificateContent (bằng cấp và chứng chỉ)
function validateNameCertificate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên bằng cấp không được để trống";
    }
    return msg;
}

function validateAddressCertificate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nơi đào tạo không được để trống";
    }
    return msg;
}

function validateYearCertificate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Năm tốt nghiệp không được để trống";
    }
    return msg;
}

function validateNameCertificateShort(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên chứng chỉ không được để trống";
    }
    return msg;
}

function validateUnitCertificateShort(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nơi cấp không được để trống";
    }
    return msg;
}

function validateStartDateCertificateShort(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày cấp không được để trống";
    }
    return msg;
}

function validateEndDateCertificateShort(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày hết hạn không được để trống";
    }
    return msg;
}

// Validate TabContractContent (hợp đồng lao động và quá trình đào tạo)
function validateStartDateContract(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày có hiệu lực không được để trống";
    }
    return msg;
}

function validateNameContract(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên hợp đồng không được để trống";
    }
    return msg;
}

function validateTypeContract(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Loại hợp đồng không được để trống";
    }
    return msg;
}

// Validate TabTaxContent (Tài khoản và thuế)
function validateTaxNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã số thuế không được để trống";
    }
    return msg;
}

function validateStartTax(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày hoạt động không được để trống";
    }
    return msg;
}

function validateUnitTax(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Đơn vị quản lý không được để trống";
    }
    return msg;
}

function validateUserTax(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người đạo diện không được để trống";
    }
    return msg;
}


// Validate TabAttachmentsContent (Tài liệu đính kèm)
function validateNameFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên tài liệu đính kèm không được để trống";
    }
    return msg;
}

function validateDiscFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateNumberFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số lượng không được để trống";
    }
    return msg;
}