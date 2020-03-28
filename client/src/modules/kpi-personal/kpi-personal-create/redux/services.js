import {handleResponse} from '../../../../helpers/HandleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
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
        method: 'GET',
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/current/${id}`, requestOptions).then(handleResponse);
}

// chỉnh sửa kpi cá nhân
async function editKPIPersonal(id, newTarget) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var creater = verified._id;
    newTarget = {...newTarget, creater: creater};
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/${id}`, requestOptions).then(handleResponse);
}
// chỉnh sửa trạng thái của kpi cá nhân
function editStatusKPIPersonal(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/status/${id}`, requestOptions).then(handleResponse);
}
// Xóa KPI cá nhân
function deleteKPIPersonal(id) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/${id}`, requestOptions).then(handleResponse);
}

// Xóa mục tiêu kpi cá nhân
function deleteTarget(id, kpipersonal) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/target/${kpipersonal}/${id}`, requestOptions).then(handleResponse);
}

// thêm mục tiêu KPI cá nhân 
function addNewTargetPersonal(newTarget) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/create-target`, requestOptions).then(handleResponse);
}


// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIPersonal(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/target/${id}`, requestOptions).then(handleResponse);
}

// khởi tạo kpi cá nhân 
async function createKPIPersonal(newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    console.log(id);
    newKPI = {...newKPI, creater: id};
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKPI)
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/create`, requestOptions).then(handleResponse);
}

// Phê duyệt kpi cá nhân
function approveKPIPersonal(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/approve/${id}`, requestOptions).then(handleResponse);
}