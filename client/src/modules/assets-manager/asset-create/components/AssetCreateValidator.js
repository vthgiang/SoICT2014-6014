import {
    VALIDATOR
} from '../../../../helpers/validator';
export const AssetCreateValidator = {

    /** Thông tin chung */
    validateAssetNumber, //mã tài sản
    validateDatePurchase, //ngày nhập
    validateDateStartUse, //ngày bát đầu
    validateDateEndUse, //ngày kết thúc
    validateAssetName, //tên tài sản
    validateAssetType, //loại tài sản
    validateLocation, //vị trí tài sản
    validateManager, //người quản lý
    validatePerson, //người sử dụng
    validateInitialPrice, //giá trị ban đầu
    validateNameField, //tên trường dữ liệu
    validateValue, //giá trị

    /** Sửa chữa - thay thế - nâng cấp */

    /** Cấp phát - điều chuyển - thu hồi */

    /** Thông tin khấu hao */
    validateStartDepreciation,
    validateTimeDepreciation,

    /** Tài liệu đính kèm */
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

//kiểm tra người sử dụng
function validatePerson(value, translate) {
    return undefined;
}

//kiểm tra ngày nhập
function validateDateStartUse(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
    }
    return msg;
}

//kiểm tra ngày nhập
function validateDateEndUse(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
    }
    return msg;
}

/**
 * Validate TabGeneralContent (Thông tin chung)
 */

//kiểm tra thời  gian bắt đầu trích khấu hao
function validateStartDepreciation(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thời gian bắt đầu trích khấu hao không được để trống";
    }
    return msg;
}

//kiểm tra thời gian trích khấu hao
function validateTimeDepreciation(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thời gian trích khấu hao không được để trống";
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
