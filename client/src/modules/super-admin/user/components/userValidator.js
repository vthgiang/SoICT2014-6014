import {REGEX} from '../../../../helpers/validator';

export const USER_VALIDATOR = {
    checkName,
    checkEmail,
}

function checkName(value, min=6, max=255) {
    if(!value)
        return {
            status: false,
            msg: 'general.validate.invalid_error',
        }
    else if (value.length < min)
        return {
            status: false,
            msg: 'general.validate.minimum_length_error'
        }
    else if (value.length > max)
        return {
            status: false,
            msg: 'general.validate.maximum_length_error'
        }
    else 
        return {
            status: true
        }
}

function checkEmail(value) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!value || !REGEX.EMAIL.test(value))
        return {
            status: false,
            msg: 'general.validate.invalid_error'
        }
    else 
        return {
            status: true
        }
}