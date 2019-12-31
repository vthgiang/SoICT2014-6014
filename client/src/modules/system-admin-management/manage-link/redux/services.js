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
    const company = reactLocalStorage.getObject('company');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/company/${ company._id }`,
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

function edit(id, link) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'PATCH',
        data: link
    };

    return axios(requestOptions);
}

function destroy(id, link) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'DELETE'
    };

    return axios(requestOptions);
}