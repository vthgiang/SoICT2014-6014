export const formatFunction = {
    formatDate,
    formatDateTime,
    formatCustomerType,
    formatCustomerGender,
    formatCustomerLocation
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
 * Hàm format giới tính
 * @param {*} value 
 * @param {*} translate 
 */
function formatCustomerGender(value,translate) {
    value = parseInt(value);
    if (value === 1) return translate('crm.customer.male');
    if (value === 2) return translate('crm.customer.female');
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

