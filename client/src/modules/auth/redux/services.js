import axios from 'axios';
import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../env';
import { AuthenticateHeader, FingerPrint, getStorage } from '../../../config';
import jwt from 'jsonwebtoken';
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
    const finger = await FingerPrint();
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/login`,
        method: 'POST',
        data: user,
        headers: FingerPrint()
    };

    return axios(requestOptions);
}

function logout() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/logout`,
        method: 'GET',
    }, false, 'auth');
}

function logoutAllAccount() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/logout-all-account`,
        method: 'GET',
    }, false, 'auth');
}

function editProfile(data) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
    }, true, 'auth');
}

function changeInformation(data) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}/change-information`,
        method: 'PATCH',
        data: data,
    }, true, 'auth');
}

function changePassword(data) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}/change-password`,
        method: 'PATCH',
        data: data,
    }, true, 'auth');
}

async function getLinksOfRole(idRole) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/get-links-of-role/${idRole}`,
        method: 'GET',
    }, false, 'auth');
}

async function refresh() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/profile/${id}`,
        method: 'GET',
    }, false, 'auth');
}

function forgotPassword(email) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/auth/forgot-password`,
        method: 'POST',
        data: {
            email
        }
    }, false, 'auth');
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
    }, false, 'auth');
}

function getComponentOfUserInLink(currentRole, linkId) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/role/${currentRole}/link/${linkId}`,
        method: 'GET',
    }, false, 'auth');
}