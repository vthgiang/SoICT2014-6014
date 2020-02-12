import axios from 'axios';
import { LOCAL_SERVER_API, AuthenticateHeader } from '../../../../config';

export const RoleServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/paginate`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(role) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'POST',
        data: role,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function edit(role) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${role.id}`,
        method: 'PATCH',
        data: role,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(roleId) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${roleId}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}