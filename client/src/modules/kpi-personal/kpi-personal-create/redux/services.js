import {handleResponse} from '../../../../helpers/HandleResponse';
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
function getCurrentKPIPersonal(id) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`/kpipersonals/current/${id}`, requestOptions).then(handleResponse);
}

// chỉnh sửa kpi cá nhân
function editKPIPersonal(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`/kpipersonals/${id}`, requestOptions).then(handleResponse);
}
// chỉnh sửa trạng thái của kpi cá nhân
function editStatusKPIPersonal(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`/kpipersonals/status/${id}`, requestOptions).then(handleResponse);
}
// Xóa KPI cá nhân
function deleteKPIPersonal(id) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/kpipersonals/${id}`, requestOptions).then(handleResponse);
}

// Xóa mục tiêu kpi cá nhân
function deleteTarget(id, kpipersonal) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/kpipersonals/target/${kpipersonal}/${id}`, requestOptions).then(handleResponse);
}

// thêm mục tiêu KPI cá nhân 
function addNewTargetPersonal(newTarget) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`/kpipersonals/create-target`, requestOptions).then(handleResponse);
}


// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIPersonal(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`/kpipersonals/target/${id}`, requestOptions).then(handleResponse);
}

// khởi tạo kpi cá nhân 
function createKPIPersonal(newKPI) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKPI)
    };

    return fetch(`/kpipersonals/create`, requestOptions).then(handleResponse);
}

// Phê duyệt kpi cá nhân
function approveKPIPersonal(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`/kpipersonals/approve/${id}`, requestOptions).then(handleResponse);
}