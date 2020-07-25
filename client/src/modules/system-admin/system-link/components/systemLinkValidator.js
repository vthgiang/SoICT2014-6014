import { VALIDATOR } from '../../../../helpers/validator';

export const LinkDefaultValidator = {
    validateUrl,
    validateDescription
}

function validateUrl(url) {
    let msg = undefined;
    if (url.trim() === "") {
        msg = "system_admin.system_link.validator.url.no_blank";
    } else if (!VALIDATOR.isValidUrl(url)) {
        msg = "system_admin.system_link.validator.url.start_with_slash";
    }

    return msg;
}

function validateDescription(url) {
    let msg = undefined;
    if (url.trim() === "") {
        msg = "system_admin.system_link.validatdor.description.no_blank";
    } else if (!VALIDATOR.isValidName(url)) {
        msg = "system_admin.system_link.validator.description.no_special";
    }
    
    return msg;
}