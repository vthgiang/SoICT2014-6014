export const formatFunction = {
    formatDate,
    formatDateTime,
    convertExcelDateToJSDate,
    formatCustomerType,
    formatCustomerGender,
    formatCustomerLocation,
    formatCustomerGenderImportForm,
    formatCustomerTypeImportForm,
    formatCustomerLocationImportForm,
    getIdGroupInArray,
    getIdStatusInArray,
    formatCarePriority,
    formatCareStatus

}

function formatDate(date, monthYear = false) {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    } else {
        return date
    }
}

function formatDateTime(date) {
    const d = new Date(date);
    const localeTime = d.toLocaleTimeString();

    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${localeTime} ${day}-${month}-${year}`;
}


/**
 * Function chuyển dữ liệu date trong excel thành dạng dd-mm-yyyy
 * @param {*} serial :số serial của ngày
 */
function convertExcelDateToJSDate(serial){
    let utc_days = Math.floor(serial - 25569);
    let utc_value = utc_days * 86400;
    let date_info = new Date(utc_value * 1000);
    let month = date_info.getMonth() + 1;
    let day = date_info.getDate();
    if (month.toString().length < 2)
        month = '0' + month;
    if (day.toString().length < 2)
        day = '0' + day;
    return [day, month, date_info.getFullYear()].join('-');
}

/**
 * Hàm format loại khách hàng
 * @param {*} value 
 * @param {*} translate 
 */
function formatCustomerType(value,translate) {
    value = parseInt(value);
    if (value === 1) return translate('crm.customer.personal');
    if (value === 2) return `${translate('crm.customer.company')}/${translate('crm.customer.organization')}`;
}

/**
 * Hàm format giới tính từ số thành chữ
 * 1 -> Name; 2 -> Nữ
 * @param {*} value 
 * @param {*} translate 
 */
function formatCustomerGender(value, translate) {
    value = parseInt(value);
    if (value === 1) return translate('crm.customer.male');
    if (value === 2) return translate('crm.customer.female');
}

function formatCustomerGenderImportForm(value) {
    if (typeof value === "string") {
        if (value === "Nam" || value === "nam") {
            return 1;
        } else if (value === "Nữ" || value === "nữ") {
            return 2;
        }else return -1;
    } 
}


function formatCustomerTypeImportForm(value) {
    if (typeof value === "string") {
        if (value === "Cá nhân" || value === "cá nhân") {
            return 1
        } else if (value === "Công ty" || value === "công ty" || value === "Tổ chức" || value === "tổ chức") {
            return 2
        } else return -1;
    }
}


function formatCustomerLocationImportForm(value) {
    if (typeof value === "string") {
        if (value === "Miền bắc" || value === "miền bắc" || value === "Miền Bắc") {
            return 1;
        } else if (value === "Miền trung" || value === "miền trung" || value === "Miền Trung") {
            return 2;
        } else if (value === "Miền nam" || value === "miền nam" || value === "Miền Nam") {
            return 3;
        } else return -1;
    }
}



function getIdGroupInArray(arr, item) {
    let result;
    if (arr && item) {
        result = arr.filter(el => el.text === item);
        if (result && result.length > 0) {
            return result[0].value;
        } else {
            return -1;
        }
    }
}


function getIdStatusInArray(arr, item) {
    let indexOfArr = -1, status = [];
    if (arr && item) {
        // Kiểm tra xem trạng thái của khách hàng trong file import có trong danh sách trạng thái hay không
        arr.forEach((st, index) => {
            if (st.text === item)
                indexOfArr = index;
        })
        // Nếu indexOfArr khác -1 thì trạng thái trong file import có trong danh sách trạng thái
        if (indexOfArr != -1) {
            arr.forEach((element, index) => {
                if (index <= indexOfArr) {
                    status.push(element.value);
                }
            })
            return status;
        } else {
            return -1;
        }
    }
}


/**
 * Hàm format vùng miền
 * @param {*} value 
 * @param {*} translate 
 */
function formatCustomerLocation(value,translate) {
    value = parseInt(value);
    if (value === 1) return translate('crm.customer.northern');
    if (value === 2) return translate('crm.customer.central');
    if (value === 3) return translate('crm.customer.southern');
}

function formatCarePriority(value){
    value = parseInt(value);
    if (value === 1) return 'Ưu tiên thấp';
    if (value === 2) return 'Ưu tiên tiêu chuẩn';
    if (value === 3) return 'Ưu tiên cao';
}

function formatCareStatus(value){
    value = parseInt(value);
    if (value === 1) return 'Chưa thực hiện';
    if (value === 2) return 'Đang thực hiện';
    if (value === 3) return 'Đã hoàn thành';
    if (value === 4) return 'Đã quá hạn';
    if (value === 5) return 'Hoàn thành quá hạn';
}