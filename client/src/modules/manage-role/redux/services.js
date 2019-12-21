import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';

export const RoleServices = {
    get,
    show,
    create,
    edit
};

function get() {  
    const company = reactLocalStorage.getObject('company');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/company/${company._id}`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${id}`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function create(role) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'POST',
        data: role
    };

    return axios(requestOptions);
}

function edit(role) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/role/${role.id}`,
        method: 'PATCH',
        data: role
    };

    return axios(requestOptions);
}