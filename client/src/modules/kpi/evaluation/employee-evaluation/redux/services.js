import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
export const kpiMemberServices = {
    getAllKPIMemberOfUnit,
    getAllKPIMemberByMember,
    getKPIMemberByMonth,  
    getKPIMemberById,
    approveKPIMember,
    editTargetKPIMember,
    editStatusTarget,
    getTaskById,
    setPointKPI,
};
// Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
function getAllKPIMemberOfUnit(infosearch) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/all-member/${infosearch.role}/${infosearch.user}/${infosearch.status}/${infosearch.starttime}/${infosearch.endtime}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return axios(requestOptions);
}
// Lấy tất cả kpi cá nhân
async function getAllKPIMemberByMember() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var member = verified._id;
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/user/${member}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return axios(requestOptions);
}
 
// Lấy KPI cá nhân của nhân vien theo id
function getKPIMemberById(id) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return axios(requestOptions);
}
// Lấy KPI cá nhân của nhân vien theo tháng
function getKPIMemberByMonth(id, time) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/member/${id}/${time}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return axios(requestOptions);
}
 
// Phê duyệt kpi cá nhân
function approveKPIMember(id) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/approve/${id}`,
        method: 'PUT',
        headers: AuthenticateHeader()
    };
 
    return fetch(requestOptions);
}
 
// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIMember(id, newTarget) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/target/${id}`,
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTarget)
    };
 
    return axios(requestOptions);
}
// chỉnh sửa trạng thái của kpi cá nhân
function editStatusTarget(id, status) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/status-target/${id}/${status}`,
        method: 'PUT',
        headers: AuthenticateHeader()
    };
 
    return axios(requestOptions);
}

function getTaskById(id) {
    const requestOptions = {
        url:`${LOCAL_SERVER_API}/kpimembers/task/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return axios(requestOptions);
}

// chỉnh sửa approvepoint

function setPointKPI(id_kpi, id_target, newPoint){
    const requestOptions ={
        url:`${LOCAL_SERVER_API}/kpimembers/appovepoint/${id_kpi}/${id_target}`,
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newPoint)
    };
    return axios(requestOptions);
}