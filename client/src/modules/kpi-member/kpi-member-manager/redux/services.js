import {handleResponse} from '../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../config';
import jwt from 'jsonwebtoken';
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
    console.log(infosearch);
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/all-member/${infosearch.role}/${infosearch.user}/${infosearch.status}/${infosearch.starttime}/${infosearch.endtime}`, requestOptions).then(handleResponse);
}
// Lấy tất cả kpi cá nhân
async function getAllKPIMemberByMember() {
    console.log("gọi API lấy tất cả kpi cá nhân");
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var member = verified._id;
    console.log("MEMBER: ", member)
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/user/${member}`, requestOptions).then(handleResponse);
}
 
// Lấy KPI cá nhân của nhân vien theo id
function getKPIMemberById(id) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/${id}`, requestOptions).then(handleResponse);
}
// Lấy KPI cá nhân của nhân vien theo tháng
function getKPIMemberByMonth(id, time) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/member/${id}/${time}`, requestOptions).then(handleResponse);
}
 
// Phê duyệt kpi cá nhân
function approveKPIMember(id) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/approve/${id}`, requestOptions).then(handleResponse);
}
 
// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIMember(id, newTarget) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTarget)
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/target/${id}`, requestOptions).then(handleResponse);
}
// chỉnh sửa trạng thái của kpi cá nhân
function editStatusTarget(id, status) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/status-target/${id}/${status}`, requestOptions).then(handleResponse);
}

function getTaskById(id) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };
 
    return fetch(`${LOCAL_SERVER_API}/kpimembers/task/${id}`, requestOptions).then(handleResponse);
}

// chỉnh sửa approvepoint

function setPointKPI(id_kpi, id_target, newPoint){
    const requestOptions ={
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newPoint)
    };
    return fetch(`${LOCAL_SERVER_API}/kpimembers/appovepoint/${id_kpi}/${id_target}`, requestOptions).then(handleResponse);
}