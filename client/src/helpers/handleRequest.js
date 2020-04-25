import axios from 'axios';
import { AuthenticateHeader } from '../config';
import AlertDisplayResponseFromServer from '../modules/alert/components/alertDisplayResponseFromServer';
import Alert from '../modules/alert/components';
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
export function handleRequest(options, displayAlert=true) {

    const requestOptions = {
        url: options.url, 
        method: options.method,
        data: options.data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions).then(res => {
        displayAlert && toast.success(
            <AlertDisplayResponseFromServer
                type='success'
                title='success.title'
                content={res.data.message}
            />, 
            {containerId: 'toast-notification'});

        return Promise.resolve(res);
    }).catch(err => {
        console.log("ERROR: ", err.response.data);
        if(err.response.data.message){
            if(checkErrorAuth(err.response.data.message[0])){
                window.$(`#alert-error-auth`).modal("show");
                localStorage.clear();
            }
            else{
                displayAlert && toast.error(
                    <AlertDisplayResponseFromServer
                        type='error'
                        title='error.title'
                        content={err.response.data.message}
                    />, 
                    {containerId: 'toast-notification'});
            }
        }

        return Promise.reject(err);
    })
}
