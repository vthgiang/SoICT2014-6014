import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const UserServices = {
    get,
    getPaginate,
    edit,
    create,
    destroy
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/paginate`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function edit(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${data.id}`,
        method: 'PATCH',
        data: data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}