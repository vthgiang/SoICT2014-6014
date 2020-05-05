import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { sendRequest } from '../../../../../helpers/requestHelper';
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
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/all-member/${infosearch.role}/${infosearch.user}/${infosearch.status}/${infosearch.starttime}/${infosearch.endtime}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
// Lấy tất cả kpi cá nhân
async function getAllKPIMemberByMember() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var member = verified._id;
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/user/${member}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
 
// Lấy KPI cá nhân của nhân vien theo id
function getKPIMemberById(id) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/${id}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
// Lấy KPI cá nhân của nhân vien theo tháng
function getKPIMemberByMonth(id, time) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/member/${id}/${time}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation')
}
 
// Phê duyệt kpi cá nhân
function approveKPIMember(id) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/approve/${id}`,
        method: 'PUT',
    }, true, true, 'kpi.evaluation');
}
 
// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIMember(id, newTarget) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/target/${id}`,
        method: 'PUT',
        data: newTarget
    }, true, true, 'kpi.evaluation')
}
// chỉnh sửa trạng thái của kpi cá nhân
function editStatusTarget(id, status) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/status-target/${id}/${status}`,
        method: 'PUT',
    }, true, true, 'kpi.evaluation');
}
 
function getTaskById(id) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/task/${id}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation')
}
 
// chỉnh sửa approvepoint
 
function setPointKPI(id_kpi, id_target, newPoint){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/appovepoint/${id_kpi}/${id_target}`,
        method: 'PUT',
        data: newPoint
    }, true, true, 'kpi.evaluation')
}