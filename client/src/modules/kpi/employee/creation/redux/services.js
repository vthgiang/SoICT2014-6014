import {handleResponse} from '../../../../helpers/handleResponse';

import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const createKpiService = {
    getCurrentKPIPersonal,
    editKPIPersonal,
    editStatusKPIPersonal,
    deleteKPIPersonal,
    deleteTarget,

    addNewTargetPersonal,
    editTargetKPIPersonal,
    createKPIPersonal,
    approveKPIPersonal
};

// Lấy KPI cá nhân hiện tại
async function getCurrentKPIPersonal() {
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

// chỉnh sửa kpi cá nhân
async function editKPIPersonal(id, newTarget) {
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

// chỉnh sửa trạng thái của kpi cá nhân
function editStatusKPIPersonal(id, status) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/status/${id}/${status}`,
        method: 'PUT',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Xóa KPI cá nhân
function deleteKPIPersonal(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Xóa mục tiêu kpi cá nhân
function deleteTarget(id, kpipersonal) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/target/${kpipersonal}/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// thêm mục tiêu KPI cá nhân 
function addNewTargetPersonal(newTarget) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/create-target`,
        method: 'POST',
        data: JSON.stringify(newTarget),
        headers: AuthenticateHeader(),
    };

    return axios(requestOptions);
}


// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIPersonal(id, newTarget) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/target/${id}`,
        method: 'PUT',
        data: JSON.stringify(newTarget),
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// khởi tạo kpi cá nhân 
async function createKPIPersonal(newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    console.log(id);
    newKPI = {...newKPI, creater: id};

    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/create`,
        method: 'POST',
        data: JSON.stringify(newKPI),
        headers: AuthenticateHeader()
      
    };

    return axios(requestOptions);
}

// Phê duyệt kpi cá nhân
function approveKPIPersonal(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/approve/${id}`,
        method: 'PUT',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}