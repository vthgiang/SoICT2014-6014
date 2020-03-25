import {handleResponse} from '../../../helpers/HandleResponse';
import {
    TOKEN_SECRET
} from '../../../env';
import {
    getStorage
} from '../../../config';
import jwt from 'jsonwebtoken';
export const kpiMemberServices = {
    getAllKPIMemberOfUnit,
    getAllKPIMemberByMember,
    getKPIMemberByMonth,  
    getKPIMemberById,
    approveKPIMember,
    editTargetKPIMember,
    editStatusTarget,
};
// Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
function getAllKPIMemberOfUnit(infosearch) {
    console.log(infosearch);
    const requestOptions = {
        method: 'GET',
    };
 
    return fetch(`/kpimembers/all-member/${infosearch.role}/${infosearch.user}/${infosearch.status}/${infosearch.starttime}/${infosearch.endtime}`, requestOptions).then(handleResponse);
}
// Lấy tất cả kpi cá nhân
async function getAllKPIMemberByMember() {

    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var member = verified._id;
    const requestOptions = {
        method: 'GET',
    };
 
    return fetch(`/kpimembers/user/${member}`, requestOptions).then(handleResponse);
}
 
// Lấy KPI cá nhân của nhân vien theo id
function getKPIMemberById(id) {
    const requestOptions = {
        method: 'GET',
    };
 
    return fetch(`/kpimembers/${id}`, requestOptions).then(handleResponse);
}
// Lấy KPI cá nhân của nhân vien theo tháng
function getKPIMemberByMonth(id, time) {
    const requestOptions = {
        method: 'GET',
    };
 
    return fetch(`/kpimembers/member/${id}/${time}`, requestOptions).then(handleResponse);
}
 
// Phê duyệt kpi cá nhân
function approveKPIMember(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    };
 
    return fetch(`/kpimembers/approve/${id}`, requestOptions).then(handleResponse);
}
 
// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIMember(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
    };
 
    return fetch(`/kpimembers/target/${id}`, requestOptions).then(handleResponse);
}
// chỉnh sửa trạng thái của kpi cá nhân
function editStatusTarget(id, status) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    };
 
    return fetch(`/kpimembers/status-target/${id}/${status}`, requestOptions).then(handleResponse);
}

