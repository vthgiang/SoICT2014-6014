import {handleResponse} from '../../../../helpers/HandleResponse';

import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage, AuthenticateHeader
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
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/current-unit/role/${id}`, requestOptions).then(handleResponse);
}

// Lấy KPI đơn vị cha
function getKPIParent(parentUnit) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };
    return fetch(`${LOCAL_SERVER_API}/kpiunits/parent/${parentUnit}`, requestOptions).then(handleResponse);
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
        headers: AuthenticateHeader(),
        body: JSON.stringify(newKPI)
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/create`, requestOptions).then(handleResponse);
}

// Thêm mục tiêu cho KPI đơn vị 
function addTargetKPIUnit(newTarget) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTarget)
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/create-target`, requestOptions).then(handleResponse);
}

// Chỉnh sửa KPI đơn vị
async function editKPIUnit(id, newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var creater = verified._id;
    newKPI = {...newKPI, creater: creater};
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newKPI)
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/${id}`, requestOptions).then(handleResponse);
}

// Chỉnh sửa trạng thái của KPI đơn vị
function editStatusKPIUnit(id, status) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/status/${id}/${status}`, requestOptions).then(handleResponse);
}


// Chỉnh sửa mục tiêu của KPI đơn vị
function editTargetKPIUnit(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTarget)
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/target/${id}`, requestOptions).then(handleResponse);
}


// Xóa KPI đơn vị
function deleteKPIUnit(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/${id}`, requestOptions).then(handleResponse);
}

// xóa mục tiêu của KPI đơn vị
function deleteTargetKPIUnit(id, kpiunit) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/target/${kpiunit}/${id}`, requestOptions).then(handleResponse);
}