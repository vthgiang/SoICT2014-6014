import {handleResponse} from '../../../../helpers/HandleResponse';

import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

export const createUnitKpiServices = {
    getCurrentKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    deleteTargetKPIUnit,
    editStatusKPIUnit,
    getKPIParent,
    addTargetKPIUnit,
    editTargetKPIUnit,
    addKPIUnit
}

// Lấy KPI đơn vị hiện tại
function getCurrentKPIUnit(id) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`/kpiunits/current-unit/role/${id}`, requestOptions).then(handleResponse);
}

// Lấy KPI đơn vị cha
function getKPIParent(parentUnit) {
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`/kpiunits/parent/${parentUnit}`, requestOptions).then(handleResponse);
}

// Khởi tạo KPI đơn vị 
async function addKPIUnit(newKPI) {
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

    return fetch(`/kpiunits/create`, requestOptions).then(handleResponse);
}

// Thêm mục tiêu cho KPI đơn vị 
function addTargetKPIUnit(newTarget) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`/kpiunits/create-target`, requestOptions).then(handleResponse);
}

// Chỉnh sửa KPI đơn vị
function editKPIUnit(id, newKPI) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKPI)
    };

    return fetch(`/kpiunits/${id}`, requestOptions).then(handleResponse);
}

// Chỉnh sửa trạng thái của KPI đơn vị
function editStatusKPIUnit(id, status) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`/kpiunits/status/${id}/${status}`, requestOptions).then(handleResponse);
}


// Chỉnh sửa mục tiêu của KPI đơn vị
function editTargetKPIUnit(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };

    return fetch(`/kpiunits/target/${id}`, requestOptions).then(handleResponse);
}


// Xóa KPI đơn vị
function deleteKPIUnit(id) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/kpiunits/${id}`, requestOptions).then(handleResponse);
}

// xóa mục tiêu của KPI đơn vị
function deleteTargetKPIUnit(id, kpiunit) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/kpiunits/target/${kpiunit}/${id}`, requestOptions).then(handleResponse);
}