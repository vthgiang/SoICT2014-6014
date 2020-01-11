import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';

export const LinkServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function show(id) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function create(link) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'POST',
        data: link,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function edit(id, link) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'PATCH',
        data: link,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function destroy(id, link) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'DELETE',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}