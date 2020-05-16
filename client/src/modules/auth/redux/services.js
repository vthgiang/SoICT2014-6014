import { LOCAL_SERVER_API } from '../../../env';
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
    changePassword
};

async function login(user) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/login`,
        method: 'POST',
        data: user
    }, false, true, 'auth')
}

function logout() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/logout`,
        method: 'GET',
    }, false, true, 'auth');
}

function logoutAllAccount() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/logout-all-account`,
        method: 'GET',
    }, false, true, 'auth');
}

function editProfile(data) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function changeInformation(data) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}/change-information`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function changePassword(data) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}/change-password`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function getLinksOfRole(idRole) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/get-links-that-role-can-access/${idRole}`,
        method: 'GET',
    }, false, true, 'auth');
}

function refresh() {
    var id = getStorage("userId");
    
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/get-profile/${id}`,
        method: 'GET',
    }, false, true, 'auth');
}

function forgotPassword(email) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/forget-password`,
        method: 'POST',
        data: {
            email
        }
    }, true, true, 'auth');
}

function resetPassword(otp, email, password) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/reset-password`,
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
        url: `${ LOCAL_SERVER_API }/component/role/${currentRole}/link/${linkId}`,
        method: 'GET',
    }, false, true, 'auth');
}