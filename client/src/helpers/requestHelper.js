import axios from 'axios';
import { getStorage, clearStorage } from '../config';
import ServerResponseAlert from '../modules/alert/components/serverResponseAlert';
import { toast } from 'react-toastify';
import React from 'react';
import getBrowserFingerprint from 'get-browser-fingerprint';

import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';
let notification = null;
Notification.newInstance({ style: {'top': 65, right: '3%',} }, (n) => notification = n);

const AuthenticateHeader = (name = 'jwt',) => {
    const token = getStorage(name);
    const currentRole = getStorage("currentRole");
    const fingerprint = getBrowserFingerprint();

    return {
        'current-page': window.location.pathname,
        'auth-token': token,
        'current-role': currentRole,
        'fingerprint': fingerprint,
        'Content-Type': 'application/json'
    }
}

/**
 * Check có xảy ra lỗi liên quan đến xác thực người dùng hay không?
 * @error_auth mảng các mã lỗi
 */
const checkErrorAuth = (code) => {

    const error_auth = [
        'access_denied',
        'page_access_denied',
        'role_invalid',
        'user_role_invalid',
        'service_off',
        'fingerprint_invalid',
        'service_permisson_denied',
    ];

    if (error_auth.indexOf(code) !== -1) return true;
    return false;
}

const showAuthResponseAlertAndRedirectToLoginPage = async () => {
    await window.$(`#alert-error-auth`).modal({ backdrop: 'static', keyboard: false, display: 'show' });
}

/**
 * Hàm gọi request đến server
 * @param {*} data Cấu trúc của data bao gồm (url method, data)
 * @url : url của api gọi đến
 * @method : phương thức gọi
 * @data : data truyền đi - có thể có hoặc không
 */
export function sendRequest(options, showSuccessAlert = false, showFailAlert = true, module, successTitle = 'general.success', errorTitle = 'general.error') {

    const requestOptions = {
        url: options.url,
        method: options.method,
        data: options.data,
        params: options.params,
        responseType: options.responseType,
        headers: AuthenticateHeader()
    };


    return axios(requestOptions).then(res => {
        const messages = Array.isArray(res.data.messages) ? res.data.messages : [res.data.messages];

        showSuccessAlert && notification.notice({
            content: <ServerResponseAlert
                        type='success'
                        title={successTitle}
                        content={messages.map(message => `${module}.${message}`)}
                    />,
            duration: 5,
            closable: true,
            style: { color: 'red' },
            onClose() {
              console.log('simple close');
            },
          });
        return Promise.resolve(res);
    }).catch(err => {
        const messages = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages];

        console.log("error: ", err)
        if (messages) {
            if (checkErrorAuth(messages[0]))
                showAuthResponseAlertAndRedirectToLoginPage();
            else if (messages[0] === 'acc_log_out') {
                clearStorage();
            }
            else {
                showFailAlert && toast.error(
                    <ServerResponseAlert
                        type='error'
                        title={errorTitle}
                        content={messages.map(message => `${module}.${message}`)}
                    />,
                    { containerId: 'toast-notification' }
                );
            }
        }

        return Promise.reject(err);
    })
}