import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const ComponentServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/components-default-management`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/components-default-management/paginate`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/components-default-management`,
        method: 'POST',
        data: component,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function edit(id, component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'PATCH',
        data: component,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(id, component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}