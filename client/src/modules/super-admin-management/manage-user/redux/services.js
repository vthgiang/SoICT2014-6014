import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const UserServices = {
    get,
    getPaginate,
    edit,
    create,
    destroy,
    getRoles,
    getLinkOfRole,
    getAllUserOfCompany,
    getAllUserOfDepartment,
    getAllUserSameDepartment,
    getRoleSameDepartmentOfUser
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/paginate`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function edit(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function destroy(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getRoles() {
    const id = localStorage.getItem('id');
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/roles/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getLinkOfRole() {
    const currentRole = localStorage.getItem('currentRole');
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/links/role/${currentRole}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}
// Lấy tất cả các vai trò cùng phòng ban với người dùng
function getRoleSameDepartmentOfUser(currentRole) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/roles/same-department/${currentRole}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Lấy tất cả nhân viên của công ty
function getAllUserOfCompany() {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/user`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Lấy tất cả nhân viên của một phòng ban kèm theo vai trò của họ
function getAllUserOfDepartment(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/user/users-of-department/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Lấy tất cả nhân viên của một phòng ban kèm theo vai trò của họ
function getAllUserSameDepartment(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/user/same-department/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}