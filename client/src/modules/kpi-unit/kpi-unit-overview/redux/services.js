import {handleResponse} from '../../../../helpers/HandleResponse';
import {
    LOCAL_SERVER_API
} from '../../../../env';
export const overviewServices = {
    getAllKPIUnit,
    getCurrentKPIUnit,
    getChildTargetOfCurrentTarget,
    addKPIUnit,
    evaluateKPIUnit,
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(id) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/unit/${id}`, requestOptions).then(handleResponse);
}

// Lấy KPI đơn vị hiện tại
function getCurrentKPIUnit(id) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/current-unit/role/${id}`, requestOptions).then(handleResponse);
}

// Lấy tất cả KPI đơn vị
function getChildTargetOfCurrentTarget(id) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/child-target/${id}`, requestOptions).then(handleResponse);
}

// Khởi tạo KPI đơn vị 
function addKPIUnit(newKPI) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKPI)
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/create`, requestOptions).then(handleResponse);
}


// Cập nhật dữ liệu cho KPI đơn vị
function evaluateKPIUnit(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`${LOCAL_SERVER_API}/kpiunits/evaluate/${id}`, requestOptions).then(handleResponse);
}
