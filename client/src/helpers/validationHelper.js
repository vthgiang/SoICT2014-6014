export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,
    SPECIAL_CHARACTER: /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/ ,
}

export default class ValidationHelper {
    constructor(){ 
        
    }

    /**
     * Các phương thức validate cấp 1
     */
    static validateEmpty = (value) => {
        if(!value)
            return false;
        return true;
    }

    static validateInvalidCharacter = (value) => {
        if(!REGEX.SPECIAL_CHARACTER.test(value))
            return false;
        return true;
    }

    static validateLength = (value, min=4, max=1024) => {
        if(value.length < min || value.length > max )
            return false;
        return true;
    }

    static validateMinimumLength = (value, min=4) => {
        if(value.length < min)
            return false;
        return true;
    }
    
    static validateMaximumLength = (value, max=1024) => {
        if(value.length > max)
            return false;
        return true;
    }

    /**
     * Các phương thức validate cấp 2
     */
    static validateName = (name, min=4, max=255) => {
        let msg;
        if(!this.validateEmpty(name))
            msg = 'general.validate.empty_error';
        else if(!this.validateLength(name, min, max))
            msg = 'general.validate.length_error';
        else if(!this.validateInvalidCharacter(name))
            msg = 'general.validate.invalid_character_error';
        
        return msg ? { status: false, msg } : { status: true };
    }

    static validateDescription = (description) => {
        let msg;
        if(!this.validateEmpty(description))
            msg = 'general.validate.empty_error';
        
        return msg ? { status: false, msg } : { status: true };
    }

    static validateEmail = (email) => {
        let msg;
        if(!this.validateEmpty(email))
            msg = 'general.validate.empty_error';
        else if(!REGEX.EMAIL.test(email))
            msg = 'general.validate.invalid_error';

        return msg ? { status: false, msg } : { status: true };
    }

    static validatePassword = (password, min=6, max=30) => {
        let msg;
        if(!this.validateEmpty(password))
            msg = 'general.validate.empty_error';
        else if(!this.validateLength(password, min, max))
            msg = 'general.validate.length_error';

        return msg ? { status: false, msg } : { status: true };
    }
}