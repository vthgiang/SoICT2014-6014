import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../config';

export const DepartmentServices = {
    get,
    create,
    destroy
};

function get() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department`,
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