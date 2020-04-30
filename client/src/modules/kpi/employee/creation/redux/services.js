import {handleResponse} from '../../../../../helpers/handleResponse';

import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const createKpiSetService = {
    getEmployeeKpiSet,
    editEmployeeKpiSet,
    updateEmployeeKpiSetStatus,
    deleteEmployeeKpiSet,
    deleteEmployeeKpi,

    createEmployeeKpi,
    editEmployeeKpi,
    createEmployeeKpiSet,
    approveEmployeeKpiSet
};

/** Lấy tập KPI cá nhân hiện tại */ 
async function getEmployeeKpiSet() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/current/${id}`,
        method: 'GET'
    });
}

/** Chỉnh sửa thông tin chung của KPI cá nhân*/ 
async function editEmployeeKpiSet(id, newTarget) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var creater = verified._id;
    newTarget = {...newTarget, creater: creater};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/${id}`,
        method: 'PUT',
        data: newTarget
    }, true, 'employee_kpi_set.create_employee_kpi_set.general_information');
}

/** Chỉnh sửa trạng thái của KPI cá nhân */ 
function updateEmployeeKpiSetStatus(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/status/${id}/${status}`,
        method: 'PUT'
    }, true, 'employee_kpi_set.create_employee_kpi_set');
}

/** Xóa KPI cá nhân */
function deleteEmployeeKpiSet(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/${id}`,
        method: 'DELETE'
    }, true, 'employee_kpi_set.create_employee_kpi_set.general_information');
}

/** Xóa mục tiêu KPI cá nhân */ 
function deleteEmployeeKpi(id, kpipersonal) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/target/${kpipersonal}/${id}`,
        method: 'DELETE'
    }, true, 'employee_kpi_set.create_employee_kpi_set.delete_kpi');
}

/** Tạo 1 mục tiêu KPI cá nhân mới */  
function createEmployeeKpi(newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/create-target`,
        method: 'POST',
        data: JSON.stringify(newTarget)
    }, true, 'employee_kpi_set.create_employee_kpi_modal');
}


/** Chỉnh sửa mục tiêu KPI cá nhân */ 
function editEmployeeKpi(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/target/${id}`,
        method: 'PUT',
        data: JSON.stringify(newTarget)
    }, true, 'employee_kpi_set.edit_employee_kpi_modal');
}

/** Khởi tạo KPI cá nhân */  
async function createEmployeeKpiSet(newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    newKPI = {...newKPI, creator: id};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/create`,
        method: 'POST',
        data: JSON.stringify(newKPI)
    }, true, 'employee_kpi_set.create_employee_kpi_set_modal');
}

/** Phê duyệt kpi cá nhân */ 
function approveEmployeeKpiSet(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/approve/${id}`,
        method: 'PUT'
    });
}