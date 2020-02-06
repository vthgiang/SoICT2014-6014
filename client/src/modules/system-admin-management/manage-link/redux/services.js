import axios from 'axios';
import { LOCAL_SERVER_API, AuthenticateHeader } from '../../../../config';

export const LinkServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(link) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'POST',
        data: link,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function edit(id, link) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'PATCH',
        data: link,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}