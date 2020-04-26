import { VALIDATOR } from '../../../../helpers/validator';

export const CompanyFormValidator = {
    validateName,
    validateShortName,
    validateEmailSuperAdmin,
    validateDescription,
    validateUrl
}

function validateName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "system_admin.company.validator.name.no_blank";
    } else if(value.length < 4){
        msg = "system_admin.company.validator.name.no_less4";
    } else if(value.length > 255){
        msg = "system_admin.company.validator.name.no_more255";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "system_admin.company.validator.name.no_special";
    }
    return msg;
}

function validateShortName(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "system_admin.company.validator.short_name.no_blank";
    } else if(value.length < 3){
        msg = "system_admin.company.validator.short_name.no_less3";
    } else if(value.length > 255){
        msg = "system_admin.company.validator.short_name.no_more255";
    } else if (!VALIDATOR.isStringNotSpace(value)){
        msg = "system_admin.company.validator.short_name.no_space";
    }
    return msg;
}

function validateDescription(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "system_admin.company.validator.description.no_blank";
    } else if(value.length < 3){
        msg = "system_admin.company.validator.description.no_less4";
    } else if(value.length > 255){
        msg = "system_admin.company.validator.description.no_more255";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "system_admin.company.validator.description.no_special";
    }
    return msg;
}

function validateEmailSuperAdmin(value){
    let msg = undefined;
    if (value.trim() === ""){
        msg = "system_admin.company.validator.super_admin.no_blank";
    } else if(!VALIDATOR.isValidEmail(value))
        msg = "system_admin.company.validator.super_admin.email_invalid";
    return msg;
}

function validateUrl(url) {
    let msg = undefined;
    if (url.trim() === ""){
        msg = "Url không được để trống";
    } else if(!VALIDATOR.isValidUrl(url)){
        msg = "Url không hợp lệ. Url phải bắt đầu bằng kí tự /";
    }
    return msg;
}