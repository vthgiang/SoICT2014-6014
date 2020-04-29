import axios from 'axios';
import { AuthenticateHeader } from '../config';
import ServerResponseAlert from '../modules/alert/components/serverResponseAlert';
import AuthAlert from '../modules/alert/components/authAlert';
import { toast } from 'react-toastify';
import React from 'react';

/**
 * Check có xảy ra lỗi liên quan đến xác thực người dùng hay không?
 * @error_auth mảng các mã lỗi
 */
const checkErrorAuth = (code) => {
    
    const error_auth = [
        'access_denied',
        'role_invalid',
        'user_role_invalid',
        'acc_logged_out',
        'service_off',
        'fingerprint_invalid',
        'service_permisson_denied',
    ];

    if(error_auth.indexOf(code) !== -1) return true;
    return false;
}

const checkPageAccess = (code) => {
    if(code === 'page_access_denied') return true;
    return false;
}

const showAuthResponseAlertAndRedirectToHomePage = async () => {
    console.log("DFSDFSDFSDFSDFSDFDSF");
    await window.$(`#alert-error-auth-page-acccess-denied`).modal({backdrop: 'static', keyboard: false, display: 'show'});
}

const showAuthResponseAlertAndRedirectToLoginPage = async () => {
    await window.$(`#alert-error-auth`).modal("show");
    await localStorage.clear();
}

/**
 * Hàm gọi request đến server
 * @param {*} data Cấu trúc của data bao gồm (url method, data)
 * @url : url của api gọi đến
 * @method : phương thức gọi
 * @data : data truyền đi - có thể có hoặc không
 */
export function sendRequest(options, showAlert=false, module, successTitle='general.success', errorTitle='general.error') {

    const requestOptions = {
        url: options.url, 
        method: options.method,
        data: options.data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions).then(res => {
        const messages = Array.isArray(res.data.messages) ? res.data.messages : [res.data.messages];

        showAlert && toast.success(
            <ServerResponseAlert
                type='success'
                title={successTitle}
                content={messages.map(message => `${module}.${message}`)}
            />, 
            {containerId: 'toast-notification'});

        return Promise.resolve(res);
    }).catch(err => {
        const messages = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages];

        if(messages){
            if(checkErrorAuth(messages[0]))
                showAuthResponseAlertAndRedirectToLoginPage();
            else if(checkPageAccess(messages[0]))
                showAuthResponseAlertAndRedirectToHomePage();
            else{
                toast.error(
                    <ServerResponseAlert
                        type='error'
                        title={errorTitle}
                        content={messages.map(message => `${module}.${message}`)}
                    />, 
                    {containerId: 'toast-notification'}
                );
            }
        }

        return Promise.reject(err);
    })
}
