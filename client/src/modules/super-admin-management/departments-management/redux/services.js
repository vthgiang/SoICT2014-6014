import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

import {handleResponse} from '../../../../helpers/HandleResponse';

export const DepartmentServices = {
    get,
    create,
    edit,
    destroy,
    getAll,
    getDepartmentOfUser
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

function edit(department) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department/${department._id}`,
        method: 'PATCH',
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

function getAll() {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`${ LOCAL_SERVER_API }/departments`, requestOptions).then(handleResponse);
}
async function getDepartmentOfUser() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    console.log(id);
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${ LOCAL_SERVER_API }/department/department-of-user/${id}`, requestOptions).then(handleResponse);
}

