import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
export const managerServices = {
    getAllKPIUnit,
    getCurrentKPIUnit,
    getChildTargetOfCurrentTarget,
    addKPIUnit,
    evaluateKPIUnit,
}

// Lấy tất cả KPI đơn vị
async function getAllKPIUnit(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpiunits/unit/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Lấy KPI đơn vị hiện tại
async function getCurrentKPIUnit(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpiunits/current-unit/role/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Lấy tất cả KPI đơn vị
async function getChildTargetOfCurrentTarget(id) {
    const token= getStorage();
    const verified= await jwt.verify(token, TOKEN_SECRET);
    var id= verified._id;

    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpiunits/child-target/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

// Khởi tạo KPI đơn vị 
async function addKPIUnit(newKPI) {
    const requestOptions = {
        url: '${LOCAL_SERVER_API}/kpiunits/create',
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newKPI)
    };

    return axios(requestOptions);
}


// Cập nhật dữ liệu cho KPI đơn vị
function evaluateKPIUnit(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpiunits/evaluate/${id}`,
        method: 'PUT',
        headers: AuthenticateHeader(),
    };

    return axios(requestOptions);
}
