import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';
import { reactLocalStorage } from 'reactjs-localstorage';

export const DepartmentServices = {
    get,
    create
};

function get() {
    const com = reactLocalStorage.getObject('company');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department/company/${com._id}`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function create(department) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'POST',
        data: department
    };

    return axios(requestOptions);
}