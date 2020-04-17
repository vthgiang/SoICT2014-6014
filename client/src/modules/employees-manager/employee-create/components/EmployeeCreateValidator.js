import {
    VALIDATOR
} from '../../../../helpers/Validator';

export const EmployeeCreateValidator = {
    validateEmployeeNumber,

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
