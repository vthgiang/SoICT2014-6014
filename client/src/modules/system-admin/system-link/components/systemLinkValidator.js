import { REGEX } from '../../../../helpers/validator';

export const SYSTEM_LINK_VALIDATOR = {
    checkUrl,
    checkDescription
}

function checkUrl(value) {
    if(!value || !REGEX.URL.test(value) || value[0] !== '/')
        return {
            status: false,
            msg: 'general.validate.invalid_error',
        }
    else 
        return {
            status: true
        }
}

function checkDescription(value, min=6, max=255) {
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