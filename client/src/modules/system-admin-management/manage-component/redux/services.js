import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';

export const ComponentServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function show(id) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function create(component) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'POST',
        data: component,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function edit(id, component) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'PATCH',
        data: component,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function destroy(id, component) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'DELETE',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}