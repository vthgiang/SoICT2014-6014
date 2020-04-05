const nameRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^[^~`!#$%^&*()+=/*';\\<>?:",]*$/;

/**
 * Validate dữ liệu nhập vào từ người dùng trươc khi gửi đến cho server xử lý
 */
export const VALIDATE = {
    testName,
    testEmail,
    testPassword,
    confirmPassword
}

// Kiểm tra tên có hợp lệ
function testName(name) {
    return nameRegex.test(name) ? true : false;
}

// Kiểm tra email có hợp lệ
function testEmail(email) {
    return emailRegex.test(String(email).toLowerCase()) ? true : false;
}

// Kiểm tra password có hợp lệ
function testPassword(password) {
    return passwordRegex.test(String(password).toLowerCase()) ? true : false;
}

// Xác nhận lại khi tạo mật khẩu mới
function confirmPassword(newPassword, confirmPassword) {
    return newPassword === confirmPassword ? true : false;
}