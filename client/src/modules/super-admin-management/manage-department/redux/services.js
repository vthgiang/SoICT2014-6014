import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';
import { reactLocalStorage } from 'reactjs-localstorage';

export const DepartmentServices = {
    get,
    create,
    destroy
};

function get() {
    const com = reactLocalStorage.getObject('company');
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department/company/${com._id}`,
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function create(department) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'POST',
        data: department,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function destroy(departmentId) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department/${departmentId}`,
        method: 'DELETE',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}