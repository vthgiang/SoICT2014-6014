import axios from 'axios';
import { LOCAL_SERVER_API, TOKEN_SECRET, AuthenticateHeader, getStorage } from '../../../config';
import jwt from 'jsonwebtoken';
import getBrowserFingerprint from 'get-browser-fingerprint';

export const AuthService = {
    login,
    editProfile,
    getLinksOfRole,
    refresh,
    logout,
    logoutAllAccount,
    forgotPassword,
    resetPassword
};

function login(user) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/login`,
        method: 'POST',
        data: user,
        headers: {
            'browser-finger': getBrowserFingerprint()
        }
    };

    return axios(requestOptions);
}

function logout() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/logout`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function logoutAllAccount() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/logout-all-account`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function editProfile(data) {
    // const token = localStorage.getItem('token');
    const token = getStorage('auth-token');
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id; 
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getLinksOfRole(idRole) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/privilege/get-links-of-role/${idRole}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

async function refresh() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    
    var id = verified._id; 
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function forgotPassword(email) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/forgot-password`,
        method: 'POST',
        data: {
            email
        }
    };

    return axios(requestOptions);
}

function resetPassword(otp, email, password) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/reset-password`,
        method: 'POST',
        data : {
            otp,
            email,
            password
        }
    };

    return axios(requestOptions);
}