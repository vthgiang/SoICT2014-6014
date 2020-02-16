import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const DepartmentServices = {
    get,
    create,
    destroy
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(department) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'POST',
        data: department,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(departmentId) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department/${departmentId}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}