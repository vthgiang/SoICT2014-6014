import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';

export const ComponentServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get() {
    const company = reactLocalStorage.getObject('company');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/company/${ company._id }`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function show(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function create(component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'POST',
        data: component
    };

    return axios(requestOptions);
}

function edit(id, component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'PATCH',
        data: component
    };

    return axios(requestOptions);
}

function destroy(id, component) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'DELETE'
    };

    return axios(requestOptions);
}