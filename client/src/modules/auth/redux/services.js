import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../env';
import { getStorage } from '../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest, sendRequestPublic } from '../../../helpers/requestHelper';

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
    return sendRequestPublic({
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
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function changeInformation(data) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}/change-information`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

function changePassword(data) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}/change-password`,
        method: 'PATCH',
        data: data,
    }, true, true, 'auth');
}

async function getLinksOfRole(idRole) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/get-links-of-role/${idRole}`,
        method: 'GET',
    }, false, true, 'auth');
}

async function refresh() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}`,
        method: 'GET',
    }, false, true, 'auth');
}

function forgotPassword(email) {
    return sendRequestPublic({
        url: `${ LOCAL_SERVER_API }/auth/forgot-password`,
        method: 'POST',
        data: {
            email
        }
    }, true, true, 'auth');
}

function resetPassword(otp, email, password) {
    return sendRequestPublic({
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