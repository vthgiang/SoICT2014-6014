import { getStorage } from '../../../../../config';
import { LOCAL_SERVER_API } from '../../../../../env';
import { sendRequest } from '../../../../../helpers/requestHelper';
export const kpiMemberServices = {
    getAllKPIMemberOfUnit,
    getKPIMemberByMonth,
    getKPIMemberById,
    approveKPIMember,
    editTargetKPIMember,
    editStatusTarget,
    getTaskById,
    setPointKPI,
};
/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
*/
function getAllKPIMemberOfUnit(infosearch) {
    console.log(infosearch);
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpi-sets/`,
        method: 'GET',
        params: {
            roleId: infosearch.role,
            user: infosearch.user,
            status: infosearch.status,
            startDate: infosearch.startDate,
            endDate: infosearch.endDate
        }
    }, false, true, 'kpi.evaluation');
}
/**
* Lấy KPI cá nhân của nhân vien theo id của kpi
*/
function getKPIMemberById(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpi-sets/${id}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
/**
 *  Lấy KPI cá nhân của nhân vien theo tháng 
*/
function getKPIMemberByMonth(userId, date) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpi-sets`,
        method: 'GET',
        params: {
            userId: userId,
            date: date,
        }
    }, false, true, 'kpi.evaluation')
}
/**
* Phê duyệt kpi cá nhân 
*/
function approveKPIMember(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpi-sets/${id}/approve`,
        method: 'PATCH',
    }, true, true, 'kpi.evaluation');
}
/**
 *  Chỉnh sửa mục tiêu KPI cá nhân
*/
function editTargetKPIMember(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpi-sets/${id}`,
        method: 'PATCH',
        data: newTarget
    }, true, true, 'kpi.evaluation')
}
/**
 *  chỉnh sửa trạng thái của kpi cá nhân
*/
function editStatusTarget(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${id}`,
        method: 'PATCH',
        params: {
            status: status
        }
    }, true, true, 'kpi.evaluation');
}
/**
 *  Lấy danh sách công việc theo id của kpi con
*/
function getTaskById(id, employeeId, date, kpiType) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${id}/task`,
        method: 'GET',
        params: {
            employeeId: employeeId,
            date: date,
            kpiType: kpiType
        }
    }, false, true, 'kpi.evaluation')
}
/**
 *  chỉnh sửa approvepoint 
*/
function setPointKPI(employeeId, kpiType, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${employeeId}/task-importance-level`,
        method: 'PATCH',
        data: data,
        params: {
            employeeId: employeeId,
            kpiType: kpiType
        }
    }, true, true, 'kpi.evaluation')
}
