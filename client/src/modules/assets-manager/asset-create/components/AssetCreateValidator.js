import {
    VALIDATOR
} from '../../../../helpers/Validator';
export const AssetCreateValidator = {
    /** Thông tin chung */
    validateAssetNumber, //mã tài sản
    validateDatePurchase, //ngày nhập
    validateAssetName, //tên tài sản
    validateAssetType, //loại tài sản
    validateLocation, //vị trí tài sản
    validateManager, //người quản lý
    validateInitialPrice, //giá trị ban đầu
    validateNameField, //tên trường dữ liệu
    validateValue, //giá trị

    /** Sửa chữa - thay thế - nâng cấp */
    /** Cấp phát - điều chuyển - thu hồi */
    /** Thông tin khấu hao */
    /** Tài liệu đính kèm */




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
    validateNumberFile,

}

/**
 * Validate TabGeneralContent (Thông tin chung)
 */
// Kiểm tra mã tài sản nhập vào
function validateAssetNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã tài sản không được chứa kí tự đặc biệt";
    }
    return msg;
}

//kiểm tra ngày nhập
function validateDatePurchase(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
    }
    return msg;
}

//kiểm tra tên tài sản
function validateAssetName(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên tài sản không được để trống";
    }
    return msg;
}

//kiểm tra loại tài sản
function validateAssetType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Loại tài sản không được để trống";
    }
    return msg;
}

//kiểm tra vị trí tài sản
function validateLocation(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Vị trí tài sản không được để trống";
    }
    return msg;
}

//kiểm tra giá trị ban đầu của tài sản
function validateInitialPrice(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị ban đầu không được để trống";
    }
    return msg;
}

//kiểm tra người quản lý
function validateManager(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người quản lý không được để trống";
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


// Function kiểm tra tên trường dữ liệu
function validateNameField(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên trường dữ liệu không được để trống";
    }
    return msg;
}
// Function kiểm tra giá trị trường dữ liệu
function validateValue(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị không được để trống";
    }
    return msg;
}