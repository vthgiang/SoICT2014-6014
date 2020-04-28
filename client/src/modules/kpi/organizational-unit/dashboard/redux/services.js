import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest} from '../../../../../helpers/requestHelper'
export const dashboardServices = {
    getAllKPIUnit,
    // getCurrentKPIUnit,
    // getChildTargetOfCurrentTarget,
    // addKPIUnit,
    evaluateKPIUnit,
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/unit/${id}`,
        method: 'GET',
    },false,'kpi.organizational_unit');

}

// Lấy KPI đơn vị hiện tại
// function getCurrentKPIUnit(id) {
//     const requestOptions = {
//         method: 'GET',
//         headers: AuthenticateHeader()
//     };

//     return fetch(`${LOCAL_SERVER_API}/kpiunits/current-unit/role/${id}`, requestOptions).then(handleResponse);
// }

// Lấy tất cả KPI đơn vị
// function getChildTargetOfCurrentTarget(id) {
//     const requestOptions = {
//         method: 'GET',
//         headers: AuthenticateHeader()
//     };

//     return fetch(`${LOCAL_SERVER_API}/kpiunits/child-target/${id}`, requestOptions).then(handleResponse);
// }

// Khởi tạo KPI đơn vị 
// function addKPIUnit(newKPI) {
//     const requestOptions = {
//         method: 'POST',
//         headers: AuthenticateHeader(),
//         body: JSON.stringify(newKPI)
//     };

//     return fetch(`${LOCAL_SERVER_API}/kpiunits/create`, requestOptions).then(handleResponse);
// }


// Cập nhật dữ liệu cho KPI đơn vị
function evaluateKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/evaluate/${id}`,
        method: 'PUT',
    },false,'kpi.organizational_unit');
}

