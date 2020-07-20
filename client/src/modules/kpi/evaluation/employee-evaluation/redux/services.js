import { getStorage } from '../../../../../config';
import { LOCAL_SERVER_API } from '../../../../../env';
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
    setkpiImportantLevel,
};
/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
*/
function getAllKPIMemberOfUnit(infosearch) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/all-member/${infosearch.role}/${infosearch.user}/${infosearch.status}/${infosearch.startDate}/${infosearch.endDate}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
/**
 * Lấy tất cả kpi cá nhân 
*/
function getAllKPIMemberByMember() {
    let id = getStorage("userId");
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/user/${id}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
 /**
 * Lấy KPI cá nhân của nhân vien theo id 
*/
function getKPIMemberById(id) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/${id}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
/**
 *  Lấy KPI cá nhân của nhân vien theo tháng 
*/
function getKPIMemberByMonth(id, date) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/member/${id}/${date}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation')
}
/**
* Phê duyệt kpi cá nhân 
*/
function approveKPIMember(id) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/approve/${id}`,
        method: 'PUT',
    }, true, true, 'kpi.evaluation');
}
/**
 *  Chỉnh sửa mục tiêu KPI cá nhân
*/
function editTargetKPIMember(id, newTarget) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/target/${id}`,
        method: 'PUT',
        data: newTarget
    }, true, true, 'kpi.evaluation')
}
/**
 *  chỉnh sửa trạng thái của kpi cá nhân
*/
function editStatusTarget(id, status) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/status-target/${id}/${status}`,
        method: 'PUT',
    }, true, true, 'kpi.evaluation');
}
/**
 *  Lấy danh sách công việc theo id
*/
function getTaskById(id, employeeId, date, kpiType) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/task/${id}/${employeeId}/${date}/${kpiType}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation')
}
/**
 *  chỉnh sửa approvepoint 
*/
function setPointKPI(employeeId, kpiType, data){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/taskImportanceLevel/${employeeId}/${kpiType}`,
        method: 'PUT',
        data: data
    }, true, true, 'kpi.evaluation')
}
/**
 * Tính điểm KPI 
*/
function setkpiImportantLevel(id_kpi, kpiImportantLevel){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpimembers/importantlevel/${id_kpi}`,
        method: 'PUT',
        data: kpiImportantLevel
    }, true, true, 'kpi.evaluation')
}
