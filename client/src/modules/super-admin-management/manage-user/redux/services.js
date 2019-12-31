import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';

export const UserServices = {
    get,
    edit,
    create,
    destroy
};

function get() {
    const company = reactLocalStorage.getObject('company');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/company/${company._id}`,
        method: 'GET',
        data: { company: company._id }
    };

    return axios(requestOptions);
}

function edit(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${data.id}`,
        method: 'PATCH',
        data: data
    };

    return axios(requestOptions);
}

function create(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'POST',
        data: data
    };

    return axios(requestOptions);
}

function destroy(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'DELETE'
    };

    return axios(requestOptions);
}