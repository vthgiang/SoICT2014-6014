import {
    VALIDATOR
} from '../../../../helpers/validator';
export const AssetCreateValidator = {

    /** 
     * Thông tin chung
     */
    validateCode, //mã tài sản
    validateAssetName, //tên tài sản
    validateSerial, //Số serial
    validateAssetType, //loại tài sản
    validateDatePurchase, //ngày nhập
    validateWarrantyExpirationDate, //ngày bảo hành
    validateManager, //người quản lý
    validatePerson, //người sử dụng
    validateDateStartUse, //ngày bát đầu
    validateDateEndUse, //ngày kết thúc
    validateLocation, //vị trí tài sản
    validateInitialPrice, //giá trị ban đầu
    validateNameField, //tên trường dữ liệu
    validateValue, //giá trị

    /**
     * Sửa chữa - thay thế - nâng cấp
     */

    /**
     * Cấp phát - điều chuyển - thu hồi
     */

    /** 
     * Thông tin khấu hao
     */
    validateCost, //Nguyên giá
    validateResidualValue, //Giá trị thu hồi dự tính
    validateTimeDepreciation, // Thời gian trích khấu hao
    validateStartDepreciation, // Thời gian bắt đầu trích khấu hao

    /** 
     * Tài liệu đính kèm 
    */
    validateNameFile,
    validateDiscFile,
    validateNumberFile,

    /**
     * Thông tin thanh lý
     */
    validateDisposalDate,
    validateDisposalType,
    validateDisposalCost,
    validateDisposalDescription,

}

/**
 * Validate TabGeneralContent (Thông tin chung)
 */
/**
 * Kiểm tra mã tài sản nhập vào
 */
function validateCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã tài sản không được chứa kí tự đặc biệt";
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

/**
 * kiểm tra số serial
 */
function validateSerial(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số serial không được để trống";
    }
    return msg;
}

/**
 * kiểm tra loại tài sản
 */
function validateAssetType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Loại tài sản không được để trống";
    }
    return msg;
}

/**
 * kiểm tra ngày nhập
 */
function validateDatePurchase(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
    }
    return msg;
}

/**
 * kiểm tra ngày bảo hành
 */
function validateWarrantyExpirationDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày bảo hành không được để trống";
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

//kiểm tra ngày bắt đầu sử dụng
function validateDateStartUse(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
    }
    return msg;
}

//kiểm tra kết thúc sử dụng
function validateDateEndUse(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
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


/**
 * Validate TabDepreciation (Thông tin khấu hao)
 */

//kiểm tra Nguyên giá
function validateCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nguyên giá không được để trống";
    }
    return msg;
}

//kiểm tra Giá trị thu hồi dự tính
function validateResidualValue(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị thu hồi dự tính không được để trống";
    }
    return msg;
}

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


/**
 * Validate TabAttachmentsContent (Tài liệu đính kèm)
 */

 // kiểm tra tên file
function validateNameFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên tài liệu đính kèm không được để trống";
    }
    return msg;
}

// kiểm tra mô tả file
function validateDiscFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả không được để trống";
    }
    return msg;
}

// kiểm tra số lượng file
function validateNumberFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số lượng không được để trống";
    }
    return msg;
}

/**
 * Validate TabDisposal (Thông tin thanh lý)
 */

 // kiểm tra ngày thanh lý
function validateDisposalDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày thanh lý không được để trống";
    }
    return msg;
}

 // kiểm tra hình thức thanh lý
 function validateDisposalType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Hình thức thanh lý không được để trống";
    }
    return msg;
}

 // kiểm tra giá trị thanh lý
 function validateDisposalCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị thanh lý không được để trống";
    }
    return msg;
}

 // kiểm tra mô tả thanh lý
 function validateDisposalDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả thanh lý không được để trống";
    }
    return msg;
}