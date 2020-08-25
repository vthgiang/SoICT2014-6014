const nameRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^[^~`!#$%^&*()+=/*';\\<>?:",]*$/;
const employeeNumberRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;
const urlRegex = /^[^~`!@#$%^&*()+= *';\\<>?:",]*$/;
const stringNotSpaceRegex = /^[^~`!@#$%^&*()+=/ *';\\<>?:",]*$/;

/**
 * Validate dữ liệu nhập vào từ người dùng trươc khi gửi đến cho server xử lý
 */
export const VALIDATOR = {
    isValidName,
    isValidEmail,
    isValidPassword,
    isValidEmployeeNumber,
    isValidUrl,
    isStringNotSpace,

    checkName,
    checkEmail,
    checkPassword,
    checkDescription,
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

// Kiem tra url co hop le
function isValidUrl(url) {
    return (url[0] === '/' && urlRegex.test(url)) ? true : false;
}

function isStringNotSpace(string){
    return stringNotSpaceRegex.test(string) ? true : false;
}

function checkName(name) {
    let dataName = name.toString();
    let mes;
    if(!nameRegex.test(dataName)) {
        mes = 'general.validate.nameTypeErr';
    } else if(dataName.length < 6 || dataName.length > 255) {
        mes = 'general.validate.nameLengthErr'
    }
    return mes;
}

function checkEmail(email) {
    let dataEmail = email.toString();
    let mes;
    if(!emailRegex.test(dataEmail)) {
        mes = 'general.validate.emailErr';
    } 
    return mes;
}

function checkPassword(pass) {
    let dataPass = pass.toString();
    let mes;
    if(dataPass.length < 6 || dataPass.length > 30) {
        mes = 'general.validate.passwordLengthErr'
    }
    return mes;
}

function checkDescription(des) {
    let desData = des.toString();
    let mes;
    if(desData.length < 1) {
        mes = 'general.validate.descriptionLengthErr'
    }
    return mes;
}