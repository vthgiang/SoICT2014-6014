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
    console.log("CODE : ", code)
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

/**
 * Hàm gọi request đến server
 * @param {*} data Cấu trúc của data bao gồm (url method, data)
 * @url : url của api gọi đến
 * @method : phương thức gọi
 * @data : data truyền đi - có thể có hoặc không
 */
export function sendRequest(options, showAlert=true, module, successTitle='success.title', errorTitle='error.title') {

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
                content={res.data.message}
            />, 
            {containerId: 'toast-notification'});

        return Promise.resolve(res);
    }).catch(err => {
        if(err.response.data.message){
            if(checkErrorAuth(err.response.data.message[0])){
                window.$(`#alert-error-auth`).modal("show");
                localStorage.clear();
            }
            else{
                toast.error(
                    <ServerResponseAlert
                        type='error'
                        title={errorTitle}
                        content={err.response.data.message}
                    />, 
                    {containerId: 'toast-notification'}
                );
            }
        }

        return Promise.reject(err);
    })
}
