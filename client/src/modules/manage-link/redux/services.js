import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const LinkServices = {
    get,
    show,
    create
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function create(link) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'POST',
        data: link
    };

    return axios(requestOptions);
}