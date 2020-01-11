import axios from 'axios';
import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../config';
import jwt from 'jsonwebtoken';

export const AuthService = {
    login,
    editProfile,
    getLinksOfRole,
    refresh,
    logout,
    logoutAllAccount
};

function login(user) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/login`,
        method: 'POST',
        data: user
    };

    return axios(requestOptions);
}

function logout() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/logout`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function logoutAllAccount() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/logout-all-account`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function editProfile(data) {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function getLinksOfRole(idRole) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/privilege/get-links-of-role/${idRole}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function refresh() {
    const token = localStorage.getItem('token');
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id; 
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}