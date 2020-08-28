import ValidationHelper from "../../../../helpers/validationHelper"

export default class SystemLinkValidator extends ValidationHelper {
    constructor(){

    }

    static validateUrl = (url) => {
        let URL_REGEX = /^[^~`!@#$%^&*()+= *';\\<>?:",]*$/;
        let msg;
        if(!this.validateEmpty(url))
            msg = 'general.validate.empty_error';
        else if(url[0] !== '/' || !URL_REGEX.test(url))
            msg = 'general.validate.invalid_error';
        
        return msg ? { status: false, msg } : { status: true };
    }
}