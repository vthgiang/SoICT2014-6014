import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const RoleServices = {
    get,
    show,
    create
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${id}`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function create(role) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'POST',
        data: role
    };

    return axios(requestOptions);
}