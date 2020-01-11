import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';

export const RoleServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {  
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/paginate`,
        method: 'POST',
        data,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function show(id) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${id}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function create(role) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'POST',
        data: role,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function edit(role) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${role.id}`,
        method: 'PATCH',
        data: role,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function destroy(roleId) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${roleId}`,
        method: 'DELETE',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}