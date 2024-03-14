const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,
    SPECIAL_CHARACTER: /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/ ,
}

/**
 * Kiểm tra email hợp lệ
 * @param {*} email email
 */
 exports.validateEmailValid = (email) => {
     if (!REGEX.EMAIL.test(email)) {
         return false;
     } else {
         return true;
     }
}
