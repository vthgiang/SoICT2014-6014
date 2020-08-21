import { getStorage } from '../../../config';
import { sendRequest } from '../../../helpers/requestHelper';

export const AuthService = {
    login,
    editProfile,
    getLinksOfRole,
    refresh,
    logout,
    logoutAllAccount,
    forgotPassword,
    resetPassword,
    getComponentOfUserInLink,
    changeInformation,
    changePassword,
    downloadFile
};

async function login(user) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/login`,
        method: 'POST',
        data: user
    }, false, false, 'auth')
}

function logout() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/logout`,
        method: 'GET',
    }, false, true, 'auth');
}

function logoutAllAccount() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/logout-all-account`,
        method: 'GET',
    }, false, true, 'auth');
}

function editProfile(data) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function changeInformation(data) {
    var id = getStorage("userId");
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/profile/${id}/change-information`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function changePassword(data) {
    var id = getStorage("userId");
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/profile/${id}/change-password`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function getLinksOfRole(idRole) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/get-links-that-role-can-access/${idRole}`,
        method: 'GET',
    }, false, true, 'auth');
}

function refresh() {
    var id = getStorage("userId");
    
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/get-profile/${id}`,
        method: 'GET',
    }, false, true, 'auth');
}

function forgotPassword(email) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/forget-password`,
        method: 'POST',
        data: {
            email
        }
    }, true, true, 'auth');
}

function resetPassword(otp, email, password) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/auth/reset-password`,
        method: 'POST',
        data: {
            otp,
            email,
            password
        }
    }, true, true, 'auth');
}

function getComponentOfUserInLink(currentRole, linkId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/component/components`,
        method: 'GET',
        params: {
            currentRole: currentRole,
            linkId: linkId,
        }
    }, false, true, 'auth');
}

/**
 * Download file
 * @param {*} path: đường dẫn file cần tải
 */
function downloadFile(path) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/auth/download-file/`,
        method: 'GET',
        responseType: 'blob',
        params: { path: path }
    }, false, false, 'auth');
}