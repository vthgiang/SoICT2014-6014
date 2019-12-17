import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';
const company = reactLocalStorage.getObject('company');

export const LinkServices = {
    get,
    show,
    create,
    getLinksOfRole
};

function get() {
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

function getLinksOfRole(idRole) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/privilege/get-links-of-role/${idRole}`,
        method: 'GET'
    };

    return axios(requestOptions);
}