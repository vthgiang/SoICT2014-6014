import {handleResponse} from '../../../../../helpers/handleResponse';

import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const createKpiSetService = {
    getEmployeeKpiSet,
    editEmployeeKpiSet,
    updateEmployeeKpiSetStatus,
    deleteEmployeeKpiSet,
    deleteEmployeeKpi,

    createEmployeeKpi,
    editEmployeeKpi,
    createEmployeeKpiSet,
    approveEmployeeKpiSet
};

/** Lấy tập KPI cá nhân hiện tại */ 
async function getEmployeeKpiSet() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/current/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Chỉnh sửa thông tin chung của KPI cá nhân*/ 
async function editEmployeeKpiSet(id, newTarget) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var creater = verified._id;
    newTarget = {...newTarget, creater: creater};

    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/${id}`,
        method: 'PUT',
        data: newTarget,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Chỉnh sửa trạng thái của KPI cá nhân */ 
function updateEmployeeKpiSetStatus(id, status) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/status/${id}/${status}`,
        method: 'PUT',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Xóa KPI cá nhân */
function deleteEmployeeKpiSet(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Xóa mục tiêu KPI cá nhân */ 
function deleteEmployeeKpi(id, kpipersonal) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/target/${kpipersonal}/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Tạo 1 mục tiêu KPI cá nhân mới */  
function createEmployeeKpi(newTarget) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/create-target`,
        method: 'POST',
        data: JSON.stringify(newTarget),
        headers: AuthenticateHeader(),
    };

    return axios(requestOptions);
}


/** Chỉnh sửa mục tiêu KPI cá nhân */ 
function editEmployeeKpi(id, newTarget) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/target/${id}`,
        method: 'PUT',
        data: JSON.stringify(newTarget),
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Khởi tạo KPI cá nhân */  
async function createEmployeeKpiSet(newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    newKPI = {...newKPI, creator: id};

    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/create`,
        method: 'POST',
        data: JSON.stringify(newKPI),
        headers: AuthenticateHeader()
      
    };

    return axios(requestOptions);
}

/** Phê duyệt kpi cá nhân */ 
function approveEmployeeKpiSet(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/approve/${id}`,
        method: 'PUT',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}