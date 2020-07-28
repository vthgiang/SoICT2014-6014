import {handleResponse} from '../../../../../helpers/handleResponse';
import { LOCAL_SERVER_API } from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const createKpiSetService = {
    getEmployeeKpiSet,
    getAllEmployeeKpiSetByMonth,
    editEmployeeKpiSet,
    updateEmployeeKpiSetStatus,
    deleteEmployeeKpiSet,
    deleteEmployeeKpi,

    createEmployeeKpi,
    editEmployeeKpi,
    createEmployeeKpiSet,
    approveEmployeeKpiSet,
    createComment,
    editComment,
    deleteComment,
    createCommentOfComment,
    editCommentOfComment,
    deleteCommentOfComment
};

/** Lấy tập KPI cá nhân hiện tại */ 
function getEmployeeKpiSet(month) {
    var id = getStorage("userId");
    const role = getStorage("currentRole");

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {userId:id, role: role, month: month}
    }, false, true);
}

/** Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
function getAllEmployeeKpiSetByMonth(userId, startDate, endDate) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params : {userId:userId,startDate: startDate, endDate :endDate}
    }, false, false)
}

/** Khởi tạo KPI cá nhân */  
function createEmployeeKpiSet(newKPI) {
    var id = getStorage("userId");
    newKPI = {...newKPI, creator: id};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/create`,
        method: 'POST',
        data: JSON.stringify(newKPI)
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Tạo 1 mục tiêu KPI cá nhân mới */  
function createEmployeeKpi(newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpis`,
        method: 'POST',
        data: JSON.stringify(newTarget)
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Chỉnh sửa thông tin chung của KPI cá nhân*/ 
function editEmployeeKpiSet(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/${id}`,
        method: 'POST',
        data: newTarget
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Chỉnh sửa trạng thái của KPI cá nhân */ 
function updateEmployeeKpiSetStatus(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/${id}/status`,
        method: 'POST',
        params: {
            status: status
        }
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Xóa KPI cá nhân */
function deleteEmployeeKpiSet(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/${id}`,
        method: 'DELETE'
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Xóa 1 mục tiêu KPI cá nhân */ 
function deleteEmployeeKpi(id, kpipersonal) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpis/${id}`,
        params: {
           employeeKpiSetId: kpipersonal  
        },
        method: 'DELETE'
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Chỉnh sửa mục tiêu KPI cá nhân */ 

function editEmployeeKpi(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/evaluation/employee-evaluation/employee-kpi-sets/${id}/edit`,
        method: 'POST',
        data: newTarget
    }, true, true, 'kpi.evaluation')
}

/** Phê duyệt kpi cá nhân */ 
function approveEmployeeKpiSet(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/approve/${id}`,
        method: 'PUT'
    }, true, true);
}
/**
 * Tạo comment cho kpi set
 */
function createComment(data){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/comment`,
        method:'POST',
        data : data
    },false,true)
}
/**
 * Tạo comment cho kpi set
 */
function createCommentOfComment(data){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/comment-comment`,
        method:'POST',
        data : data
    },false,true)
}

/**
 * Edit comment cho kpi set
 */
function editComment(id,data){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/comment/${id}`,
        method:'PATCH',
        data : data
    },false,true)
}
/**
 * Delete comment
 */
function deleteComment(id,idKpi){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/comment/${id}`,
        param : {
            kpiId : idKpi
        },
        method:'DELETE',
    },false,true)
}
/**
 * Edit comment of comment
 */
function editCommentOfComment(id,data){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/comment-comment/${id}`,
        method: 'PATCH',
        data: data
    },false,true)
}
/**
 * Delete comment of comment
 */
function deleteCommentOfComment(id,idKPI){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets/comment-comment/${id}/${idKPI}`,
        method: 'DELETE',
    },false,true)
}