import { VALIDATOR } from '../../../../helpers/validator';

export const ComponentDefaultValidator = {
    validateName,
    validateDescription
}

function validateName(url) {
    let msg = undefined;
    if (url.trim() === "") {
        msg = "system_admin.system_component.validator.name.no_space";
    } else if (!VALIDATOR.isValidName(url)) {
        msg = "system_admin.system_component.validator.name.no_special";
    }

    return msg;
}

function validateDescription(url) {
    let msg = undefined;
    if (url.trim() === "") {
        msg = "system_admin.system_component.validator.description.no_space";
    } else if (!VALIDATOR.isValidName(url)) {
        msg = "system_admin.system_component.validator.description.no_special";
    }

    return msg;
}