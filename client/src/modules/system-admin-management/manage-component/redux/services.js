import axios from 'axios';
import { LOCAL_SERVER_API, AuthenticateHeader } from '../../../../config';

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
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/paginate`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'POST',
        data: component,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function edit(id, component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'PATCH',
        data: component,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(id, component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}