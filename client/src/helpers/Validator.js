const nameRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^[^~`!#$%^&*()+=/*';\\<>?:",]*$/;
const employeeNumberRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;

/**
 * Validate dữ liệu nhập vào từ người dùng trươc khi gửi đến cho server xử lý
 */
export const VALIDATOR = {
    isValidName: isValidName,
    isValidEmail: isValidEmail,
    isValidPassword: isValidPassword,
    isValidEmployeeNumber: isValidEmployeeNumber,
}

// Kiểm tra tên có hợp lệ
function isValidName(name) {
    return nameRegex.test(name) ? true : false;
}

// Kiểm tra email có hợp lệ
function isValidEmail(email) {
    return emailRegex.test(String(email).toLowerCase()) ? true : false;
}

// Kiểm tra password có hợp lệ
function isValidPassword(password) {
    return passwordRegex.test(String(password).toLowerCase()) ? true : false;
}

// Kiểm tra mã số nhân viên có hợp lệ
function isValidEmployeeNumber(employeeNumber) {
    return employeeNumberRegex.test(employeeNumber) ? true : false;
}