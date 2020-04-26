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
        'page_access_denied',
        'user_role_invalid',
        'acc_logged_out',
        'service_off',
        'fingerprint_invalid',
        'service_permisson_denied',
    ];

    if(error_auth.indexOf(code) !== -1) return true;
    return false;
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
        showAlert && toast.success(
            <ServerResponseAlert
                type='success'
                title={successTitle}
                content={res.data.messages.map(message => `${module}.${message}`)}
            />, 
            {containerId: 'toast-notification'});

        return Promise.resolve(res);
    }).catch(err => {
        console.log("ERROR: ", err.response)
        if(err.response.data.messages){
            if(checkErrorAuth(err.response.data.messages[0])){
                showAuthResponseAlertAndRedirectToLoginPage();
            }
            else{
                toast.error(
                    <ServerResponseAlert
                        type='error'
                        title={errorTitle}
                        content={err.response.data.messages.map(message => `${module}.${message}`)}
                    />, 
                    {containerId: 'toast-notification'}
                );
            }
        }

        return Promise.reject(err);
    })
}
