import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';

export const UserServices = {
    get,
    edit,
    create,
    destroy,
    searchByName
};

function get() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function edit(data) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${data.id}`,
        method: 'PATCH',
        data: data,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function create(data) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'POST',
        data: data,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function destroy(id) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'DELETE',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function searchByName(username) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/search-by-name`,
        method: 'POST',
        data: {username},
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}