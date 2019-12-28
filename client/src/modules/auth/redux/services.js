import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const AuthService = {
    login,
    editProfile,
    getLinksOfRole,
    refresh
};

function login(user) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/login`,
        method: 'POST',
        data: user
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
    const id = localStorage.getItem('id');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}