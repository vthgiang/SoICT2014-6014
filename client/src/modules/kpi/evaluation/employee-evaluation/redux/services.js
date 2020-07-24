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
    console.log(infosearch);
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers`,
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
* Lấy tất cả kpi cá nhân theo người tạo
*/
function getAllKPIMemberByMember() {
    let userId = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${userId}/user`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
/**
* Lấy KPI cá nhân của nhân vien theo id của kpi
*/
function getKPIMemberById(kpiId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${kpiId}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
/**
 *  Lấy KPI cá nhân của nhân vien theo tháng 
*/
function getKPIMemberByMonth(userId, date) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${userId}/user`,
        method: 'GET',
        params: {
            date: date,
        }
    }, false, true, 'kpi.evaluation')
}
/**
* Phê duyệt kpi cá nhân 
*/
function approveKPIMember(kpiId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${kpiId}/approve`,
        method: 'PUT',
    }, true, true, 'kpi.evaluation');
}
/**
 *  Chỉnh sửa mục tiêu KPI cá nhân
*/
function editTargetKPIMember(kpiId, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${kpiId}/target`,
        method: 'PUT',
        data: newTarget
    }, true, true, 'kpi.evaluation')
}
/**
 *  chỉnh sửa trạng thái của kpi cá nhân
*/
function editStatusTarget(kpiId, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${kpiId}/status-target`,
        method: 'PUT',
        params: {
            status: status
        }
    }, true, true, 'kpi.evaluation');
}
/**
 *  Lấy danh sách công việc theo id của kpi con
*/
function getTaskById(kpiId, employeeId, date, kpiType) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${kpiId}/task`,
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
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${employeeId}/taskImportanceLevel`,
        method: 'PUT',
        data: data,
        params: {
            employeeId: employeeId,
            kpiType: kpiType
        }
    }, true, true, 'kpi.evaluation')
}
/**
 * Tính điểm KPI 
*/
function setkpiImportantLevel(kpiId, kpiImportantLevel) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpimembers/employee-kpis/${kpiId}/importantlevel`,
        method: 'PUT',
        data: kpiImportantLevel
    }, true, true, 'kpi.evaluation')
}
