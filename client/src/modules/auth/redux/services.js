import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const AuthService = {
    login,
    editProfile,
    getLinksOfRole
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
    const id = localStorage.getItem('id');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data
    };

    return axios(requestOptions);
}

function getLinksOfRole(idRole) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/privilege/get-links-of-role/${idRole}`,
        method: 'GET'
    };

    return axios(requestOptions);
}